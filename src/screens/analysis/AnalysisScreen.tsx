import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import {
  TabNavigation,
  AchievementCard,
  WeeklySummary,
  BubbleCard,
  ConsumptionAnalysisCard,
} from '../../components/domain/analysis';

/**
 * AnalysisScreen의 props 인터페이스
 */
interface IAnalysisScreenProps {
  /** 네비게이션 객체 */
  navigation: any;
}

/**
 * 분석 화면 컴포넌트
 * 사용자의 소비 분석 및 추천을 제공합니다.
 * @param props - 컴포넌트 props
 * @returns 분석 화면 컴포넌트
 */
const AnalysisScreen = ({ navigation }: IAnalysisScreenProps) => {
  // 탭 상태 관리
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = ['일상 루틴', '금융 루틴'];

  // 탭 변경 핸들러
  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  // 주간 데이터
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const currentDate = new Date();
  const selectedDayIndex = currentDate.getDay(); // 0: 일요일, 1: 월요일, ...

  // 일상 루틴 데이터
  const dailyRoutines: Array<{
    name: string;
    status: ('completed' | 'incomplete' | 'future' | 'optional')[];
  }> = [
    {
      name: '아침루틴',
      status: [
        'optional',
        'completed',
        'incomplete',
        'incomplete',
        'incomplete',
        'incomplete',
        'optional',
      ],
    },
    {
      name: '저녁루틴',
      status: [
        'completed',
        'completed',
        'incomplete',
        'incomplete',
        'incomplete',
        'incomplete',
        'optional',
      ],
    },
    {
      name: '그룹루틴',
      status: [
        'optional',
        'optional',
        'optional',
        'optional',
        'optional',
        'optional',
        'optional',
      ],
    },
  ];

  // 금융 루틴 데이터
  const financialRoutines: Array<{
    name: string;
    status: ('completed' | 'incomplete' | 'future' | 'optional')[];
  }> = [
    {
      name: '절약루틴',
      status: [
        'optional',
        'completed',
        'incomplete',
        'incomplete',
        'incomplete',
        'incomplete',
        'optional',
      ],
    },
    {
      name: '투자루틴',
      status: [
        'completed',
        'completed',
        'incomplete',
        'incomplete',
        'incomplete',
        'incomplete',
        'optional',
      ],
    },
  ];

  // AI 분석 카드 클릭 핸들러
  const handleAIAnalysisPress = () => {
    if (selectedTab === 0) {
      // 일상 루틴 - AI 분석 및 팁
      console.log('AI 분석 및 팁 화면으로 이동');
    } else {
      // 금융 루틴 - 소비패턴 분석
      navigation.navigate('ConsumptionAnalysis');
    }
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Content>
          {/* 탭 네비게이션 */}
          <TabNavigation
            selectedIndex={selectedTab}
            onTabChange={handleTabChange}
            tabs={tabs}
          />

          {/* 성취 카드 */}
          <AchievementCard
            title="최대 연속"
            achievement={selectedTab === 0 ? '6일 달성' : '5일 달성'}
            routineName={selectedTab === 0 ? '아침루틴' : '절약루틴'}
            points={100}
            progress={selectedTab === 0 ? 85 : 70}
            daysLeft={selectedTab === 0 ? 1 : 2}
          />

          {/* AI 분석 카드 */}
          {selectedTab === 0 ? (
            <BubbleCard
              robotImageSource={require('../../assets/images/robot.png')}
              title="AI 분석 및 팁"
              content={
                <>
                  데이터를 보니, <HighlightText>일요일 오전에</HighlightText>{' '}
                  루틴{'\n'}
                  성공률이 가장 낮아요.
                </>
              }
              onPress={handleAIAnalysisPress}
            />
          ) : (
            <ConsumptionAnalysisCard
              robotImageSource={require('../../assets/images/robot.png')}
              title="이번 주 소비패턴 분석하기"
              subtitle="AI가 분석해주는 내 소비패턴"
              onPress={handleAIAnalysisPress}
            />
          )}

          {/* 주간 요약 */}
          <WeeklySummary
            title="주간 요약"
            dateRange="12월 5일 - 12월 12일"
            weekDays={weekDays}
            routines={selectedTab === 0 ? dailyRoutines : financialRoutines}
            selectedDayIndex={selectedDayIndex}
            onPreviousWeek={() => console.log('이전 주')}
            onNextWeek={() => console.log('다음 주')}
          />
        </Content>
      </ScrollView>
    </Container>
  );
};

export default AnalysisScreen;

// 스타일 컴포넌트 정의
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  padding: 0 24px 24px 24px;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.SemiBold};
`;
