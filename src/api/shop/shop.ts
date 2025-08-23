import apiClient from '../client';
import { ApiResponse } from '../../types/api';
import {
  BuyProductRequest,
  BuyProductResponse,
  MyPointResponse,
  PostProductRequest,
  PostProductResponse,
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
