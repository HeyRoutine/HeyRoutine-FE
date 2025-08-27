import { Alert } from 'react-native';

// 기본 에러 메시지 (서버 메시지가 없을 때만 사용)
const DEFAULT_MESSAGES = {
  NETWORK_ERROR: '인터넷 연결을 확인해주세요.',
  TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  SERVER_ERROR:
    '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  UNKNOWN: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
};

class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // 에러 메시지 추출 (서버 메시지 우선)
  private getErrorMessage(error: any): string {
    // 서버에서 오는 메시지를 우선 사용
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    // HTTP 상태 코드별 기본 메시지
    if (error?.response?.status) {
      const status = error.response.status;
      if (status >= 500) {
        return DEFAULT_MESSAGES.SERVER_ERROR;
      }
    }

    // 네트워크 에러
    if (error?.code === 'NETWORK_ERROR') {
      return DEFAULT_MESSAGES.NETWORK_ERROR;
    }

    if (error?.code === 'TIMEOUT') {
      return DEFAULT_MESSAGES.TIMEOUT;
    }

    return DEFAULT_MESSAGES.UNKNOWN;
  }

  // API 에러 처리
  public handleApiError(error: any): string {
    const message = this.getErrorMessage(error);

    // 에러 로깅
    console.error('🔍 [API Error]', {
      status: error?.response?.status,
      message: error?.response?.data?.message,
      code: error?.response?.data?.code,
      url: error?.config?.url,
    });

    return message;
  }

  // 범용 에러 처리
  public handleError(error: any): string {
    const message = this.getErrorMessage(error);

    // 에러 로깅
    console.error('🔍 [Error]', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });

    return message;
  }

  // 사용자에게 에러 표시
  public showError(message: string, title: string = '오류'): void {
    Alert.alert(title, message);
  }

  // 에러 처리 + 표시 (한번에)
  public handleAndShowError(error: any, title: string = '오류'): void {
    const message = this.handleError(error);
    this.showError(message, title);
  }
}

export default ErrorHandler.getInstance();
