import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  getGroupRoutines,
  createGroupRoutine,
  updateGroupRoutine,
  deleteGroupRoutine,
  joinGroupRoutine,
  leaveGroupRoutine,
} from '../../../api/routine/group/routines';
import {
  createGroupRoutineDetail,
  updateGroupRoutineDetail,
  deleteGroupRoutineDetail,
  getGroupRoutineDetail,
  updateGroupRoutineStatus,
  updateGroupRoutineRecord,
} from '../../../api/routine/group/routineDetails';
import {
  getGroupGuestbooks,
  createGroupGuestbook,
  deleteGroupGuestbook,
} from '../../../api/routine/group/guestbooks';
import {
  GroupRoutineListParams,
  CreateGroupRoutineRequest,
  UpdateGroupRoutineRequest,
  CreateGroupRoutineDetailRequest,
  UpdateGroupRoutineDetailRequest,
  UpdateGroupRoutineStatusRequest,
  GroupGuestbookListParams,
  CreateGroupGuestbookRequest,
} from '../../../types/api';

// ===== 단체루틴 기본 CRUD =====

// 단체루틴 리스트 조회 훅
export const useGroupRoutines = (params: GroupRoutineListParams = {}) => {
  return useQuery({
    queryKey: ['groupRoutines', params],
    queryFn: () => getGroupRoutines(params),
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 무한 스크롤용 단체루틴 리스트 조회 훅
export const useInfiniteGroupRoutines = (
  params: Omit<GroupRoutineListParams, 'page' | 'size'> = {},
) => {
  return useInfiniteQuery({
    queryKey: ['infiniteGroupRoutines', params],
    queryFn: ({ pageParam = 0 }) =>
      getGroupRoutines({ ...params, page: pageParam, size: 10 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.result.page < lastPage.result.totalPages - 1) {
        return lastPage.result.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 단체루틴 생성 훅
export const useCreateGroupRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupRoutineRequest) => createGroupRoutine(data),
    onSuccess: () => {
      // 생성 성공 시 단체루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteGroupRoutines'] });
    },
  });
};

// 단체루틴 수정 훅
export const useUpdateGroupRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupRoutineListId,
      data,
    }: {
      groupRoutineListId: string;
      data: UpdateGroupRoutineRequest;
    }) => updateGroupRoutine(groupRoutineListId, data),
    onSuccess: () => {
      // 수정 성공 시 단체루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteGroupRoutines'] });
    },
  });
};

// 단체루틴 삭제 훅
export const useDeleteGroupRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupRoutineListId: string) =>
      deleteGroupRoutine(groupRoutineListId),
    onSuccess: () => {
      // 삭제 성공 시 단체루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteGroupRoutines'] });
    },
  });
};

// 단체루틴 참여 훅
export const useJoinGroupRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupRoutineListId: string) =>
      joinGroupRoutine(groupRoutineListId),
    onSuccess: () => {
      // 참여 성공 시 단체루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteGroupRoutines'] });
    },
  });
};

// 단체루틴 나가기 훅
export const useLeaveGroupRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupRoutineListId: string) =>
      leaveGroupRoutine(groupRoutineListId),
    onSuccess: () => {
      // 나가기 성공 시 단체루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteGroupRoutines'] });
    },
  });
};

// ===== 단체루틴 상세 =====

// 단체루틴 상세 생성 훅
export const useCreateGroupRoutineDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupRoutineListId,
      data,
    }: {
      groupRoutineListId: string;
      data: CreateGroupRoutineDetailRequest;
    }) => createGroupRoutineDetail(groupRoutineListId, data),
    onSuccess: () => {
      // 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutineDetail'] });
      queryClient.invalidateQueries({ queryKey: ['groupRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteGroupRoutines'] });
    },
  });
};

// 단체루틴 상세 수정 훅
export const useUpdateGroupRoutineDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupRoutineListId,
      data,
    }: {
      groupRoutineListId: string;
      data: UpdateGroupRoutineDetailRequest;
    }) => updateGroupRoutineDetail(groupRoutineListId, data),
    onSuccess: () => {
      // 수정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutineDetail'] });
    },
  });
};

