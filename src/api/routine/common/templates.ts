import apiClient from '../../client';
import {
  ApiResponse,
  RoutineTemplateListResponse,
  RoutineTemplateListParams,
} from '../../../types/api';

// 루틴 템플릿 조회 API
export const getRoutineTemplate = async (
  params: RoutineTemplateListParams = {},
): Promise<ApiResponse<RoutineTemplateListResponse>> => {
  const { category, page = 0, size = 10 } = params;

  const response = await apiClient.get<
    ApiResponse<RoutineTemplateListResponse>
  >('/api/v1/routines/templates', {
    params: {
      ...(category && { category }),
      page,
      size,
    },
  });

  return response.data;
};

