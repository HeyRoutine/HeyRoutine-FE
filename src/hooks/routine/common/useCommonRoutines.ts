import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getRoutineTemplate } from '../../../api/routine/common/templates';
import { getRoutineEmoji } from '../../../api/routine/common/emojis';
import { RoutineTemplateListParams, EmojiListParams } from '../../../types/api';

// ===== 루틴 템플릿 =====

// 루틴 템플릿 조회 훅
export const useRoutineTemplates = (params: RoutineTemplateListParams = {}) => {
  return useQuery({
    queryKey: ['routineTemplates', params],
    queryFn: () => getRoutineTemplate(params),
    staleTime: 30 * 60 * 1000, // 30분간 fresh 상태 유지 (템플릿은 자주 변경되지 않음)
    gcTime: 60 * 60 * 1000, // 1시간간 캐시 유지
  });
};

// ===== 루틴 이모지 =====

// 루틴 이모지 조회 훅
export const useRoutineEmojis = (params: EmojiListParams = {}) => {
  return useQuery({
    queryKey: ['routineEmojis', params],
    queryFn: () => getRoutineEmoji(params),
    staleTime: 30 * 60 * 1000, // 30분간 fresh 상태 유지 (이모지는 자주 변경되지 않음)
    gcTime: 60 * 60 * 1000, // 1시간간 캐시 유지
  });
};
