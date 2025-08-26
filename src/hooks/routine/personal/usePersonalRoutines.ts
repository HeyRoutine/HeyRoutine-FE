import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  makeMyRoutineList,
  updateRoutineToMyRoutineList,
  deleteRoutineToMyRoutineList,
  showMyRoutineList,
  doneRoutineToMyRoutineList,
  doneMyRoutineList,
} from '../../../api/routine/personal/routines';
import {
  makeRoutineToMyRoutineList,
  makeRoutinesToMyRoutineList,
  getRoutinesInListByDate,
  updateRoutineInMyRoutineList,
  updateRoutineInMyRoutineListV2,
  deleteRoutineInMyRoutineList,
} from '../../../api/routine/personal/routineDetails';
import {
  PersonalRoutineListParams,
  CreatePersonalRoutineListRequest,
  UpdatePersonalRoutineListRequest,
  CreatePersonalRoutineDetailRequest,
  CreatePersonalRoutineDetailArrayRequest,
  UpdatePersonalRoutineDetailRequest,
  UpdateRoutineInMyRoutineListRequest,
  DonePersonalRoutineParams,
} from '../../../types/api';

// ===== 개인루틴 리스트 CRUD =====

// 개인루틴 리스트 조회 훅
export const usePersonalRoutines = (params: PersonalRoutineListParams = {}) => {
  console.log('🔍 개인루틴 리스트 조회 훅 호출:', params);

  return useQuery({
    queryKey: ['personalRoutines', params],
    queryFn: async () => {
      console.log('🔍 showMyRoutineList API 호출 시작');
      const result = await showMyRoutineList(params);
      console.log('🔍 showMyRoutineList API 응답:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 무한 스크롤용 개인루틴 리스트 조회 훅
export const useInfinitePersonalRoutines = (
  params: Omit<PersonalRoutineListParams, 'page' | 'size'> = {},
) => {
  console.log('🔍 무한 스크롤 개인루틴 리스트 조회 훅 호출:', params);

  return useInfiniteQuery({
    queryKey: ['infinitePersonalRoutines', params],
    queryFn: ({ pageParam = 0 }) =>
      showMyRoutineList({ ...params, page: pageParam, size: 10 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.result.page < lastPage.result.totalPages - 1) {
        return lastPage.result.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 개인루틴 리스트 생성 훅
export const useCreatePersonalRoutineList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePersonalRoutineListRequest) => {
      console.log('🔍 개인루틴 생성 훅 호출:', data);
      return makeMyRoutineList(data);
    },
    onSuccess: (data) => {
      console.log('🔍 개인루틴 생성 성공:', data);
      // 생성 성공 시 개인루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
    },
    onError: (error) => {
      console.error('🔍 개인루틴 생성 실패:', error);
    },
  });
};

// 개인루틴 리스트 수정 훅
export const useUpdatePersonalRoutineList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      myRoutineListId,
      data,
    }: {
      myRoutineListId: string;
      data: UpdatePersonalRoutineListRequest;
    }) => updateRoutineToMyRoutineList(myRoutineListId, data),
    onSuccess: () => {
      console.log('🔍 개인루틴 수정 성공 - 캐시 무효화 시작');
      // 수정 성공 시 개인루틴 리스트 캐시 무효화 (모든 관련 쿼리)
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infinitePersonalRoutines'] });
      console.log('🔍 개인루틴 수정 성공 - 캐시 무효화 완료');
    },
  });
};

// 개인루틴 리스트 삭제 훅
export const useDeletePersonalRoutineList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (myRoutineListId: string) =>
      deleteRoutineToMyRoutineList(myRoutineListId),
    onSuccess: () => {
      // 삭제 성공 시 개인루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
    },
  });
};

// ===== 개인루틴 상세 CRUD =====

// 개인루틴 상세 생성 훅
export const useCreatePersonalRoutineDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      myRoutineListId,
      data,
    }: {
      myRoutineListId: string;
      data: CreatePersonalRoutineDetailRequest;
    }) => {
      console.log('🔍 개인루틴 상세 생성 훅 호출:', { myRoutineListId, data });
      return makeRoutineToMyRoutineList(myRoutineListId, data);
    },
    onSuccess: (data) => {
      console.log('🔍 개인루틴 상세 생성 성공:', data);
      // 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
    },
    onError: (error) => {
      console.error('🔍 개인루틴 상세 생성 실패:', error);
    },
  });
};

// 개인루틴 상세 생성 훅 (배열)
export const useCreatePersonalRoutineDetailArray = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      myRoutineListId,
      data,
    }: {
      myRoutineListId: string;
      data: CreatePersonalRoutineDetailArrayRequest;
    }) => {
      console.log('🔍 개인루틴 상세 생성 훅 호출 (배열):', {
        myRoutineListId,
        data,
      });
      return makeRoutinesToMyRoutineList(myRoutineListId, data);
    },
    onSuccess: (data) => {
      console.log('🔍 개인루틴 상세 생성 성공 (배열):', data);
      // 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infinitePersonalRoutines'] });
    },
    onError: (error) => {
      console.error('🔍 개인루틴 상세 생성 실패 (배열):', error);
    },
  });
};

// 개인루틴 상세 조회 훅
export const usePersonalRoutineDetails = (
  myRoutineListId: string,
  params: { date: string },
) => {
  console.log('🔍 개인루틴 상세 조회 훅 호출:', { myRoutineListId, params });

  return useQuery({
    queryKey: ['personalRoutineDetails', myRoutineListId, params],
    queryFn: () => getRoutinesInListByDate(myRoutineListId, params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 개인루틴 상세 수정 훅 (새로운 스펙 - 전체 루틴 목록을 한 번에 수정)
export const useUpdatePersonalRoutineDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      myRoutineListId,
      data,
    }: {
      myRoutineListId: string;
      data: UpdateRoutineInMyRoutineListRequest;
    }) => updateRoutineInMyRoutineListV2(myRoutineListId, data),
    onSuccess: () => {
      console.log('🔍 개인루틴 상세 수정 성공');
      // 수정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
    },
    onError: (error) => {
      console.error('🔍 개인루틴 상세 수정 실패:', error);
    },
  });
};

// 개인루틴 상세 삭제 훅
export const useDeletePersonalRoutineDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routineId: string) => deleteRoutineInMyRoutineList(routineId),
    onSuccess: () => {
      // 삭제 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
    },
  });
};

// ===== 개인루틴 수행/완료 =====

// 개인루틴 수행 훅
export const useDonePersonalRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      routineId,
      params,
    }: {
      routineId: string;
      params: DonePersonalRoutineParams;
    }) => doneRoutineToMyRoutineList(routineId, params),
    onSuccess: () => {
      // 수행 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
    },
  });
};

// 개인루틴 리스트 완료 훅
export const useDonePersonalRoutineList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      myRoutineListId,
      params,
    }: {
      myRoutineListId: string;
      params: DonePersonalRoutineParams;
    }) => doneMyRoutineList(myRoutineListId, params),
    onSuccess: () => {
      // 완료 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
    },
  });
};
