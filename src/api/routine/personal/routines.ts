import apiClient from '../../client';
import {
  ApiResponse,
  CreatePersonalRoutineListRequest,
  CreatePersonalRoutineListResponse,
  UpdatePersonalRoutineListRequest,
  UpdatePersonalRoutineListResponse,
  DeletePersonalRoutineListResponse,
  PersonalRoutineListResponse,
  PersonalRoutineListParams,
  DonePersonalRoutineResponse,
  DonePersonalRoutineParams,
  DoneMyRoutineListResponse,
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

// 개인루틴 리스트 전체조회 API
export const showMyRoutineList = async (
  params: PersonalRoutineListParams = {},
): Promise<ApiResponse<PersonalRoutineListResponse>> => {
  const { day, date, page = 0, size = 10 } = params;

  const requestParams = {
    ...(day && { day }),
    ...(date && { date }),
    page: page.toString(),
    size: size.toString(),
  };

  const queryString = new URLSearchParams(requestParams).toString();
  console.log('🔍 API 호출:', `/api/v1/my-routine/list?${queryString}`);

  const response = await apiClient.get<
    ApiResponse<PersonalRoutineListResponse>
  >('/api/v1/my-routine/list', {
    params: {
      ...(day && { day }),
      ...(date && { date }),
      page,
      size,
    },
  });

  console.log('🔍 showMyRoutineList 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    result: response.data?.result,
    items: response.data?.result?.items,
    itemsCount: response.data?.result?.items?.length || 0,
  });
  return response.data;
};

// 개인루틴 리스트 수행 API
export const doneRoutineToMyRoutineList = async (
  routineId: string,
  params: DonePersonalRoutineParams,
): Promise<ApiResponse<DonePersonalRoutineResponse>> => {
  const { date } = params;

  const response = await apiClient.post<
    ApiResponse<DonePersonalRoutineResponse>
  >(
    `/api/v1/list/routine/complete/${routineId}`,
    {},
    {
      params: { date },
    },
  );
  return response.data;
};

// 루틴리스트 기록하기 API
export const doneMyRoutineList = async (
  myRoutineListId: string,
): Promise<ApiResponse<DoneMyRoutineListResponse>> => {
  const response = await apiClient.post<ApiResponse<DoneMyRoutineListResponse>>(
    `/api/v1/list/complete/${myRoutineListId}`,
  );
  return response.data;
};
