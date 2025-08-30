import { useMutation } from '@tanstack/react-query';
import { accountTransfer } from '../../api/shop';

/**
 * 포인트 전환 API 훅
 *
 * @returns 포인트 전환 뮤테이션 객체
 *
 * @example
 * ```typescript
 * const { mutate: transferPoints, isLoading, error } = useAccountTransfer();
 *
 * // 포인트 전환 요청
 * transferPoints({
 *   account: "0012739848857928",
 *   price: "10000" // 포인트를 문자열로 전달 (0.7을 곱하지 않음)
 * }, {
 *   onSuccess: (data) => {
 *     console.log('포인트 전환 성공:', data);
 *   },
 *   onError: (error) => {
 *     console.error('포인트 전환 실패:', error);
 *   }
 * });
 * ```
 */
export const useAccountTransfer = () => {
  return useMutation({
    mutationFn: accountTransfer,
    onError: (error: any) => {
      // 에러 코드별 처리
      if (error?.response?.status === 400) {
        console.error('🔍 클라이언트 오류가 발생했습니다.');
      } else if (error?.response?.status === 401) {
        console.error('🔍 인증에 실패했습니다.');
      } else if (error?.response?.status === 500) {
        console.error('🔍 서버 오류가 발생했습니다.');
      } else {
        console.error('🔍 포인트 전환 중 오류가 발생했습니다:', error);
      }
    },
  });
};
