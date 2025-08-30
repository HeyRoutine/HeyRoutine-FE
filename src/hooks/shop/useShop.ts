import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  buyProduct,
  myPoint,
  postProduct,
  shopList,
  shopCategoryList,
  getProductDetail,
} from '../../api/shop/shop';
import {
  PostProductRequest,
  ShopListParams,
  ShopCategoryListParams,
} from '../../types/api';

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

// 물건 전체보기 훅
export const useShopList = (params: ShopListParams = {}) => {
  return useQuery({
    queryKey: ['shopList', params],
    queryFn: () => shopList(params),
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 물건 카테고리별 전체보기 훅
export const useShopCategoryList = (params: ShopCategoryListParams) => {
  return useQuery({
    queryKey: ['shopCategoryList', params],
    queryFn: () => shopCategoryList(params),
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 물건 상세보기 훅
export const useProductDetail = (productId: string) => {
  return useQuery({
    queryKey: ['productDetail', productId],
    queryFn: () => getProductDetail(productId),
    staleTime: 10 * 60 * 1000, // 10분간 fresh 상태 유지
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
    enabled: !!productId, // productId가 있을 때만 실행
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
      queryClient.invalidateQueries({ queryKey: ['productDetail'] });
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
