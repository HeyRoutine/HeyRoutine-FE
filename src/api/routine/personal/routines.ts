import apiClient from '../../client';
import {
  ApiResponse,
  CreatePersonalRoutineListRequest,
  CreatePersonalRoutineListResponse,
  UpdatePersonalRoutineListRequest,
  UpdatePersonalRoutineListResponse,
  DeletePersonalRoutineListResponse,
  PersonalRoutineListResponse,
  PersonalRoutineListParams,
  DonePersonalRoutineResponse,
  DonePersonalRoutineParams,
  DoneMyRoutineListResponse,
  CreatePersonalRoutineDetailRequest,
  CreatePersonalRoutineDetailResponse,
} from '../../../types/api';

// 개인루틴 리스트 생성 API
export const makeMyRoutineList = async (
  data: CreatePersonalRoutineListRequest,
): Promise<ApiResponse<CreatePersonalRoutineListResponse>> => {
  console.log('🔍 개인루틴 생성 API 호출:', '/api/v1/my-routine/list');
  console.log('🔍 개인루틴 생성 요청 데이터:', data);
  console.log('🔍 요청 데이터 JSON:', JSON.stringify(data, null, 2));
  console.log('🔍 요청 데이터 타입 확인:', {
    title: typeof data.title,
    startDate: typeof data.startDate,
    startTime: typeof data.startTime,
    endTime: typeof data.endTime,
    routineType: typeof data.routineType,
    dayTypes: Array.isArray(data.dayTypes) ? 'array' : typeof data.dayTypes,
    dayTypesLength: Array.isArray(data.dayTypes) ? data.dayTypes.length : 'N/A',
  });

  try {
    const response = await apiClient.post<
      ApiResponse<CreatePersonalRoutineListResponse>
    >('/api/v1/my-routine/list', data);

    console.log('🔍 개인루틴 생성 응답:', {
      status: response.status,
      data: response.data,
      isSuccess: response.data?.isSuccess,
      message: response.data?.message,
    });

    return response.data;
  } catch (error: any) {
    console.error('🔍 개인루틴 생성 API 에러 상세:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      responseText: error.response?.responseText,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data,
      },
    });
    console.error('🔍 에러 응답 전체:', error.response);
    throw error;
  }
};

// 개인루틴 리스트 수정 API
export const updateRoutineToMyRoutineList = async (
  myRoutineListId: string,
  data: UpdatePersonalRoutineListRequest,
): Promise<ApiResponse<UpdatePersonalRoutineListResponse>> => {
  console.log('🔍 개인루틴 리스트 수정 API 호출:', {
    myRoutineListId,
    url: `/api/v1/my-routine/list/${myRoutineListId}`,
    data,
  });

  const response = await apiClient.patch<
    ApiResponse<UpdatePersonalRoutineListResponse>
  >(`/api/v1/my-routine/list/${myRoutineListId}`, data);

  console.log('🔍 개인루틴 리스트 수정 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    message: response.data?.message,
  });

  return response.data;
};

// 개인루틴 리스트 삭제 API
export const deleteRoutineToMyRoutineList = async (
  myRoutineListId: string,
): Promise<ApiResponse<DeletePersonalRoutineListResponse>> => {
  console.log('🔍 개인루틴 리스트 삭제 API 호출:', {
    myRoutineListId,
    url: `/api/v1/my-routine/list/${myRoutineListId}`,
  });

  const response = await apiClient.delete<
    ApiResponse<DeletePersonalRoutineListResponse>
  >(`/api/v1/my-routine/list/${myRoutineListId}`);

  console.log('🔍 개인루틴 리스트 삭제 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    message: response.data?.message,
  });

  return response.data;
};

