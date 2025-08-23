import apiClient from '../../client';
import {
  ApiResponse,
  CreatePersonalRoutineDetailRequest,
  CreatePersonalRoutineDetailResponse,
  PersonalRoutineDetailListResponse,
  PersonalRoutineDetailListParams,
  UpdatePersonalRoutineDetailRequest,
  UpdatePersonalRoutineDetailResponse,
  DeletePersonalRoutineDetailResponse,
} from '../../../types/api';

// 개인루틴 리스트 안 루틴 만들기 API
export const makeRoutineToMyRoutineList = async (
  myRoutineListId: string,
  data: CreatePersonalRoutineDetailRequest,
): Promise<ApiResponse<CreatePersonalRoutineDetailResponse>> => {
  const response = await apiClient.post<
    ApiResponse<CreatePersonalRoutineDetailResponse>
  >(`/api/v1/my-routine/routine/${myRoutineListId}`, data);
  return response.data;
};

// 개인루틴 리스트 안 루틴 조회 API
export const getRoutinesInListByDate = async (
  myRoutineListId: string,
  params: PersonalRoutineDetailListParams,
): Promise<ApiResponse<PersonalRoutineDetailListResponse>> => {
  const { date } = params;

  const response = await apiClient.get<
    ApiResponse<PersonalRoutineDetailListResponse>
  >(`/api/v1/my-routine/list/routine/${myRoutineListId}`, {
    params: { date },
  });
  return response.data;
};

// 개인루틴 리스트 안 루틴 수정 API
export const updateRoutineInMyRoutineList = async (
  myRoutineListId: string,
  data: UpdatePersonalRoutineDetailRequest,
): Promise<ApiResponse<UpdatePersonalRoutineDetailResponse>> => {
  const response = await apiClient.patch<
    ApiResponse<UpdatePersonalRoutineDetailResponse>
  >(`/api/v1/my-routine/list/routine/${myRoutineListId}`, data);
  return response.data;
};

// 개인루틴 리스트 안 루틴 삭제 API
export const deleteRoutineInMyRoutineList = async (
  myRoutineListId: string,
): Promise<ApiResponse<DeletePersonalRoutineDetailResponse>> => {
  const response = await apiClient.delete<
    ApiResponse<DeletePersonalRoutineDetailResponse>
  >(`/api/v1/my-routine/list/routine/${myRoutineListId}`);
  return response.data;
};
