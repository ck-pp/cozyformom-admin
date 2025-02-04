import axios, { AxiosResponse } from 'axios';

// 1. Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'https://api.cozyformom.com/api/v1', // 서버 API 기본 주소
  withCredentials: true,              // 필요에 따라 쿠키 인증 등
  // timeout: 5000,                   // 타임아웃 설정 등
});

// 2. 요청/응답 인터셉터 설정(선택)
apiClient.interceptors.request.use(
    (config) => {
      // 요청 전 헤더에 토큰을 붙이거나 등등
      // config.headers.Authorization = `Bearer ${token}`;
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
      return Promise.reject(error);
    }
  );

// 3. API 함수 정의 (GET/POST/PUT/DELETE 등)
/* 신고된 코지로그 리스트 조회(GET) */
export const getViolatedCozylogs = async (userId: string) => {
    const response: AxiosResponse<{ 
      id: string; 
      name: string; 
      email: string; 
    }> = await apiClient.get(`/admin/violation/log?page=0&size=10`);  // TODO: 사이즈 안주면 디폴트가 10인지 물어보기
    return response.data;
  };
  
  /* 신고된 댓글 리스트 조회(GET) */
export const getViolatedComments = async (userId: string) => {
    const response: AxiosResponse<{ 
      id: string; 
      name: string; 
      email: string; 
    }> = await apiClient.get(`/v1/admin/violation/comment?page=&size=10`);
    return response.data;
  };

  /* 코지로그 신고 처리 (POST) */
  interface CreatePostData {
    reportId: number;
    process: string;  // 1. 승인할 떄 → APPROVED  2. 반려할 때 → REJECTED
  }
  
  interface CreatedPostResponse {
    id: number;
    title: string;
    content: string;
    createdAt: string;
  }
  
  export const blockCozylog = async (postData: CreatePostData) => {
    const response: AxiosResponse<CreatedPostResponse> = await apiClient.post(
      '/admin/violation/log',
      postData
    );
    return response.data;
  };

  /* 댓글 신고 처리 (POST) */
  interface CreatePostData {
    reportedId: number;
    content: string;  // 1. 승인할 떄 → APPROVED  2. 반려할 때 → REJECTED
  }
  
  interface CreatedPostResponse {
    id: number;
    title: string;
    content: string;
    createdAt: string;
  }
  
  export const blockComment = async (postData: CreatePostData) => {
    const response: AxiosResponse<CreatedPostResponse> = await apiClient.post(
      '/cozy-log/violation/comment',
      postData
    );
    return response.data;
  };
  
  /** 예시: 공통적으로 쓸 수도 있는 'apiClient' 자체를 export */
  export default apiClient;