import { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { UserType, findByString } from '../types/UserType.ts';
import apiClient from './baseApi.ts';


// JWT payload 구조 (예시)
export interface JwtPayload {
    iss: string;
    iat: number;
    exp: number;
    sub: string;
    info: {
      role: string; 
      userId?: string;       // USER, ADMIN일 때 존재
      profileImage?: string; // GUEST일 때? 필요 시 추가
      email?: string;
      oauthValue?: string;
    };
  }

  export async function authenticateByOauth(
    value: string
  ): Promise<UserType | null> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(
        `/authenticate/oauth`,
        {
          oauthType: 'kakao',
          deviceToken: null,
          value: value,            // 인증에 사용되는 값 (ex: 카카오 accessToken)
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // 서버 응답에서 message가 필요하다면
      const { message } = response.data;
      console.log('서버 메시지:', message);
  
      // 200 OK 시 Authorization 헤더에서 JWT 추출
      const authHeader = response.headers['authorization'];
      console.log(authHeader);
      if (!authHeader) {
        throw new Error('No Authorization header found');
      }
      const token = authHeader.split(' ')[1]; // "Bearer xxxxx" → xxxxx
  
      // JWT 저장
      sessionStorage.setItem('accessToken', token);
  
      // JWT 디코드하여 role 확인
      const decoded = jwtDecode<JwtPayload>(token);
      const roleString = decoded?.info?.role;
      if (!roleString) {
        throw new Error('No role found in JWT');
      }
  
      const userType = findByString(roleString);
      console.log('Decoded role:', userType);
  
      return userType;
    } catch (error: any) {
      // 네트워크 에러 or status != 200
      console.error('authenticateByOauth Error:', error);

      return null;
    }
  }