// 개인루틴 리스트 전체조회 API
export const showMyRoutineList = async (
  params: PersonalRoutineListParams = {},
): Promise<ApiResponse<PersonalRoutineListResponse>> => {
  const { day, date, page = 0, size = 10 } = params;

  console.log('🔍 showMyRoutineList API 호출 파라미터:', params);

  const requestParams = {
    ...(day && { day }),
    ...(date && { date }), // date를 yyyy-mm-dd 형식 그대로 사용
    page: page.toString(),
    size: size.toString(),
  };

  const queryString = new URLSearchParams(requestParams).toString();
  console.log('🔍 showMyRoutineList 요청 URL:', '/api/v1/my-routine/list');
  console.log('🔍 showMyRoutineList 요청 파라미터:', requestParams);

  try {
    const response = await apiClient.get<
      ApiResponse<PersonalRoutineListResponse>
    >('/api/v1/my-routine/list', {
      params: {
        ...(day && { day }),
        ...(date && { date }), // date를 yyyy-mm-dd 형식 그대로 사용
        page,
        size,
      },
    });

    console.log('🔍 showMyRoutineList 응답:', {
      status: response.status,
      data: response.data,
      isSuccess: response.data?.isSuccess,
      result: response.data?.result,
      items: response.data?.result?.items,
      itemsCount: response.data?.result?.items?.length || 0,
    });
    return response.data;
  } catch (error: any) {
    console.error('🔍 showMyRoutineList API 에러:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// 개인루틴 리스트 수행 API
export const doneRoutineToMyRoutineList = async (
  routineId: string,
  params: DonePersonalRoutineParams,
): Promise<ApiResponse<DonePersonalRoutineResponse>> => {
  const { date } = params;

  console.log('🔍 개인루틴 수행 API 호출:', {
    routineId,
    date,
    url: `/api/v1/my-routine/list/routine/complete/${routineId}`,
  });

  const response = await apiClient.post<
    ApiResponse<DonePersonalRoutineResponse>
  >(
    `/api/v1/my-routine/list/routine/complete/${routineId}`,
    {},
    {
      params: { date },
    },
  );

  console.log('🔍 개인루틴 수행 API 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
  });

  return response.data;
};

// 루틴리스트 기록하기 API
export const doneMyRoutineList = async (
  myRoutineListId: string,
  params: DonePersonalRoutineParams,
): Promise<ApiResponse<DoneMyRoutineListResponse>> => {
  const { date } = params;

  console.log('🔍 루틴 리스트 전체 완료 API 호출:', {
    myRoutineListId,
    date,
    url: `/api/v1/my-routine/list/complete/${myRoutineListId}`,
  });

  const response = await apiClient.post<ApiResponse<DoneMyRoutineListResponse>>(
    `/api/v1/my-routine/list/complete/${myRoutineListId}`,
    {},
    {
      params: { date },
    },
  );

  console.log('🔍 루틴 리스트 전체 완료 API 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
  });

  return response.data;
};

// 개인루틴 리스트 안 루틴 만들기 API
export const makeRoutineToMyRoutineList = async (
  myRoutineListId: string,
  data: CreatePersonalRoutineDetailRequest,
): Promise<ApiResponse<CreatePersonalRoutineDetailResponse>> => {
  console.log('🔍 상세 루틴 생성 API 호출:', {
    myRoutineListId,
    data,
    url: `/api/v1/my-routine/routine/${myRoutineListId}`,
  });

  const response = await apiClient.post<
    ApiResponse<CreatePersonalRoutineDetailResponse>
  >(`/api/v1/my-routine/routine/${myRoutineListId}`, data);

  console.log('🔍 상세 루틴 생성 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    result: response.data?.result,
  });

  return response.data;
};

// 개인루틴 상세 조회 API
export const getPersonalRoutineDetails = async (
  myRoutineListId: string,
  params: { date: string },
): Promise<ApiResponse<any>> => {
  const { date } = params;

  console.log('🔍 개인루틴 상세 조회 API 호출:', {
    myRoutineListId,
    date,
    url: `/api/v1/my-routine/list/routine/${myRoutineListId}`,
  });

  const response = await apiClient.get<ApiResponse<any>>(
    `/api/v1/my-routine/list/routine/${myRoutineListId}`,
    {
      params: { date },
    },
  );

  console.log('🔍 개인루틴 상세 조회 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    result: response.data?.result,
    itemsCount: response.data?.result?.items?.length || 0,
  });

  return response.data;
};
