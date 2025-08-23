import apiClient from '../../client';
import {
  ApiResponse,
  CreatePersonalRoutineDetailRequest,
  CreatePersonalRoutineDetailResponse,
} from '../../../types/api';

// 개인루틴 리스트 안 루틴 만들기 API
export const makeRoutineToMyRoutineList = async (
  myRoutineListId: string,
  data: CreatePersonalRoutineDetailRequest,
): Promise<ApiResponse<CreatePersonalRoutineDetailResponse>> => {
  const response = await apiClient.post<
    ApiResponse<CreatePersonalRoutineDetailResponse>
  >(`/api/v1/my-routine/routine/${myRoutineListId}`, data);
  return response.data;
};
