import axios, { AxiosResponse } from 'axios';
import { getAccessToken } from './auth.ts';
import { CozylogListItem } from '../types/CozylogType';
import { CommentListItem } from '../types/CommentType.ts';

// 1. Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // 서버 API 기본 주소
  withCredentials: true,                       // 필요에 따라 쿠키 인증 등
  timeout: 5000,                               // 타임아웃 설정 등
});

// 2. 요청/응답 인터셉터 설정
apiClient.interceptors.request.use(
    (config) => {
      // 요청 전 헤더에 토큰 붙임
      const token = getAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  apiClient.interceptors.response.use(
    (response) => {
      // 필요 시 응답을 가공해서 리턴
      return response;
    },
    (error) => {
      // 에러 로깅, 토큰 만료 체크 등
      if (error.response?.status === 401) {  // 서버 응답이 있고 status 코드가 401이라면 → 토큰 만료 or 인증 실패
        alert('인증되지 않은 사용자입니다.');
        sessionStorage.removeItem('token');
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

// 3. API 함수 정의 (GET/POST/PUT/DELETE 등)
/* 신고된 코지로그 리스트 조회(GET) */
export const getViolatedCozylogs = async (): Promise<CozylogListItem[]> => {
  // 1. 원본 응답 가져오기
  const response = await apiClient.get(`/admin/violation/log`);
  
  // 2. 서버가 내려주는 전체 JSON에서 실제 데이터 추출
  const originalData = response.data;
  const contentArray = originalData.data.content; 

  // 3. 각 item을 원하는 형태로 가공하여 리턴
  const result = contentArray.map((item: any) => {
    return {
      reportId: item.reportId,
      reporter: item.reporter.nickname,
      reporterId: item.reporter.userId,
      reason: item.reportReason,
      reportedDate: item.reportAt,
      title: item.title,
      content: item.content,
      writer: item.writer.nickname,
      writerId: item.writer.userId,
      postedDate: item.createdAt
    };
  });

  return result;
};
  /* 신고된 댓글 리스트 조회(GET) */
  export const getViolatedComments = async (): Promise<CommentListItem[]> => {
    // 1. GET 요청
    const response = await apiClient.get(`/admin/violation/comment`);
    
    // 2. 서버 응답에서 필요한 부분 추출
    const originalData = response.data;
    const contentArray = originalData.data.content;
  
    // 3. content 배열의 각 아이템을 CommentListItem 형태로 가공
    const result = contentArray.map((item: any) => {
      return {
        reportId: item.reportId,
        reporter: item.reporter.nickname,
        reporterId: item.reporter.userId,
        reason: item.reportReason,
        reportedDate: item.reportAt,
        commentWriter: item.writer.nickname,
        commentWriterId: item.writer.userId,        
        commentDate: item.createdAt,
        content: item.comment,
      };
    });
  
    return result;
  };

  /* 코지로그 신고 처리 (POST) */
  interface CreatePostData {
    process: string;  // 1. 승인할 떄 → APPROVED  2. 반려할 때 → REJECTED
    reportId: number;
  }
  
  export const blockCozylog = async (postData: CreatePostData) => {
    const response: AxiosResponse<any> = await apiClient.post(
      '/admin/violation/log',
      postData
    );
    return response.data;
  };

  /* 댓글 신고 처리 (POST) */
  export const blockComment = async (postData: CreatePostData) => {
    const response: AxiosResponse<any> = await apiClient.post(
      '/admin/violation/comment',
      postData
    );
    return response.data;
  };
  
  export default apiClient;