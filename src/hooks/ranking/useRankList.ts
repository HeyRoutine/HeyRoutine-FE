import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getRankList, GetRankListParams } from '../../api/ranking';

// 단일 페이지 랭킹 조회 훅
export const useRankList = (params: GetRankListParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['rankList', params],
    queryFn: () => getRankList(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 무한 스크롤 랭킹 조회 훅
export const useInfiniteRankList = (
  params: Omit<GetRankListParams, 'page' | 'size'>,
) => {
  return useInfiniteQuery({
    queryKey: ['infiniteRankList', params],
    queryFn: ({ pageParam = 0 }) => getRankList({ ...params, page: pageParam, size: 20 }),
    getNextPageParam: (lastPage) => {
      const p = lastPage?.result?.page;
      const t = lastPage?.result?.totalPages;
      if (p !== undefined && t !== undefined && p < t - 1) return p + 1;
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};


