import apiClient from '../client';
import { ApiResponse } from '../../types/api';

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

// TODO: 다른 유저 API 함수들 구현 예정
