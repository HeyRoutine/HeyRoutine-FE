import apiClient from '../../client';
import {
  ApiResponse,
  GroupRoutineListResponse,
  GroupRoutineListParams,
} from '../../../types/api';

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

// 단체루틴 참여 API (향후 확장용)
export const joinGroupRoutine = async (routineId: number) => {
  const response = await apiClient.post(
    `/api/v1/routines/groups/${routineId}/join`,
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
