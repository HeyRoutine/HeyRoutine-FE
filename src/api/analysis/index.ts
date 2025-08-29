// 분석 관련 API

// export * from './consumption';
// export * from './achievement';
// export * from './streak';
// export * from './summary';

import apiClient from '../client';
import {
  ApiResponse,
  GetWeeklySummaryParams,
  GetWeeklySummaryResponse,
  GetMaxStreakResponse,
} from '../../types/api';

/**
 * 주간 요약 조회
 * GET /api/v1/analysis/weekly-summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&routineType=DAILY|FINANCE
 */
export const getWeeklySummary = async (
  params: GetWeeklySummaryParams,
): Promise<ApiResponse<GetWeeklySummaryResponse>> => {
  const { startDate, endDate, routineType } = params;
  const response = await apiClient.get<ApiResponse<GetWeeklySummaryResponse>>(
    '/api/v1/analysis/weekly-summary',
    {
      params: { startDate, endDate, routineType },
    },
  );
  return response.data;
};

/**
 * 최대 연속 일수 조회
 * GET /api/v1/analysis/max-streak
 */
export const getMaxStreak = async (): Promise<
  ApiResponse<GetMaxStreakResponse>
> => {
  const response = await apiClient.get<ApiResponse<GetMaxStreakResponse>>(
    '/api/v1/analysis/max-streak',
  );
  return response.data;
};

/**
 * 일일 분석 조회
 * GET /api/v1/analysis/daily
 */
export const getDailyAnalysis = async (): Promise<ApiResponse<any>> => {
  console.log('🔍 getDailyAnalysis API 호출 시작');

  try {
    const response = await apiClient.get<ApiResponse<any>>(
      '/api/v1/analysis/daily',
    );

    console.log('🔍 getDailyAnalysis API 응답 성공:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    return response.data;
  } catch (error) {
    console.error('🔍 getDailyAnalysis API 호출 실패:', error);
    throw error;
  }
};