// 단체루틴 상세 삭제 훅
export const useDeleteGroupRoutineDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupRoutineListId,
      routineId,
    }: {
      groupRoutineListId: string;
      routineId: string;
    }) => deleteGroupRoutineDetail(groupRoutineListId, routineId),
    onSuccess: () => {
      // 삭제 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutineDetail'] });
    },
  });
};

// 단체루틴 상세 조회 훅
export const useGroupRoutineDetail = (groupRoutineListId: string) => {
  return useQuery({
    queryKey: ['groupRoutineDetail', groupRoutineListId],
    queryFn: () => getGroupRoutineDetail(groupRoutineListId),
    enabled: !!groupRoutineListId,
  });
};

// 단체루틴 상세루틴 성공/실패 훅
export const useUpdateGroupRoutineStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupRoutineListId,
      routineId,
      data,
    }: {
      groupRoutineListId: string;
      routineId: string;
      data: UpdateGroupRoutineStatusRequest;
    }) => updateGroupRoutineStatus(groupRoutineListId, routineId, data),
    onSuccess: () => {
      // 상태 업데이트 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutineDetail'] });
    },
  });
};

// 단체루틴 기록 성공/실패 훅
export const useUpdateGroupRoutineRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupRoutineListId,
      data,
    }: {
      groupRoutineListId: string;
      data: UpdateGroupRoutineStatusRequest;
    }) => updateGroupRoutineRecord(groupRoutineListId, data),
    onSuccess: () => {
      // 기록 업데이트 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutineDetail'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteGroupRoutines'] });
    },
  });
};

// ===== 방명록 =====

// 방명록 조회 훅
export const useGroupGuestbooks = (
  groupRoutineListId: string,
  params: GroupGuestbookListParams = {},
) => {
  return useQuery({
    queryKey: ['groupGuestbooks', groupRoutineListId, params],
    queryFn: () => getGroupGuestbooks(groupRoutineListId, params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 방명록 작성 훅
export const useCreateGroupGuestbook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupRoutineListId,
      data,
    }: {
      groupRoutineListId: string;
      data: CreateGroupGuestbookRequest;
    }) => createGroupGuestbook(groupRoutineListId, data),
    onSuccess: (newGuestbook, variables) => {
      // 작성 성공 시 방명록 캐시에 즉시 추가 (최신 글이 맨 뒤에 오도록)
      queryClient.setQueryData(
        ['groupGuestbooks', variables.groupRoutineListId, {}],
        (oldData: any) => {
          if (!oldData?.result?.items) {
            // 기존 데이터가 없으면 새로 생성
            return {
              isSuccess: true,
              code: 'COMMON200',
              message: '성공입니다.',
              result: {
                items: [newGuestbook.result],
                totalItems: 1,
              },
            };
          }

          return {
            ...oldData,
            result: {
              ...oldData.result,
              items: [...oldData.result.items, newGuestbook.result],
              totalItems: oldData.result.totalItems + 1,
            },
          };
        },
      );
    },
  });
};

// 방명록 삭제 훅
export const useDeleteGroupGuestbook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupRoutineListId,
      guestbookId,
    }: {
      groupRoutineListId: string;
      guestbookId: string;
    }) => deleteGroupGuestbook(groupRoutineListId, guestbookId),
    onSuccess: (_, variables) => {
      // 삭제 성공 시 방명록 캐시에서 즉시 제거
      queryClient.setQueryData(
        ['groupGuestbooks', variables.groupRoutineListId, {}],
        (oldData: any) => {
          if (!oldData?.result?.items) return oldData;

          return {
            ...oldData,
            result: {
              ...oldData.result,
              items: oldData.result.items.filter(
                (item: any) => item.id.toString() !== variables.guestbookId,
              ),
              totalItems: oldData.result.totalItems - 1,
            },
          };
        },
      );
    },
  });
};
