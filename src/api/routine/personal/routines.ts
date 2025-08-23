import apiClient from '../../client';
import {
  ApiResponse,
  CreatePersonalRoutineListRequest,
  CreatePersonalRoutineListResponse,
  UpdatePersonalRoutineListRequest,
  UpdatePersonalRoutineListResponse,
  DeletePersonalRoutineListResponse,
} from '../../../types/api';

// 개인루틴 리스트 생성 API
export const makeMyRoutineList = async (
  data: CreatePersonalRoutineListRequest,
): Promise<ApiResponse<CreatePersonalRoutineListResponse>> => {
  const response = await apiClient.post<
    ApiResponse<CreatePersonalRoutineListResponse>
  >('/api/v1/my-routine/list', data);
  return response.data;
};

// 개인루틴 리스트 수정 API
export const updateRoutineToMyRoutineList = async (
  myRoutineListId: string,
  data: UpdatePersonalRoutineListRequest,
): Promise<ApiResponse<UpdatePersonalRoutineListResponse>> => {
  const response = await apiClient.patch<
    ApiResponse<UpdatePersonalRoutineListResponse>
  >(`/api/v1/my-routine/${myRoutineListId}`, data);
  return response.data;
};

// 개인루틴 리스트 삭제 API
export const deleteRoutineToMyRoutineList = async (
  myRoutineListId: string,
): Promise<ApiResponse<DeletePersonalRoutineListResponse>> => {
  const response = await apiClient.delete<
    ApiResponse<DeletePersonalRoutineListResponse>
  >(`/api/v1/my-routine/list/${myRoutineListId}`);
  return response.data;
};
