import apiClient from '../client';
import { SurveyRequest, SurveyResponse, ApiResponse } from '../../types/api';

export const postSurvey = async (
  data: SurveyRequest,
): Promise<SurveyResponse> => {
  const response = await apiClient.post<SurveyResponse>(
    '/api/v1/user/survey',
    data,
  );
  return response.data;
};

export const getSurvey = async (): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>('/api/v1/user/survey');
  return response.data;
};
