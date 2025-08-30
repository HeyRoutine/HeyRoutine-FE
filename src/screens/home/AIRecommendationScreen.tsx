import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import { useSurvey } from '../../hooks/user';
import { getDailyAnalysis } from '../../api/analysis';
import { useOnboardingStore } from '../../store';

interface InterestItem {
  id: string;
  title: string;
  selected: boolean;
}

interface AIRecommendationScreenProps {
  navigation: any;
  route: any;
}

const AIRecommendationScreen = ({
  navigation,
  route,
}: AIRecommendationScreenProps) => {
  const { completeOnboarding } = useOnboardingStore();
  const [currentPage, setCurrentPage] = useState(1);

  // 홈 화면에서 온 경우인지 확인
  const isFromHome = route.params?.fromHome;
  const [selectedItemsByPage, setSelectedItemsByPage] = useState<{
    [key: number]: string[];
  }>({
    1: [],
    2: [],
    3: [],
    4: [],
  });

  // 설문 API 훅
  const { mutate: submitSurvey, isPending } = useSurvey();

  // 현재 페이지의 선택된 항목들
  const currentSelectedItems = selectedItemsByPage[currentPage] || [];

  // 페이지별 데이터
  const pageData = {
    1: [
      { id: 'efficient_commute', title: '효율적인 출근 준비' },
      { id: 'regular_meals', title: '규칙적인 식사' },
      { id: 'exercise_habit', title: '운동 습관 교정' },
      { id: 'regular_sleep', title: '규칙적인 수면' },
      { id: 'study_habit', title: '학습 습관 교정' },
      { id: 'housework', title: '집안일' },
      { id: 'miracle_morning', title: '미라클 모닝' },
      { id: 'consumption_habit', title: '소비 습관 교정' },
      { id: 'exam_schedule', title: '시험기간 일정관리' },
    ],
    2: [
      { id: 'stretching', title: '스트레칭' },
      { id: 'before_work', title: '업무 시작전' },
      { id: 'priority_selection', title: '우선순위 선정' },
      { id: 'financial_habit', title: '재무 습관' },
      { id: 'organization', title: '정리정돈' },
      { id: 'digital_detox', title: '디지털 디톡스' },
      { id: 'drink_water', title: '물 마시기' },
      { id: 'diet', title: '다이어트' },
    ],
    3: [
      { id: 'meditation', title: '명상/호흡' },
      { id: 'self_development', title: '자기계발' },
      { id: 'skincare', title: '피부' },
      { id: 'parenting', title: '육아' },
      { id: 'pet_care', title: '반려동물' },
      { id: 'grocery_shopping', title: '장보기' },
      { id: 'commute_health', title: '출퇴근 건강' },
      { id: 'home_workout', title: '홈트' },
    ],
    4: [
      { id: 'early_morning', title: '이른 아침(04~07시)' },
      { id: 'morning', title: '아침(07~10시)' },
      { id: 'lunch_brunch', title: '점심/브런치(11~13시)' },
      { id: 'afternoon', title: '오후(13~17시)' },
      { id: 'evening', title: '저녁(17~21시)' },
      { id: 'night', title: '밤/야간(21~01시)' },
      { id: 'weekday', title: '평일' },
      { id: 'weekend', title: '주말' },
    ],
  };

  // 페이지별 제목
  const pageTitles = {
    1: '어떤 고민이 있나요?',
    2: '어떤 고민이 있나요?',
    3: '어떤 고민이 있나요?',
    4: '어떤 시간대에 루틴을 만들고 싶나요?',
  };

  // 현재 페이지의 아이템들
  const currentItems = pageData[currentPage as keyof typeof pageData];

  // 아이템 선택/해제
  const handleItemToggle = (itemId: string) => {
    setSelectedItemsByPage((prev) => {
      const currentPageItems = prev[currentPage] || [];
      const newPageItems = currentPageItems.includes(itemId)
        ? currentPageItems.filter((id) => id !== itemId)
        : currentPageItems.length >= 7
          ? currentPageItems // 최대 7개 제한
          : [...currentPageItems, itemId];

      return {
        ...prev,
        [currentPage]: newPageItems,
      };
    });
  };

  // 이전 페이지
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지
  const handleNext = () => {
    if (currentPage < 4) {
      setCurrentPage(currentPage + 1);
    } else {
      // 마지막 페이지에서 완료 처리
      handleComplete();
    }
  };

  // 완료 처리
  const handleComplete = async () => {
    // 모든 페이지의 선택된 항목들을 수집
    const allSelectedItems = Object.values(selectedItemsByPage).flat();
    console.log('선택된 항목들:', allSelectedItems);

    // 설문 데이터를 boolean 배열로 변환
    const surveyList: boolean[] = [];

    // 각 페이지의 모든 항목을 순서대로 체크
    Object.keys(pageData).forEach((pageKey) => {
      const pageNum = parseInt(pageKey);
      const pageItems = pageData[pageNum as keyof typeof pageData];
      const selectedItems = selectedItemsByPage[pageNum] || [];

      pageItems.forEach((item) => {
        surveyList.push(selectedItems.includes(item.id));
      });
    });

    console.log('설문 데이터:', surveyList);

    try {
      // 설문 제출
      const surveyResult = await submitSurvey({ surveyList });
      console.log('설문 제출 성공:', surveyResult);

      // 3초 대기 후 daily analysis GET 요청
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const analysisResult = await getDailyAnalysis();
      console.log(
        '🔍 Daily Analysis API 응답:',
        JSON.stringify(analysisResult, null, 2),
      );

      if (analysisResult) {
        console.log('🔍 API 응답 구조 분석:');
        console.log('- isSuccess:', analysisResult.isSuccess);
        console.log('- message:', analysisResult.message);
        console.log('- result 타입:', typeof analysisResult.result);
        console.log(
          '- result 키들:',
          analysisResult.result ? Object.keys(analysisResult.result) : 'null',
        );

        if (analysisResult.result && analysisResult.result.routines) {
          console.log(
            '- 루틴 배열 길이:',
            analysisResult.result.routines.length,
          );
          analysisResult.result.routines.forEach(
            (routine: any, index: number) => {
              console.log(`- 루틴 ${index + 1} 상세:`, routine);
            },
          );
        }
      }

      // AI 분석 로딩 화면으로 이동 (결과 데이터 포함)
      navigation.navigate('Loading', {
        title: 'AI 분석 중',
        description: '설문 결과를 바탕으로 맞춤 루틴을 생성하고 있어요',
        statusItems: [
          { text: '설문 데이터 분석 중...' },
          { text: '사용자 패턴 분석 중...' },
          { text: 'AI 추천 알고리즘 실행 중...' },
          { text: '맞춤 루틴 생성 중...' },
          { text: '완료!' },
        ],
        nextScreen: 'AIRecommendationResult',
        duration: 5000,
        resultData: analysisResult?.result || null,
        fromHome: isFromHome,
      });
    } catch (error) {
      console.error('API 호출 실패:', error);
      // 에러 처리 (나중에 토스트 메시지 등 추가)
    }
  };

  // 뒤로가기
  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <Container>
      <Header
        title=""
        onBackPress={currentPage > 1 ? handleBack : undefined}
        rightComponent={<ProgressText>{currentPage} / 4</ProgressText>}
      />

      <Content>
        {/* 제목 */}
        <TitleContainer>
          <Title>{pageTitles[currentPage as keyof typeof pageTitles]}</Title>
          <Subtitle>최대 7개 선택 가능해요</Subtitle>
        </TitleContainer>

        {/* 선택 카드들 */}
        <CardGrid>
          {currentItems.map((item) => (
            <InterestCard
              key={item.id}
              onPress={() => handleItemToggle(item.id)}
              isSelected={currentSelectedItems.includes(item.id)}
            >
              <CardText isSelected={currentSelectedItems.includes(item.id)}>
                {item.title}
              </CardText>
            </InterestCard>
          ))}
        </CardGrid>
      </Content>

      {/* 하단 버튼 */}
      <ButtonContainer>
        {currentPage === 1 ? (
          <ButtonColumn>
            <CustomButton
              text={isFromHome ? '돌아가기' : '건너뛰기'}
              onPress={
                isFromHome
                  ? () => navigation.navigate('Home')
                  : completeOnboarding
              }
              backgroundColor={theme.colors.white}
              textColor={theme.colors.gray600}
              borderColor={theme.colors.gray300}
              borderWidth={1}
            />
            <CustomButton
              text="다음"
              onPress={handleNext}
              backgroundColor={
                currentSelectedItems.length === 0
                  ? theme.colors.gray300
                  : theme.colors.primary
              }
              textColor={theme.colors.white}
              disabled={currentSelectedItems.length === 0 || isPending}
            />
          </ButtonColumn>
        ) : (
          <CustomButton
            text={
              currentPage === 4 ? (isPending ? '처리 중...' : '완료') : '다음'
            }
            onPress={handleNext}
            backgroundColor={
              currentSelectedItems.length === 0
                ? theme.colors.gray300
                : theme.colors.primary
            }
            textColor={theme.colors.white}
            disabled={currentSelectedItems.length === 0 || isPending}
          />
        )}
      </ButtonContainer>
    </Container>
  );
};

export default AIRecommendationScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 0 24px 0 24px;
`;

const ProgressText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray600};
`;

const TitleContainer = styled.View`
  margin-top: 16px;
  margin-bottom: 48px;
`;

const Title = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
`;

const Subtitle = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  line-height: 24px;
  margin-top: 8px;
`;

const CardGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
`;

const InterestCard = styled(TouchableOpacity)<{ isSelected: boolean }>`
  padding: 12px 24px;
  border-radius: 20px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray100};
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  flex-shrink: 0;
`;

const CardText = styled.Text<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.gray800};
  text-align: center;
  line-height: 20px;
`;

const ButtonContainer = styled.View`
  padding: 16px;
  background-color: ${theme.colors.white};
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ButtonColumn = styled.View`
  flex-direction: column;
  gap: 12px;
`;
