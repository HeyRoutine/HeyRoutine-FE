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
    staleTime: 60 * 60 * 1000, // 1시간간 fresh 상태 유지 (템플릿은 자주 변경되지 않음)
    gcTime: 2 * 60 * 60 * 1000, // 2시간간 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 비활성화 (캐시된 데이터 우선 사용)
  });
};

// ===== 루틴 이모지 =====

// 루틴 이모지 조회 훅
export const useRoutineEmojis = (params: EmojiListParams = {}) => {
  return useQuery({
    queryKey: ['routineEmojis', params],
    queryFn: () => getRoutineEmoji(params),
    staleTime: 60 * 60 * 1000, // 1시간간 fresh 상태 유지 (이모지는 자주 변경되지 않음)
    gcTime: 2 * 60 * 60 * 1000, // 2시간간 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 비활성화 (캐시된 데이터 우선 사용)
  });
};
