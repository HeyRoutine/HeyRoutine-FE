// API 응답 기본 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 단체루틴 타입
export type RoutineType = 'DAILY' | 'FINANCE';

// 단체루틴 상세 정보 타입
export interface GroupRoutineInfo {
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

// 루틴 정보 타입 (미참여자용)
export interface RoutineInfo {
  id: number;
  emojiId: number;
  name: string;
  time: number;
}

// 루틴 정보 타입 (참여자용 - isCompleted 포함)
export interface RoutineInfoWithCompletion extends RoutineInfo {
  isCompleted: boolean;
}

// 미참여자용 멤버 정보 타입
export interface NonParticipantMemberInfo {
  profileImageUrl: string[]; // 참여자 프로필 이미지 URL 배열 (최대 8개)
}

// 참여자/방장용 멤버 정보 타입
export interface ParticipantMemberInfo {
  successPeopleNums: number; // 성공한 사람 수
  successPeopleProfileImageUrl: string[]; // 성공한 사람들의 프로필 이미지 URL 배열 (최대 8개)
  failedPeopleNums: number; // 실패한 사람 수
  failedPeopleProfileImageUrl: string[]; // 실패한 사람들의 프로필 이미지 URL 배열 (최대 8개)
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
export type CreateGroupRoutineResponse = EmptyResponse;

// 단체루틴 상세 생성 응답 타입
export type CreateGroupRoutineDetailResponse = EmptyResponse;

// 단체루틴 상세 수정 응답 타입
export type UpdateGroupRoutineDetailResponse = EmptyResponse;

// 단체루틴 상세 삭제 응답 타입
export type DeleteGroupRoutineDetailResponse = EmptyResponse;

// 단체루틴 수정 응답 타입
export type UpdateGroupRoutineResponse = EmptyResponse;

// 단체루틴 삭제 응답 타입
export type DeleteGroupRoutineResponse = EmptyResponse;

// 단체루틴 가입 응답 타입
export type JoinGroupRoutineResponse = EmptyResponse;

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

// 공통 응답 타입 (성공 시 별도 데이터 없음)
export interface EmptyResponse {
  // 성공 시 별도 데이터 없음 (메시지만 반환)
}

// ===== 포인트샵 (Point Shop) 타입 =====

// 포인트 정보 타입
export interface PointInfo {
  point: number;
}

// 물건 결제하기 요청 타입 (요청 데이터 없음 - Path Variable만 사용)
export type BuyProductRequest = EmptyResponse;

// 물건 결제하기 응답 타입
export type BuyProductResponse = EmptyResponse;

// 내 포인트 조회 응답 타입
export type MyPointResponse = PointInfo;

// 물건 등록하기 요청 타입
export interface PostProductRequest {
  brand: string;
  productName: string;
  price: number;
  stock: number;
  pointShopCategory: '카페' | '편의점' | '패스트푸드' | '외식' | '베이커리';
  imageUrl: string;
}

// 물건 등록하기 응답 타입
export type PostProductResponse = EmptyResponse;

// 상품 정보 타입
export interface ProductInfo {
  id: number;
  productName: string;
  brand: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
}

// 상품 목록 응답 타입
export interface ProductListResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: ProductInfo[];
}

// 물건 전체보기 요청 파라미터 타입
export interface ShopListParams {
  page?: number;
  size?: number;
}

// 물건 전체보기 응답 타입
export type ShopListResponse = ProductListResponse;

// 물건 카테고리별 전체보기 요청 파라미터 타입
export interface ShopCategoryListParams {
  category: '카페' | '편의점' | '패스트푸드' | '외식' | '베이커리';
  page?: number;
  size?: number;
}

// 물건 카테고리별 전체보기 응답 타입
export type ShopCategoryListResponse = ProductListResponse;

// 상품 상세 정보 타입
export interface ProductDetailInfo {
  brand: string;
  productName: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

// 물건 상세보기 응답 타입
export type GetProductDetailResponse = ProductDetailInfo;

// 미참여자용 단체루틴 상세 조회 응답 타입
export interface NonParticipantGroupRoutineDetailResponse {
  isAdmin: boolean;
  groupRoutineInfo: GroupRoutineInfo;
  RoutineInfos: RoutineInfo[]; // isCompleted 없음
  groupRoutineMemberInfo: NonParticipantMemberInfo;
}

// 참여자/방장용 단체루틴 상세 조회 응답 타입
export interface ParticipantGroupRoutineDetailResponse {
  isAdmin: boolean;
  groupRoutineInfo: GroupRoutineInfo;
  RoutineInfos: RoutineInfoWithCompletion[]; // isCompleted 포함
  groupRoutineMemberInfo: ParticipantMemberInfo;
}

// 단체루틴 상세 조회 응답 타입 (Union 타입)
export type GroupRoutineDetailResponse =
  | NonParticipantGroupRoutineDetailResponse
  | ParticipantGroupRoutineDetailResponse;

// 단체루틴 상세루틴 성공/실패 요청 타입
export interface UpdateGroupRoutineStatusRequest {
  status: boolean; // 루틴 성공/실패 여부
}

// 단체루틴 상세루틴 성공/실패 응답 타입
export type UpdateGroupRoutineStatusResponse = EmptyResponse;

// 방명록 아이템 타입
export interface GuestbookItem {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  content: string;
  createdAt: string; // yyyy-MM-dd HH:mm:ss 형식
  isWriter: boolean; // 현재 사용자가 작성자인지 여부
}

// 방명록 조회 응답 타입
export interface GroupGuestbookListResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: GuestbookItem[];
}

// 방명록 조회 파라미터 타입
export interface GroupGuestbookListParams {
  page?: number; // 기본값: 0
  size?: number; // 기본값: 20
}

// 방명록 작성 요청 타입
export interface CreateGroupGuestbookRequest {
  content: string; // 방명록 내용
}

// 방명록 작성 응답 타입
export type CreateGroupGuestbookResponse = EmptyResponse;

// 방명록 삭제 응답 타입
export type DeleteGroupGuestbookResponse = EmptyResponse;

// 루틴 템플릿 아이템 타입
export interface RoutineTemplateItem {
  templateId: number;
  emojiId: number;
  name: string;
  content: string;
}

// 루틴 템플릿 조회 응답 타입
export interface RoutineTemplateListResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: RoutineTemplateItem[];
}

