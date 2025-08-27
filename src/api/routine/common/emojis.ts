import apiClient from '../../client';
import {
  ApiResponse,
  EmojiListResponse,
  EmojiListParams,
} from '../../../types/api';

// 이모지 전체 조회 API
export const getRoutineEmoji = async (
  params: EmojiListParams = {},
): Promise<ApiResponse<EmojiListResponse>> => {
  const { category, page = 0, size = 20 } = params;

  const response = await apiClient.get<ApiResponse<EmojiListResponse>>(
    '/api/v1/routines/emoji',
    {
      params: {
        ...(category && { category }),
        page,
        size,
      },
    },
  );

  return response.data;
};
