import apiClient from '../client';
import { RecommendDailyResponse } from '../../types/api';

/**
 * 추천 루틴 API
 * @returns Promise<RecommendDailyResponse>
 */
export const getRecommendDaily = async (): Promise<RecommendDailyResponse> => {
  const response = await apiClient.get<RecommendDailyResponse>(
    '/api/v1/analysis/daily',
  );
  return response.data;
};
