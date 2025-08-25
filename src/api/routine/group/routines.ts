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

  // TODO: 서버에서 joined 필드가 제공되면 아래 로그 활성화
  // joined 필드 확인을 위한 상세 로그
  // if (response.data?.result?.items) {
  //   console.log('🔍 각 루틴의 joined 필드 확인:');
  //   response.data.result.items.forEach((item, index) => {
  //     console.log(`  루틴 ${index + 1}:`, {
  //       id: item.id,
  //       title: item.title,
  //       isJoined: item.isJoined,
  //       joinedType: typeof item.isJoined,
  //       fullItem: item,
  //     });
  //   });
  // }

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
  const response = await apiClient.delete<
    ApiResponse<LeaveGroupRoutineResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}/leave`);

  return response.data;
};
