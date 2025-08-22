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
  CreateGroupRoutineDetailRequest,
  CreateGroupRoutineDetailResponse,
  UpdateGroupRoutineDetailRequest,
  UpdateGroupRoutineDetailResponse,
  DeleteGroupRoutineDetailResponse,
  GroupRoutineDetailResponse,
  UpdateGroupRoutineStatusRequest,
  UpdateGroupRoutineStatusResponse,
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

// 단체루틴 상세 생성 API
export const createGroupRoutineDetail = async (
  groupRoutineListId: string,
  data: CreateGroupRoutineDetailRequest,
): Promise<ApiResponse<CreateGroupRoutineDetailResponse>> => {
  const response = await apiClient.post<
    ApiResponse<CreateGroupRoutineDetailResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}/sub-routines`, data);

  return response.data;
};

// 단체루틴 상세 수정 API
export const updateGroupRoutineDetail = async (
  groupRoutineListId: string,
  data: UpdateGroupRoutineDetailRequest,
): Promise<ApiResponse<UpdateGroupRoutineDetailResponse>> => {
  const response = await apiClient.put<
    ApiResponse<UpdateGroupRoutineDetailResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}/sub-routines`, data);

  return response.data;
};

// 단체루틴 상세 삭제 API
export const deleteGroupRoutineDetail = async (
  groupRoutineListId: string,
  routineId: string,
): Promise<ApiResponse<DeleteGroupRoutineDetailResponse>> => {
  const response = await apiClient.delete<
    ApiResponse<DeleteGroupRoutineDetailResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}/sub-routines/${routineId}`);

  return response.data;
};

// 단체루틴 상세 조회 API
export const getGroupRoutineDetail = async (
  groupRoutineListId: string,
  groupRoutineId: string,
): Promise<ApiResponse<GroupRoutineDetailResponse>> => {
  const response = await apiClient.get<ApiResponse<GroupRoutineDetailResponse>>(
    `/api/v1/routines/groups/${groupRoutineListId}/routines/${groupRoutineId}`,
  );

  return response.data;
};

// 단체루틴 상세루틴 성공/실패 API
export const updateGroupRoutineStatus = async (
  groupRoutineListId: string,
  routineId: string,
  data: UpdateGroupRoutineStatusRequest,
): Promise<ApiResponse<UpdateGroupRoutineStatusResponse>> => {
  const response = await apiClient.patch<
    ApiResponse<UpdateGroupRoutineStatusResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}/status/${routineId}`, data);

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
  const { page = 0, size = 10 } = params;

  const response = await apiClient.get<ApiResponse<GroupRoutineListResponse>>(
    '/api/v1/routines/groups',
    {
      params: {
        page,
        size,
      },
    },
  );

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

// 단체루틴 탈퇴 API (향후 확장용)
export const leaveGroupRoutine = async (routineId: number) => {
  const response = await apiClient.delete(
    `/api/v1/routines/groups/${routineId}/join`,
  );
  return response.data;
};
