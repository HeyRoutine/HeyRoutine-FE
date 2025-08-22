// API 응답 기본 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 단체루틴 타입
export type RoutineType = 'DAILY' | 'FINANCE';

// 단체루틴 생성 요청 타입
export interface CreateGroupRoutineRequest {
  title: string;
  description: string;
  routineType: RoutineType;
  startTime: string; // HH:mm 형식
  endTime: string; // HH:mm 형식
  daysOfWeek: string[]; // ['월', '화', '수'] 형식
}

// 단체루틴 수정 요청 타입
export interface UpdateGroupRoutineRequest {
  title: string;
  description: string;
  routineType: RoutineType;
  startTime: string; // HH:mm 형식
  endTime: string; // HH:mm 형식
  daysOfWeek: string[]; // ['월', '화', '수'] 형식
}

// 단체루틴 생성 응답 타입
export interface CreateGroupRoutineResponse {
  // 성공 시 별도 데이터 없음 (메시지만 반환)
}

// 단체루틴 수정 응답 타입
export interface UpdateGroupRoutineResponse {
  // 성공 시 별도 데이터 없음 (메시지만 반환)
}

// 단체루틴 삭제 응답 타입
export interface DeleteGroupRoutineResponse {
  // 성공 시 별도 데이터 없음 (메시지만 반환)
}

// 단체루틴 가입 응답 타입
export interface JoinGroupRoutineResponse {
  // 성공 시 별도 데이터 없음 (메시지만 반환)
}

// 단체루틴 아이템 타입
export interface GroupRoutineItem {
  id: number;
  routineType: RoutineType;
  title: string;
  description: string;
  startTime: string; // HH:mm 형식
  endTime: string; // HH:mm 형식
  routineNums: number;
  peopleNums: number;
  dayOfWeek: string[]; // ['월', '화', '수'] 형식
  isJoined: boolean;
}

// 단체루틴 리스트 조회 응답 타입
export interface GroupRoutineListResponse {
  items: GroupRoutineItem[];
}

// 단체루틴 리스트 조회 파라미터 타입
export interface GroupRoutineListParams {
  page?: number;
  size?: number;
}

// API 에러 타입
export interface ApiError {
  isSuccess: false;
  code: string;
  message: string;
}
