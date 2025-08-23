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
} from '../../types/api';

// ===== 유저 API 함수들 =====

// 이메일 중복확인
export const checkEmailDuplicate = async (
  email: string,
): Promise<ApiResponse<string>> => {
  // 이메일 URL 인코딩
  const encodedEmail = encodeURIComponent(email);
  const url = `/api/v1/user/email-duplicate-check?email=${encodedEmail}`;

  const response = await apiClient.post<ApiResponse<string>>(url);
  return response.data;
};

// 닉네임 중복확인
export const checkNicknameDuplicate = async (
  nickname: string,
): Promise<ApiResponse<string>> => {
  const response = await apiClient.post<ApiResponse<string>>(
    `/api/v1/user/nickname-duplicate-check?nickname=${nickname}`,
  );
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
  const response = await apiClient.post<ApiResponse<SignUpResponse>>(
    '/api/v1/user/sign-up',
    data,
  );
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
  >(`/api/v1/user/mypage-password?password=${data.password}`);
  return response.data;
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
    `/api/v1/user/mypage-nickname?nickname=${data.nickname}`,
  );
  return response.data;
};

// TODO: 다른 유저 API 함수들 구현 예정
