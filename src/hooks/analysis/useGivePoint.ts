import { useMutation } from '@tanstack/react-query';
import { givePoint } from '../../api/analysis';

/**
 * 연속 1주일 달성 포인트 지급 API 훅
 *
 * @returns 포인트 지급 뮤테이션 객체
 *
 * @example
 * ```typescript
 * const { mutate: givePoint, isLoading, error } = useGivePoint();
 *
 * // 포인트 지급 요청
 * givePoint(undefined, {
 *   onSuccess: (data) => {
 *     console.log('포인트 지급 성공:', data);
 *   },
 *   onError: (error) => {
 *     console.error('포인트 지급 실패:', error);
 *   }
 * });
 * ```
 */
export const useGivePoint = () => {
  return useMutation({
    mutationFn: givePoint,
    onError: (error: any) => {
      // 에러 코드별 처리
      if (error?.response?.status === 400) {
        console.error('🔍 7일 연속 달성 여부를 확인하세요.');
      } else if (error?.response?.status === 409) {
        console.error('🔍 이미 해당 보상을 받으셨습니다.');
      } else if (error?.response?.status === 401) {
        console.error('🔍 인증에 실패했습니다.');
      } else if (error?.response?.status === 500) {
        console.error('🔍 서버 오류가 발생했습니다.');
      } else {
        console.error('🔍 포인트 지급 중 오류가 발생했습니다:', error);
      }
    },
  });
};
