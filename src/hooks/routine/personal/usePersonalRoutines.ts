import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  getRoutinesInListByDate,
  updateRoutineInMyRoutineList,
  deleteRoutineInMyRoutineList,
} from '../../../api/routine/personal/routineDetails';
import {
  PersonalRoutineListParams,
  CreatePersonalRoutineListRequest,
  UpdatePersonalRoutineListRequest,
  CreatePersonalRoutineDetailRequest,
  UpdatePersonalRoutineDetailRequest,
  DonePersonalRoutineParams,
} from '../../../types/api';

// ===== 개인루틴 리스트 CRUD =====

// 개인루틴 리스트 조회 훅
export const usePersonalRoutines = (params: PersonalRoutineListParams = {}) => {
  return useQuery({
    queryKey: ['personalRoutines', params],
    queryFn: () => showMyRoutineList(params),
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 개인루틴 리스트 생성 훅
export const useCreatePersonalRoutineList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePersonalRoutineListRequest) =>
      makeMyRoutineList(data),
    onSuccess: () => {
      // 생성 성공 시 개인루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
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
      // 수정 성공 시 개인루틴 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
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
    }) => makeRoutineToMyRoutineList(myRoutineListId, data),
    onSuccess: () => {
      // 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
    },
  });
};

// 개인루틴 상세 조회 훅
export const usePersonalRoutineDetails = (
  myRoutineListId: string,
  params: { date: string },
) => {
  return useQuery({
    queryKey: ['personalRoutineDetails', myRoutineListId, params],
    queryFn: () => getRoutinesInListByDate(myRoutineListId, params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 개인루틴 상세 수정 훅
export const useUpdatePersonalRoutineDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      myRoutineListId,
      data,
    }: {
      myRoutineListId: string;
      data: UpdatePersonalRoutineDetailRequest;
    }) => updateRoutineInMyRoutineList(myRoutineListId, data),
    onSuccess: () => {
      // 수정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
    },
  });
};

// 개인루틴 상세 삭제 훅
export const useDeletePersonalRoutineDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (myRoutineListId: string) =>
      deleteRoutineInMyRoutineList(myRoutineListId),
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
    mutationFn: (myRoutineListId: string) => doneMyRoutineList(myRoutineListId),
    onSuccess: () => {
      // 완료 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
    },
  });
};

