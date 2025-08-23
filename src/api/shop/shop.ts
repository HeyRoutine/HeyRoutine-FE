import apiClient from '../client';
import { ApiResponse } from '../../types/api';
import {
  BuyProductRequest,
  BuyProductResponse,
  MyPointResponse,
  PostProductRequest,
  PostProductResponse,
  ShopListParams,
  ShopListResponse,
  ShopCategoryListParams,
  ShopCategoryListResponse,
  GetProductDetailResponse,
} from '../../types/api';

// ===== 포인트샵 API 함수들 =====

// 물건 결제하기
export const buyProduct = async (
  productId: string,
): Promise<ApiResponse<BuyProductResponse>> => {
  const response = await apiClient.post<ApiResponse<BuyProductResponse>>(
    `/api/v1/shop/buy/${productId}`,
  );
  return response.data;
};

// 내 포인트 조회
export const myPoint = async (): Promise<ApiResponse<MyPointResponse>> => {
  const response = await apiClient.get<ApiResponse<MyPointResponse>>(
    '/api/v1/shop/my-point',
  );
  return response.data;
};

// 물건 등록하기
export const postProduct = async (
  data: PostProductRequest,
): Promise<ApiResponse<PostProductResponse>> => {
  const response = await apiClient.post<ApiResponse<PostProductResponse>>(
    '/api/v1/shop',
    data,
  );
  return response.data;
};

// 물건 전체보기
export const shopList = async (
  params: ShopListParams = {},
): Promise<ApiResponse<ShopListResponse>> => {
  const { page = 0, size = 10 } = params;
  const response = await apiClient.get<ApiResponse<ShopListResponse>>(
    '/api/v1/shop/list',
    {
      params: {
        page,
        size,
      },
    },
  );
  return response.data;
};

// 물건 카테고리별 전체보기
export const shopCategoryList = async (
  params: ShopCategoryListParams,
): Promise<ApiResponse<ShopCategoryListResponse>> => {
  const { category, page = 0, size = 10 } = params;
  const response = await apiClient.get<ApiResponse<ShopCategoryListResponse>>(
    `/api/v1/shop/list/${category}`,
    {
      params: {
        page,
        size,
      },
    },
  );
  return response.data;
};

// 물건 상세보기
export const getProductDetail = async (
  productId: string,
): Promise<ApiResponse<GetProductDetailResponse>> => {
  const response = await apiClient.get<ApiResponse<GetProductDetailResponse>>(
    `/api/v1/shop/${productId}`,
  );
  return response.data;
};
