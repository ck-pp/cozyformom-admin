// src/PrivateRoute.tsx

import { jwtDecode } from 'jwt-decode';
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { JwtPayload } from './api/OauthApiService.ts';
import { getAccessToken } from './api/auth.ts';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // isLoggedIn && isAdmin 조건을 만족해야 진입하도록 함

   // 1) 토큰 가져오기
   const token = getAccessToken();

   if (!token) {
     // 토큰이 없으면 로그인 페이지(혹은 홈)로 리다이렉트
     return <Navigate to="/" replace />;
   }
 
   try {
     // 2) JWT 디코딩 후 role 확인
           const decoded = jwtDecode<JwtPayload>(token);
           const userRole = decoded?.info?.role;
 
     // 3) 관리자만 통과
     if (userRole === 'ADMIN') {
       return children; 
     } else {
       // 관리자 외에는 접근 불가 → 홈 등으로 리다이렉트
       return <Navigate to="/" replace />;
     }
   } catch (err) {
     console.error('Invalid token', err);
     // 토큰 디코딩 실패 시도 마찬가지로 리다이렉트
     return <Navigate to="/" replace />;
   }
 };

export default PrivateRoute;
