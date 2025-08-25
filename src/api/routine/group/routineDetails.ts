import apiClient from '../../client';
import {
  ApiResponse,
  CreateGroupRoutineDetailRequest,
  CreateGroupRoutineDetailResponse,
  UpdateGroupRoutineDetailRequest,
  UpdateGroupRoutineDetailResponse,
  DeleteGroupRoutineDetailResponse,
  GroupRoutineDetailResponse,
  UpdateGroupRoutineStatusRequest,
  UpdateGroupRoutineStatusResponse,
} from '../../../types/api';

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
export const getGroupRoutineDetail = async (groupRoutineListId: string) => {
  const response = await apiClient.get<ApiResponse<GroupRoutineDetailResponse>>(
    `/api/v1/routines/groups/${groupRoutineListId}`,
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

// 단체루틴 기록 성공/실패 API
export const updateGroupRoutineRecord = async (
  groupRoutineListId: string,
  data: UpdateGroupRoutineStatusRequest,
): Promise<ApiResponse<UpdateGroupRoutineStatusResponse>> => {
  const response = await apiClient.patch<
    ApiResponse<UpdateGroupRoutineStatusResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}`, data);

  return response.data;
};
