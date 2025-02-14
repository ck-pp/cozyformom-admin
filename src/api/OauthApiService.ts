import { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { UserType, findByString } from '../types/UserType.ts';
import apiClient from './baseApi.ts';
import { setAccessToken } from './auth.ts';


// JWT payload 구조
export interface JwtPayload {
    iss: string;
    iat: number;
    exp: number;
    sub: string;
    info: {
      role: string; 
      userId?: string;       // USER, ADMIN일 때 존재
      profileImage?: string; // GUEST일 때 필요 시 추가
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
      // const { message } = response.data;
  
      // 200 OK 시 Authorization 헤더에서 JWT 추출
      const authHeader = response.headers['authorization'];
      if (!authHeader) {
        throw new Error('인증 헤더가 존재하지 않습니다.');
      }
      const token = authHeader.split(' ')[1]; // "Bearer xxxxx" → xxxxx
  
      // JWT 저장
      setAccessToken(token);
  
      // JWT 디코드하여 role 확인
      const decoded = jwtDecode<JwtPayload>(token);
      const roleString = decoded?.info?.role;
      if (!roleString) {
        throw new Error('JWT 토큰 안에 role이 존재하지 않습니다.');
      }
  
      const userType = findByString(roleString);
      console.log('role:', userType);
  
      return userType;
    } catch (error: any) {
      // 네트워크 에러 or status != 200
      console.error('authenticateByOauth Error:', error);

      return null;
    }
  }