import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ScrollView, Image, View, BackHandler, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../../components/common/Header';
import BubbleCard from '../../components/domain/analysis/BubbleCard';
import { theme } from '../../styles/theme';
import { useRecommendDaily } from '../../hooks/analysis';

const robotIcon = require('../../assets/images/robot.png');
const characterImg = require('../../assets/images/character_mori.png');

const RoutineSuggestionScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>([]);

  // 하드코딩된 추천 루틴 데이터
  const hardcodedRoutines = [
    '매일 아침 도시락 싸서 다니기',
    '식비 예산 세우고 지키기',
    '쇼핑 전 장바구니 목록 작성하기',
    '충동구매 24시간 대기하기',
    '주간 식비 정리하기',
    '온라인 쇼핑 카트 3일간 보관하기',
  ];

  const handleRoutineToggle = (routineId: string) => {
    setSelectedRoutines((prev) =>
      prev.includes(routineId)
        ? prev.filter((id) => id !== routineId)
        : [...prev, routineId],
    );
  };

  // 하드웨어 백 버튼 처리
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // 소비패턴 분석 화면으로 replace로 이동
        navigation.replace('ConsumptionAnalysis');
        return true; // 이벤트 소비
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header
        title="✨ New 추천 루틴"
        onBackPress={() => navigation.replace('ConsumptionAnalysis')}
      />

      <MainContent>
        {/* AI 안내 버블 */}
        <BotMessageSection>
          <BubbleCard
            title=""
            content={
              <>
                사용자 님은 <Highlight>충동형 소비자</Highlight>예요!
                {'\n'}
                <Em>식비</Em> 카테고리의 변동이 잦고,{'\n'}
                <EmSecondary>쇼핑</EmSecondary> 카테고리 소비가 불규칙해요.
                {'\n\n'}
                이러한 소비습관을 고치기 위해서는{'\n'}
                아래와 같은 루틴이 도움이 될 수 있어요.
              </>
            }
            direction="top"
            robotImageSource={robotIcon}
          />
        </BotMessageSection>

        {/* 추천 루틴 섹션 */}
        <SectionCard>
          <SectionHeader>
            <Sparkle>✨</Sparkle>
            <SectionTitle>추천 루틴</SectionTitle>
          </SectionHeader>

          <RoutineScrollView showsVerticalScrollIndicator={false}>
            {hardcodedRoutines.map((routine, index) => (
              <RoutineItem key={index}>
                <RoutineText>{routine}</RoutineText>
              </RoutineItem>
            ))}
          </RoutineScrollView>
        </SectionCard>
      </MainContent>

      <CharacterDecoration>
        <CharacterImage source={characterImg} resizeMode="contain" />
      </CharacterDecoration>
    </Container>
  );
};

export default RoutineSuggestionScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const MainContent = styled.View`
  flex: 1;
  padding-bottom: 120px;
`;

const Highlight = styled.Text`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.SemiBold};
`;

const Em = styled(Highlight)`
  color: #f77f00;
`;

const EmSecondary = styled(Highlight)`
  color: #ff7a7a;
`;

const BotMessageSection = styled.View`
  align-items: center;
  justify-content: flex-start;
`;

const SectionCard = styled.View`
  margin: 4px 16px 0 16px;
  padding: 12px;
  background-color: ${theme.colors.gray50};
  border-radius: 16px;
  height: 300px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const Sparkle = styled.Text`
  margin-right: 6px;
  color: #ffc107;
`;

const SectionTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: #ffc107;
`;

const RoutineItem = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.white};
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const IconSquare = styled.View<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const RoutineIcon = styled(Image)`
  width: 32px;
  height: 32px;
`;

const RoutineText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
  flex: 1;
`;

const CheckButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 4px;
`;

const RoutineScrollView = styled.ScrollView`
  flex: 1;
`;

const CTAFloat = styled.View`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 40px;
  align-items: flex-end;
`;

const CTAButton = styled.TouchableOpacity`
  width: 75%;
  padding: 14px;
  background-color: ${theme.colors.gray100};
  border-radius: 12px;
`;

const CTAContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

const CTAIcon = styled(Ionicons)`
  color: ${theme.colors.primary};
`;

const CTAText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray700};
`;

const CharacterDecoration = styled.View`
  position: absolute;
  left: -80px;
  bottom: 0px;
  width: 300px;
  height: 300px;
  opacity: 0.3;
`;

const CharacterImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray600};
  text-align: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.error};
  text-align: center;
  padding: 20px;
`;

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray600};
  text-align: center;
  padding: 20px;
`;
