import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buyProduct, myPoint, postProduct } from '../../api/shop/shop';
import { PostProductRequest } from '../../types/api';

// ===== 포인트샵 React Query Hooks =====

// 내 포인트 조회 훅
export const useMyPoint = () => {
  return useQuery({
    queryKey: ['myPoint'],
    queryFn: () => myPoint(),
    staleTime: 1 * 60 * 1000, // 1분간 fresh 상태 유지 (포인트는 자주 변경될 수 있음)
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};

// 물건 결제하기 훅
export const useBuyProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => buyProduct(productId),
    onSuccess: () => {
      // 결제 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['myPoint'] });
      queryClient.invalidateQueries({ queryKey: ['shopList'] });
      queryClient.invalidateQueries({ queryKey: ['shopCategoryList'] });
    },
  });
};

// 물건 등록하기 훅
export const usePostProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostProductRequest) => postProduct(data),
    onSuccess: () => {
      // 등록 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['shopList'] });
      queryClient.invalidateQueries({ queryKey: ['shopCategoryList'] });
    },
  });
};
