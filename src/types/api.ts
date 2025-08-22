// API 응답 기본 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 단체루틴 타입
export type RoutineType = 'DAILY' | 'FINANCE';

// 루틴 상세 아이템 타입 (생성용)
export interface RoutineDetailItem {
  templateId: number | null; // 연결된 템플릿 ID (연결 안 했으면 null)
  emojiId: number; // 선택한 이모지 ID
  name: string; // 루틴 명
  time: number; // 루틴 걸리는 시간 (1~999)
}

// 루틴 상세 수정 아이템 타입 (수정용)
export interface RoutineDetailUpdateItem {
  routineId: number; // 수정할 개별 루틴의 ID
  templateId: number | null; // 연결된 템플릿 ID (연결 안 했으면 null)
  emojiId: number; // 선택한 이모지 ID
  name: string; // 루틴 명
  time: number; // 루틴 걸리는 시간 (1~999)
}

// 단체루틴 상세 생성 요청 타입
export interface CreateGroupRoutineDetailRequest {
  routines: RoutineDetailItem[];
}

// 단체루틴 상세 수정 요청 타입
export interface UpdateGroupRoutineDetailRequest {
  routines: RoutineDetailUpdateItem[];
}

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

// 단체루틴 상세 생성 응답 타입
export interface CreateGroupRoutineDetailResponse {
  // 성공 시 별도 데이터 없음 (메시지만 반환)
}

// 단체루틴 상세 수정 응답 타입
export interface UpdateGroupRoutineDetailResponse {
  // 성공 시 별도 데이터 없음 (메시지만 반환)
}

// 단체루틴 상세 삭제 응답 타입
export interface DeleteGroupRoutineDetailResponse {
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
