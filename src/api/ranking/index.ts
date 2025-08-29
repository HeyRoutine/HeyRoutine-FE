import apiClient from '../client';
import { ApiResponse } from '../../types/api';

// 지역 랭킹 타입 (공유 타입 의존성 없이 동작)
export interface RankListItem {
  rank: number;
  name: string;
  score: number;
}

export interface RankMyItem {
  rank: number;
  uninversityName: string;
  majorName: string;
  score: number;
}

export interface RankListResult {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  myItem: RankMyItem;
  items: RankListItem[];
}

export interface GetRankListParams {
  type: 'university' | 'major';
  page?: number;
  size?: number;
}

export type UniversityRankListResponse = ApiResponse<RankListResult>;
export type MajorRankListResponse = ApiResponse<RankListResult>;

// 랭킹 조회 공통 함수 (type에 따라 엔드포인트 분기)
export const getRankList = async (
  params: GetRankListParams,
): Promise<ApiResponse<RankListResult>> => {
  const { type, page = 0, size = 20 } = params;
  const url =
    type === 'university'
      ? '/api/v1/ranking/university'
      : '/api/v1/ranking/major';

  const response = await apiClient.get<ApiResponse<RankListResult>>(url, {
    params: { page, size },
  });

  return response.data;
};

// 명시적 헬퍼 (선택 사용)
export const getUniversityRankList = async (
  page: number = 0,
  size: number = 20,
): Promise<UniversityRankListResponse> => {
  const res = await apiClient.get<UniversityRankListResponse>(
    '/api/v1/ranking/university',
    { params: { page, size } },
  );
  return res.data;
};

export const getMajorRankList = async (
  page: number = 0,
  size: number = 20,
): Promise<MajorRankListResponse> => {
  const res = await apiClient.get<MajorRankListResponse>(
    '/api/v1/ranking/major',
    { params: { page, size } },
  );
  return res.data;
};


