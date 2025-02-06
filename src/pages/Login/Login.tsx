/* src/pages/Login/Login.tsx */

import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import KakaoLoginButtonImage from '../../assets/images/KakaoLoginButtonImage.png';

enum UserType {
  guest = 'guest',
  user = 'user',
  admin = 'admin',
}

enum OauthType {
  kakao = 'kakao',
  apple = 'apple',
}

interface IJoinInputData {
  email?: string;
  name?: string;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setOauthType: (type: OauthType) => void;
}

// 예: Context API나 Redux를 쓴다고 가정. 여기서는 간단히 훅으로 대체
// 실제 구현 시, Context 나 Redux Store에 있는 joinInputData를 가져오면 됩니다.
function useJoinInputData(): IJoinInputData {
  const [email, setEmail] = React.useState<string>();
  const [name, setName] = React.useState<string>();
  const joinInputData = {
    email,
    name,
    setEmail: (val: string) => setEmail(val),
    setName: (val: string) => setName(val),
    setOauthType: (type: OauthType) => {
      console.log('oauthType set: ', type);
    },
  };
  return joinInputData;
}

function LoginPage() {
  const joinInputData = useJoinInputData();

  // React에서 "mounted" 여부를 확인하기 위해 ref 사용
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 1) Kakao SDK 초기화 (최초 1회만)
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
      console.log(process.env.REACT_APP_KAKAO_JS_KEY)
      // console.log('Kakao SDK init:', window.Kakao.isInitialized());
    }
  }, []);

  // 2) 카카오 로그인 로직
  const kakaoLogin = async (): Promise<UserType | undefined> => {
    try {
      // 팝업 로그인
      const authObj: any = await new Promise((resolve, reject) => {
        window.Kakao.Auth.login({
          success: (res: any) => resolve(res),
          fail: (err: any) => reject(err),
        });
      });

      // Flutter: var res = await UserApi.instance.loginWithKakaoTalk()... 와 유사
      const kakaoAccessToken = authObj.access_token;
      console.log('카카오 로그인 성공, access_token:', kakaoAccessToken);

      // 3) 사용자 정보 가져오기
      const userInfo: any = await new Promise((resolve, reject) => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res: any) => resolve(res),
          fail: (err: any) => reject(err),
        });
      });

      // Flutter: var user = await UserApi.instance.me()
      const email = userInfo?.kakao_account?.email;
      const name = userInfo?.kakao_account?.name;

      console.log('카카오 사용자 정보:', userInfo);

      // 이메일/이름을 전역/Context에 저장 (Flutter의 Provider.setEmail/setName)
      if (email && isMountedRef.current) {
        joinInputData.setEmail(email);
      }
      if (name && isMountedRef.current) {
        joinInputData.setName(name);
      }

      // 4) 백엔드에 OAuth 인증 요청 (accessToken 전달 → 서버가 검증 후 userType 반환)
      // Flutter의: return oauthApiService.authenticateByOauth(context, OauthType.kakao, kakaoAccessToken)
      const response = await axios.post('http://localhost:8080/api/oauth/kakao', {
        accessToken: kakaoAccessToken,
      });
      const userType: UserType = response.data?.userType; // guest or user or admin

      return userType;
    } catch (error) {
      console.error('백엔드 인증 실패:', error);
      return undefined;
    }
  };

  // 3) 실제 로그인 버튼 클릭 시 동작
  const handleKakaoLoginClick = async () => {
    joinInputData.setOauthType(OauthType.kakao);
    const userType = await kakaoLogin();

    // Flutter 예시: if (userType == UserType.guest) { ... } else { ... }
    if (!isMountedRef.current || !userType) return;

    if (userType === UserType.guest) {
      // 회원가입 페이지로 이동
      alert('게스트: 회원가입 화면으로 이동합니다.');
      // 예: React Router 사용 시 -> navigate('/join-info')
      // window.location.href = '/join-info';
    } else {
      // 메인 화면으로 이동
      alert('기존 사용자 or 관리자: 메인 화면으로 이동합니다.');
      // 예: navigate('/main');
      // window.location.href = '/main';
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
            }} onClick={handleKakaoLoginClick}>
      </img>
            {/* <KakaoLogin
              token={kakaoClientId}
              onSuccess={kakaoOnSuccess}
              onFail={kakaoOnFailure}
          /> */}
        </div>
    );
}

export default LoginPage;