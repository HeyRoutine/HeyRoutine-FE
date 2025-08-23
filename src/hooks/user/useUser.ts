import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  checkEmailDuplicate,
  checkNicknameDuplicate,
} from '../../api/user/user';

// ===== 유저 React Query Hooks =====

// 이메일 중복확인 훅
export const useCheckEmailDuplicate = (
  email: string,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: ['checkEmailDuplicate', email],
    queryFn: () => checkEmailDuplicate(email),
    enabled: enabled && email.length > 0, // 이메일이 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 닉네임 중복확인 훅
export const useCheckNicknameDuplicate = (
  nickname: string,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: ['checkNicknameDuplicate', nickname],
    queryFn: () => checkNicknameDuplicate(nickname),
    enabled: enabled && nickname.length > 0, // 닉네임이 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// TODO: 다른 유저 API hooks 구현 예정
