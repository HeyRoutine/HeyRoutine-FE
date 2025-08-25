import apiClient from '../../client';
import {
  ApiResponse,
  GroupRoutineListResponse,
  GroupRoutineListParams,
  CreateGroupRoutineRequest,
  CreateGroupRoutineResponse,
  UpdateGroupRoutineRequest,
  UpdateGroupRoutineResponse,
  DeleteGroupRoutineResponse,
  JoinGroupRoutineResponse,
  LeaveGroupRoutineResponse,
  SearchGroupRoutinesParams,
  SearchGroupRoutinesResponse,
} from '../../../types/api';

// 단체루틴 생성 API
export const createGroupRoutine = async (
  data: CreateGroupRoutineRequest,
): Promise<ApiResponse<CreateGroupRoutineResponse>> => {
  const response = await apiClient.post<
    ApiResponse<CreateGroupRoutineResponse>
  >('/api/v1/routines/groups', data);

  return response.data;
};

// 단체루틴 수정 API
export const updateGroupRoutine = async (
  groupRoutineListId: string,
  data: UpdateGroupRoutineRequest,
): Promise<ApiResponse<UpdateGroupRoutineResponse>> => {
  const response = await apiClient.put<ApiResponse<UpdateGroupRoutineResponse>>(
    `/api/v1/routines/groups/${groupRoutineListId}`,
    data,
  );

  return response.data;
};

// 단체루틴 삭제 API
export const deleteGroupRoutine = async (
  groupRoutineListId: string,
): Promise<ApiResponse<DeleteGroupRoutineResponse>> => {
  const response = await apiClient.delete<
    ApiResponse<DeleteGroupRoutineResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}`);

  return response.data;
};

// 단체루틴 리스트 조회 API
export const getGroupRoutines = async (
  params: GroupRoutineListParams = {},
): Promise<ApiResponse<GroupRoutineListResponse>> => {
  const { page = 0, size = 10, joined } = params;

  const requestParams: any = {
    page: page.toString(),
    size: size.toString(),
  };

  // joined 파라미터가 있으면 추가
  if (joined !== undefined) {
    requestParams.joined = joined.toString();
  }

  const queryString = new URLSearchParams(requestParams).toString();

  const response = await apiClient.get<ApiResponse<GroupRoutineListResponse>>(
    '/api/v1/routines/groups',
    {
      params: requestParams,
    },
  );

  console.log('🔍 getGroupRoutines 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    result: response.data?.result,
    items: response.data?.result?.items,
    itemsCount: response.data?.result?.items?.length || 0,
  });

  return response.data;
};

// 단체루틴 가입 API
export const joinGroupRoutine = async (
  groupRoutineListId: string,
): Promise<ApiResponse<JoinGroupRoutineResponse>> => {
  const response = await apiClient.post<ApiResponse<JoinGroupRoutineResponse>>(
    `/api/v1/routines/groups/${groupRoutineListId}/join`,
  );
  return response.data;
};

// 단체루틴 나가기 API
export const leaveGroupRoutine = async (
  groupRoutineListId: string,
): Promise<ApiResponse<LeaveGroupRoutineResponse>> => {
  console.log('🔍 leaveGroupRoutine API 호출:', {
    groupRoutineListId,
    url: `/api/v1/routines/groups/${groupRoutineListId}/leave`,
  });

  const response = await apiClient.delete<
    ApiResponse<LeaveGroupRoutineResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}/leave`);

  console.log('🔍 leaveGroupRoutine API 응답:', {
    status: response.status,
    data: response.data,
  });

  return response.data;
};

// 단체루틴 검색 API
export const searchGroupRoutines = async (
  params: SearchGroupRoutinesParams,
): Promise<ApiResponse<SearchGroupRoutinesResponse>> => {
  const { keyword, page = 0, size = 10 } = params;

  console.log('🔍 단체루틴 검색 API 호출:', { keyword, page, size });

  const response = await apiClient.get<
    ApiResponse<SearchGroupRoutinesResponse>
  >('/api/v1/routines/groups/search', {
    params: {
      keyword,
      page,
      size,
    },
  });

  console.log('🔍 단체루틴 검색 API 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    result: response.data?.result,
    items: response.data?.result?.items,
    itemsCount: response.data?.result?.items?.length || 0,
  });

  return response.data;
};

// 내 단체루틴 조회 API (최신순 정렬)
export const getMyGroupRoutines = async (
  params: GroupRoutineListParams = {},
): Promise<ApiResponse<GroupRoutineListResponse>> => {
  const { page = 0, size = 10 } = params;

  console.log('🔍 내 단체루틴 조회 API 호출:', { page, size });

  const response = await apiClient.get<ApiResponse<GroupRoutineListResponse>>(
    '/api/v1/routines/groups/my',
    {
      params: {
        page,
        size,
      },
    },
  );

  console.log('🔍 내 단체루틴 조회 API 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    result: response.data?.result,
    items: response.data?.result?.items,
    itemsCount: response.data?.result?.items?.length || 0,
  });

  return response.data;
};
