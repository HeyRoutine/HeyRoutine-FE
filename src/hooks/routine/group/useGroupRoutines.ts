import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGroupRoutines,
  joinGroupRoutine,
  leaveGroupRoutine,
} from '../../../api/routine/group/routines';
import { GroupRoutineListParams } from '../../../types/api';

// 단체루틴 리스트 조회 훅
export const useGroupRoutines = (params: GroupRoutineListParams = {}) => {
  return useQuery({
    queryKey: ['groupRoutines', params],
    queryFn: () => getGroupRoutines(params),
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 단체루틴 참여 훅
export const useJoinGroupRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinGroupRoutine,
    onSuccess: () => {
      // 참여 성공 시 단체루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutines'] });
    },
  });
};

// 단체루틴 탈퇴 훅
export const useLeaveGroupRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveGroupRoutine,
    onSuccess: () => {
      // 탈퇴 성공 시 단체루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['groupRoutines'] });
    },
  });
};