// 루틴 템플릿 조회 파라미터 타입
export interface RoutineTemplateListParams {
  category?: string; // 카테고리 필터링 값 (예: "음식")
  page?: number; // 기본값: 0
  size?: number; // 기본값: 10
}

// 이모지 아이템 타입
export interface EmojiItem {
  emojiId: number;
  emojiUrl: string;
}

// 이모지 조회 응답 타입
export interface EmojiListResponse {
  items: EmojiItem[];
}

// 이모지 조회 파라미터 타입
export interface EmojiListParams {
  category?: string; // 카테고리 필터링 값 (예: "식사")
}

// ===== 개인루틴 관련 타입 =====

// 개인루틴 리스트 생성 요청 타입
export interface CreatePersonalRoutineListRequest {
  title: string;
  startDate: string; // yyyy-MM-dd 형식
  startTime: string; // HH:mm 형식
  endTime: string; // HH:mm 형식
  routineType: RoutineType; // 'DAILY' | 'FINANCE'
  dayTypes: string[]; // ['월', '화', '수'] 형식
}

// 개인루틴 리스트 생성 응답 타입
export interface CreatePersonalRoutineListResponse {
  id: number;
  title: string;
  startTime: string; // HH:mm:ss 형식
  endTime: string; // HH:mm:ss 형식
  routineType: RoutineType;
  dayTypes: string[]; // ['월', '화', '수'] 형식
}

// 개인루틴 리스트 수정 요청 타입 (생성과 동일)
export interface UpdatePersonalRoutineListRequest {
  title: string;
  startDate: string; // yyyy-MM-dd 형식
  startTime: string; // HH:mm 형식
  endTime: string; // HH:mm 형식
  routineType: RoutineType; // 'DAILY' | 'FINANCE'
  dayTypes: string[]; // ['월', '화', '수'] 형식
}

// 개인루틴 리스트 수정 응답 타입
export type UpdatePersonalRoutineListResponse = EmptyResponse;

// 개인루틴 리스트 삭제 응답 타입
export type DeletePersonalRoutineListResponse = EmptyResponse;

// 개인루틴 리스트 아이템 타입
export interface PersonalRoutineListItem {
  id: number;
  title: string;
  startTime: string; // HH:mm:ss 형식
  endTime: string; // HH:mm:ss 형식
  routineType: RoutineType;
  dayTypes: string[]; // ['월', '화', '수'] 형식
}

// 개인루틴 리스트 조회 응답 타입
export interface PersonalRoutineListResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: PersonalRoutineListItem[];
}

// 개인루틴 리스트 조회 파라미터 타입
export interface PersonalRoutineListParams {
  day?: string; // 조회 요일 (예: "월")
  date?: string; // 조회 날짜 (예: "2025-08-19")
  page?: number; // 기본값: 0
  size?: number; // 기본값: 10
}

// 개인루틴 상세 생성 요청 타입
export interface CreatePersonalRoutineDetailRequest {
  routineName: string; // 루틴 명
  emojiId: number; // 이모지 Id
  time: number; // 루틴 시간
}

// 개인루틴 상세 생성 응답 타입
export type CreatePersonalRoutineDetailResponse = EmptyResponse;

// 개인루틴 상세 아이템 타입
export interface PersonalRoutineDetailItem {
  routineId: number;
  routineName: string;
  emojiUrl: string;
  time: number;
  completed: boolean;
}

// 개인루틴 상세 조회 응답 타입
export interface PersonalRoutineDetailListResponse {
  items: PersonalRoutineDetailItem[];
}

// 개인루틴 상세 조회 파라미터 타입
export interface PersonalRoutineDetailListParams {
  date: string; // 조회 날짜 (예: "2025-08-19")
}

// 개인루틴 상세 수정 요청 타입 (생성과 동일)
export interface UpdatePersonalRoutineDetailRequest {
  routineName: string; // 루틴 명
  emojiId: number; // 이모지 Id
  time: number; // 루틴 시간
}

// 개인루틴 상세 수정 응답 타입
export type UpdatePersonalRoutineDetailResponse = EmptyResponse;

// 개인루틴 상세 삭제 응답 타입
export type DeletePersonalRoutineDetailResponse = EmptyResponse;

// 개인루틴 수행 응답 타입
export type DonePersonalRoutineResponse = EmptyResponse;

// 개인루틴 수행 파라미터 타입
export interface DonePersonalRoutineParams {
  date: string; // 완료 날짜 (예: "2025-08-19")
}

// 개인루틴 리스트 완료 응답 타입
export type DoneMyRoutineListResponse = EmptyResponse;
