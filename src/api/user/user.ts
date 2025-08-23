import apiClient from '../client';
import {
  ApiResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from '../../types/api';

// ===== 유저 API 함수들 =====

// 이메일 중복확인
export const checkEmailDuplicate = async (
  email: string,
): Promise<ApiResponse<string>> => {
  const response = await apiClient.post<ApiResponse<string>>(
    `/api/v1/user/email-duplicate-check?email=${email}`,
  );
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

// TODO: 다른 유저 API 함수들 구현 예정
