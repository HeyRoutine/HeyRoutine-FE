import apiClient from '../client';
import { ApiResponse, RankingType, RankingResponse } from '../../types/api';

// 랭킹 조회 함수
export const getRanking = async (
  type: RankingType,
): Promise<ApiResponse<RankingResponse>> => {
  const response = await apiClient.get<ApiResponse<RankingResponse>>(
    `/api/v1/home/rank?type=${type}`,
  );
  return response.data;
};
