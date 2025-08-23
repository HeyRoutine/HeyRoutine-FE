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
  RoutineTemplateListResponse,
  RoutineTemplateListParams,
  EmojiListResponse,
  EmojiListParams,
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

// 루틴 템플릿 조회 API
export const getRoutineTemplate = async (
  params: RoutineTemplateListParams = {},
): Promise<ApiResponse<RoutineTemplateListResponse>> => {
  const { category, page = 0, size = 10 } = params;

  const response = await apiClient.get<
    ApiResponse<RoutineTemplateListResponse>
  >('/api/v1/routines/templates', {
    params: {
      ...(category && { category }),
      page,
      size,
    },
  });

  return response.data;
};

// 이모지 전체 조회 API
export const getRoutineEmoji = async (
  params: EmojiListParams = {},
): Promise<ApiResponse<EmojiListResponse>> => {
  const { category } = params;

  const response = await apiClient.post<ApiResponse<EmojiListResponse>>(
    '/api/v1/routines/emoji',
    {},
    {
      params: {
        ...(category && { category }),
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
