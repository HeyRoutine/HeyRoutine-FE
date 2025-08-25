import apiClient from '../../client';
import {
  ApiResponse,
  CreatePersonalRoutineDetailRequest,
  CreatePersonalRoutineDetailArrayRequest,
  CreatePersonalRoutineDetailResponse,
  PersonalRoutineDetailListResponse,
  PersonalRoutineDetailListParams,
  UpdatePersonalRoutineDetailRequest,
  UpdatePersonalRoutineDetailResponse,
  DeletePersonalRoutineDetailResponse,
  UpdateRoutineInMyRoutineListRequest,
} from '../../../types/api';

// 개인루틴 리스트 안 루틴 만들기 API
export const makeRoutineToMyRoutineList = async (
  myRoutineListId: string,
  data: CreatePersonalRoutineDetailRequest,
): Promise<ApiResponse<CreatePersonalRoutineDetailResponse>> => {
  console.log(
    '🔍 개인루틴 상세 생성 API 호출:',
    `/api/v1/my-routine/list/routine/${myRoutineListId}`,
  );
  console.log('🔍 개인루틴 상세 생성 요청 데이터:', data);

  const response = await apiClient.post<
    ApiResponse<CreatePersonalRoutineDetailResponse>
  >(`/api/v1/my-routine/list/routine/${myRoutineListId}`, data);

  console.log('🔍 개인루틴 상세 생성 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    message: response.data?.message,
  });

  return response.data;
};

// 개인루틴 리스트 안 루틴 만들기 API (배열)
export const makeRoutinesToMyRoutineList = async (
  myRoutineListId: string,
  data: CreatePersonalRoutineDetailArrayRequest,
): Promise<ApiResponse<CreatePersonalRoutineDetailResponse>> => {
  console.log(
    '🔍 개인루틴 상세 생성 API 호출 (배열):',
    `/api/v1/my-routine/list/routine/${myRoutineListId}`,
  );
  console.log('🔍 개인루틴 상세 생성 요청 데이터 (배열):', data);

  const response = await apiClient.post<
    ApiResponse<CreatePersonalRoutineDetailResponse>
  >(`/api/v1/my-routine/list/routine/${myRoutineListId}`, data);

  console.log('🔍 개인루틴 상세 생성 응답 (배열):', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    message: response.data?.message,
  });

  return response.data;
};

// 개인루틴 리스트 안 루틴 조회 API
export const getRoutinesInListByDate = async (
  myRoutineListId: string,
  params: PersonalRoutineDetailListParams,
): Promise<ApiResponse<PersonalRoutineDetailListResponse>> => {
  const { date } = params;

  const queryString = new URLSearchParams({ date }).toString();
  console.log(
    '🔍 개인루틴 상세 조회 API 호출:',
    `/api/v1/my-routine/list/routine/${myRoutineListId}?${queryString}`,
  );

  const response = await apiClient.get<
    ApiResponse<PersonalRoutineDetailListResponse>
  >(`/api/v1/my-routine/list/routine/${myRoutineListId}`, {
    params: { date },
  });

  console.log('🔍 개인루틴 상세 조회 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    items: response.data?.result,
    itemsCount: response.data?.result?.length || 0,
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

// 개인루틴 리스트 안 루틴 수정 API (새로운 스펙)
export const updateRoutineInMyRoutineListV2 = async (
  myRoutineListId: string,
  data: UpdateRoutineInMyRoutineListRequest,
): Promise<ApiResponse<string>> => {
  console.log(
    '🔍 개인루틴 리스트 수정 API 호출:',
    `/api/v1/my-routine/list/routine/${myRoutineListId}`,
  );
  console.log('🔍 개인루틴 리스트 수정 요청 데이터:', data);

  const response = await apiClient.patch<ApiResponse<string>>(
    `/api/v1/my-routine/list/routine/${myRoutineListId}`,
    data,
  );

  console.log('🔍 개인루틴 리스트 수정 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    message: response.data?.message,
  });

  return response.data;
};

// 개인루틴 리스트 안 루틴 삭제 API
export const deleteRoutineInMyRoutineList = async (
  routineId: string,
): Promise<ApiResponse<DeletePersonalRoutineDetailResponse>> => {
  const response = await apiClient.delete<
    ApiResponse<DeletePersonalRoutineDetailResponse>
  >(`/api/v1/my-routine/list/routine/${routineId}`);
  return response.data;
};
