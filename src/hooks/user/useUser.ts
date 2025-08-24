import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  checkEmailDuplicate,
  checkNicknameDuplicate,
  signIn,
  signUp,
  reissue,
  mypageResetPassword,
  resetPassword,
  resetNickname,
  mailSend,
  mailSendForPassword,
  authCheck,
} from '../../api/user/user';
import {
  SignInRequest,
  SignUpRequest,
  ReissueRequest,
  MyPageResetPasswordRequest,
  ResetPasswordRequest,
  ResetNicknameRequest,
  MailSendRequest,
  MailSendForPasswordRequest,
  AuthCheckRequest,
} from '../../types/api';

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

// 로그인 훅
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInRequest) => signIn(data),
    onSuccess: (data) => {
      // 로그인 성공 시 토큰 저장 및 캐시 무효화
      const { accessToken, refreshToken } = data.result;

      // TODO: 토큰을 스토어에 저장하는 로직 추가
      // useAuthStore.getState().setAccessToken(accessToken);
      // useAuthStore.getState().setRefreshToken(refreshToken);

      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// 회원가입 훅
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignUpRequest) => signUp(data),
    onSuccess: (data) => {
      // 회원가입 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 회원가입 성공 후 처리 로직 추가
      // 예: 자동 로그인, 환영 화면으로 이동 등
    },
  });
};

// 토큰 재발급 훅
export const useReissue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReissueRequest) => reissue(data),
    onSuccess: (data) => {
      // 토큰 재발급 성공 시 새로운 토큰 저장 및 캐시 무효화
      const { accessToken, refreshToken } = data.result;

      // TODO: 새로운 토큰을 스토어에 저장하는 로직 추가
      // useAuthStore.getState().setAccessToken(accessToken);
      // useAuthStore.getState().setRefreshToken(refreshToken);

      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// 마이페이지 비밀번호 재설정 훅
export const useMyPageResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MyPageResetPasswordRequest) => mypageResetPassword(data),
    onSuccess: (data) => {
      // 비밀번호 재설정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 비밀번호 재설정 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 마이페이지로 이동 등
    },
  });
};

// 비밀번호 찾기 후 재설정 훅
export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: (data) => {
      // 비밀번호 재설정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 비밀번호 재설정 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 로그인 화면으로 이동 등
    },
  });
};

// 닉네임 재설정 훅
export const useResetNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResetNicknameRequest) => resetNickname(data),
    onSuccess: (data) => {
      // 닉네임 재설정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 닉네임 재설정 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 마이페이지로 이동 등
    },
  });
};

// 회원가입 인증메일 보내기 훅
export const useMailSend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MailSendRequest) => mailSend(data),
    onSuccess: (data) => {
      // 인증메일 전송 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 인증메일 전송 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 인증코드 입력 화면으로 이동 등
    },
  });
};

// 비밀번호 찾기 인증메일 보내기 훅
export const useMailSendForPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MailSendForPasswordRequest) => mailSendForPassword(data),
    onSuccess: (data) => {
      // 인증메일 전송 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 인증메일 전송 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 인증코드 입력 화면으로 이동 등
    },
  });
};

// 인증번호 확인 훅
export const useAuthCheck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AuthCheckRequest) => authCheck(data),
    onSuccess: (data) => {
      // 인증번호 확인 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 인증번호 확인 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 다음 단계로 이동 등
    },
  });
};

// TODO: 다른 유저 API hooks 구현 예정
