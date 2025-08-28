import apiClient from '../client';
import { SurveyRequest, SurveyResponse } from '../../types/api';

export const postSurvey = async (
  data: SurveyRequest,
): Promise<SurveyResponse> => {
  const response = await apiClient.post<SurveyResponse>(
    '/api/v1/user/survey',
    data,
  );
  return response.data;
};
