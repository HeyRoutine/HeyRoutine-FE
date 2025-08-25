import apiClient from '../client';
import {
  ApiResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  ReissueRequest,
  ReissueResponse,
  MyPageResetPasswordRequest,
  MyPageResetPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ResetNicknameRequest,
  ResetNicknameResponse,
  MailSendRequest,
  MailSendResponse,
  MailSendForPasswordRequest,
  MailSendForPasswordResponse,
  AuthCheckRequest,
  AuthCheckResponse,
} from '../../types/api';

// ===== 유저 API 함수들 =====

// 이메일 중복확인
export const checkEmailDuplicate = async (
  email: string,
): Promise<ApiResponse<string>> => {
  // 이메일 URL 인코딩
  const encodedEmail = encodeURIComponent(email);
  const url = `/api/v1/user/email-duplicate-check?email=${encodedEmail}`;

  console.log('🔍 이메일 중복 확인 API 호출:', url);
  console.log('🔍 원본 이메일:', email);
  console.log('🔍 인코딩된 이메일:', encodedEmail);

  const response = await apiClient.post<ApiResponse<string>>(url);

  console.log('🔍 이메일 중복 확인 API 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    code: response.data?.code,
    message: response.data?.message,
    result: response.data?.result,
  });

  return response.data;
};

// 닉네임 중복확인
export const checkNicknameDuplicate = async (
  nickname: string,
): Promise<ApiResponse<string>> => {
  // 닉네임 URL 인코딩
  const encodedNickname = encodeURIComponent(nickname);
  const url = `/api/v1/user/nickname-duplicate-check?nickname=${encodedNickname}`;

  console.log('🔍 닉네임 중복 확인 API 호출:', url);
  console.log('🔍 원본 닉네임:', nickname);
  console.log('🔍 인코딩된 닉네임:', encodedNickname);

  const response = await apiClient.post<ApiResponse<string>>(url);

  console.log('🔍 닉네임 중복 확인 API 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    code: response.data?.code,
    message: response.data?.message,
    result: response.data?.result,
  });

  return response.data;
};

// 로그인
export const signIn = async (
  data: SignInRequest,
): Promise<ApiResponse<SignInResponse>> => {
  const response = await apiClient.post<ApiResponse<SignInResponse>>(
    '/api/v1/user/sign-in',
    data,
  );
  return response.data;
};

// 회원가입
export const signUp = async (
  data: SignUpRequest,
): Promise<ApiResponse<SignUpResponse>> => {
  console.log('🔍 회원가입 API 호출:', '/api/v1/user/sign-up');
  console.log('🔍 회원가입 요청 데이터:', {
    email: data.email,
    password: data.password,
    nickname: data.nickname,
    profileImage: data.profileImage,
    roles: data.roles,
  });

  const response = await apiClient.post<ApiResponse<SignUpResponse>>(
    '/api/v1/user/sign-up',
    data,
  );

  console.log('🔍 회원가입 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    message: response.data?.message,
  });

  return response.data;
};

// 토큰 재발급
export const reissue = async (
  data: ReissueRequest,
): Promise<ApiResponse<ReissueResponse>> => {
  const response = await apiClient.post<ApiResponse<ReissueResponse>>(
    '/api/v1/user/token/reissue',
    data,
  );
  return response.data;
};

// 마이페이지 비밀번호 재설정
export const mypageResetPassword = async (
  data: MyPageResetPasswordRequest,
): Promise<ApiResponse<MyPageResetPasswordResponse>> => {
  const response = await apiClient.patch<
    ApiResponse<MyPageResetPasswordResponse>
  >(
    `/api/v1/user/mypage-password?password=${encodeURIComponent(data.password)}`,
  );

  // 일부 서버가 200/204에서 본문을 비우는 경우 대비
  if (
    response?.data &&
    typeof response.data === 'object' &&
    'isSuccess' in response.data
  ) {
    return response.data;
  }

  const isOk = response?.status >= 200 && response?.status < 300;
  return {
    isSuccess: isOk,
    code: isOk ? 'COMMON200' : 'COMMON500',
    message: isOk ? '성공입니다.' : '실패했습니다.',
    result: isOk ? '비밀번호가 변경되었습니다' : '비밀번호 변경 실패',
  };
};

// 비밀번호 찾기 후 재설정
export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ApiResponse<ResetPasswordResponse>> => {
  const response = await apiClient.patch<ApiResponse<ResetPasswordResponse>>(
    '/api/v1/user/password',
    data,
  );
  return response.data;
};

// 닉네임 재설정
export const resetNickname = async (
  data: ResetNicknameRequest,
): Promise<ApiResponse<ResetNicknameResponse>> => {
  const response = await apiClient.patch<ApiResponse<ResetNicknameResponse>>(
    `/api/v1/user/mypage-nickname?nickname=${encodeURIComponent(data.nickname)}`,
  );

  if (
    response?.data &&
    typeof response.data === 'object' &&
    'isSuccess' in response.data
  ) {
    return response.data;
  }

  const isOk = response?.status >= 200 && response?.status < 300;
  return {
    isSuccess: isOk,
    code: isOk ? 'COMMON200' : 'COMMON500',
    message: isOk ? '성공입니다.' : '실패했습니다.',
    result: isOk ? '닉네임이 변경되었습니다' : '닉네임 변경 실패',
  };
};

// 회원가입 인증메일 보내기
export const mailSend = async (
  data: MailSendRequest,
): Promise<ApiResponse<MailSendResponse>> => {
  const response = await apiClient.post<ApiResponse<MailSendResponse>>(
    '/api/v1/mail/send',
    data,
  );
  return response.data;
};

// 비밀번호 찾기 인증메일 보내기
export const mailSendForPassword = async (
  data: MailSendForPasswordRequest,
): Promise<ApiResponse<MailSendForPasswordResponse>> => {
  const response = await apiClient.post<
    ApiResponse<MailSendForPasswordResponse>
  >('/api/v1/mail/send-password', data);
  return response.data;
};

// 인증번호 확인
export const authCheck = async (
  data: AuthCheckRequest,
): Promise<ApiResponse<AuthCheckResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthCheckResponse>>(
    '/api/v1/mail/auth-check',
    data,
  );
  return response.data;
};

// TODO: 다른 유저 API 함수들 구현 예정
