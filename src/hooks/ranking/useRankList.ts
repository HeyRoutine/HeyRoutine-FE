import { useQuery } from '@tanstack/react-query';
import { getRanking } from '../../api/ranking';
import { RankingType } from '../../types/api';

/**
 * 랭킹 조회 훅
 *
 * 사용 예시:
 * const { data: universityRanking, isLoading, error } = useGetRanking('university');
 * const { data: majorRanking, isLoading, error } = useGetRanking('major');
 *
 * 응답 데이터:
 * - data.result.myItem: 사용자의 랭킹 정보 (rank, universityName, majorName, score)
 * - data.result.items: 전체 랭킹 목록 (rank, name, score)
 * - data.result.page, pageSize, totalItems, totalPages: 페이지네이션 정보
 */
export const useGetRanking = (type: RankingType, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['ranking', type],
    queryFn: () => getRanking(type),
    enabled,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};
