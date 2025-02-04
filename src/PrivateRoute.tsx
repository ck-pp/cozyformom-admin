// src/PrivateRoute.tsx

import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // 실제로는 JWT 토큰 검사, 서버 검증, Redux 상태, etc.
  // 아래 예시는 단순히 로컬 스토리지 토큰 존재 여부로 가정
  const isLoggedIn = !!localStorage.getItem('accessToken');

  if (!isLoggedIn) {
    // 로그인이 안 되어 있다면, 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  // 로그인이 되어 있으면, 보호된 페이지(자식 컴포넌트)를 그대로 렌더링
  return children;
};

export default PrivateRoute;
