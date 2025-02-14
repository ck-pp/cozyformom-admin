/* src/pages/Login/Login.tsx */

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserType } from '../../types/UserType.ts';
import '../../types/global.d.ts';
import KakaoLoginButtonImage from '../../assets/images/KakaoLoginButtonImage.png';
import { authenticateByOauth } from '../../api/OauthApiService.ts';

function LoginPage() {
  
  const isMountedRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트 언마운트 시점(= 컴포넌트가 화면에서 사라진 상태)
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 카카오 SDK 초기화 (최초 1회)
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
      console.log('[Kakao SDK] init:', window.Kakao.isInitialized());
    }
  }, []);

  // 카카오 로그인 함수
  const handleKakaoLogin = async () => {
    if (!window.Kakao) {
      console.error('Kakao SDK가 로드되지 않았습니다.');
      return;
    }

    try {
      // 1. 카카오 로그인 (팝업)
      const authObj = await new Promise<any>((resolve, reject) => {
        window.Kakao.Auth.login({
          success: (res: any) => resolve(res),
          fail: (err: any) => reject(err),
        });
      });

      // 2. 액세스 토큰 추출
      const accessToken = authObj.access_token;
      console.log('카카오 로그인 성공');

      // ※ 사용자 정보가 필요하다면, Kakao.API.request로 추가 프로필 요청 가능
      //   window.Kakao.API.request({ url: '/v2/user/me', success, fail });

      // 3. 백엔드 인증 API
      const userType = await authenticateByOauth(accessToken);

      // 비동기 콜백이 컴포넌트가 이미 언마운트된 시점에 실행되었다.
      // if (!isMountedRef.current) return;

      if (userType === UserType.GUEST || userType === UserType.USER) {
        // (1) 게스트/일반 사용자 → 로그인 페이지
        console.log(`${userType}: 회원가입 화면 이동`);
        navigate('/')
        alert('관리자 계정이 아닙니다.');
      } else if (userType === UserType.ADMIN) {
        // (2) 관리자 → 관리자 페이지
        console.log('ADMIN: 메인 화면 이동');
        navigate('/admin')
      } else {
        console.log('인증 실패 또는 userType를 찾을 수 없음');
      }
    } catch (error) {
      console.error('카카오 로그인 실패 or 백엔드 인증 실패:', error);
    }
  };

    return (
        <div className='login-container' style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
            <img src={KakaoLoginButtonImage} alt='KakaoLoginButtonImage' style={{
                width: '30%',
            }} onClick={handleKakaoLogin}>
      </img>
        </div>
    );
}

export default LoginPage;