import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';

interface AIRecommendationResultScreenProps {
  navigation: any;
  route: any;
}

const AIRecommendationResultScreen = ({
  navigation,
  route,
}: AIRecommendationResultScreenProps) => {
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>([
    '1',
    '2',
    '4',
    '7',
  ]);

  // 더미 루틴 데이터
  const routines = [
    {
      id: '1',
      title: 'OTT 구독 2개로 줄이기',
      icon: '🎬',
    },
    {
      id: '2',
      title: '배달 음식 일주일에 1번으로 줄이기',
      icon: '🍗',
    },
    {
      id: '3',
      title: '일주일에 커피 3잔만 마시기',
      icon: '☕',
    },
    {
      id: '4',
      title: '밤 10시 이후 야식 금지',
      icon: '🚫',
    },
    {
      id: '5',
      title: '텀블러 사용해서 커피값 할인받기',
      icon: '💰',
    },
    {
      id: '6',
      title: '일주일에 3번 이상 학식 이용하기',
      icon: '🍚',
    },
    {
      id: '7',
      title: '매일 밤 10시, 오늘 쓴 돈 확인하기',
      icon: '✅',
    },
  ];

  const handleRoutineToggle = (routineId: string) => {
    setSelectedRoutines((prev) =>
      prev.includes(routineId)
        ? prev.filter((id) => id !== routineId)
        : [...prev, routineId],
    );
  };

  const handleComplete = () => {
    navigation.navigate('HomeMain');
  };

  return (
    <Container>
      <Content>
        {/* 헤더 섹션 */}
        <HeaderSection>
          <TitleContainer>
            <Title>AI 추천 루틴이 완성됐어요!</Title>
            <Subtitle>
              AI가 지출 패턴을 기반으로 최적의 루틴을 짜봤어요
            </Subtitle>
          </TitleContainer>

          {/* 캐릭터 이미지 */}
          <CharacterImage
            source={require('../../assets/images/character_fire_sol.png')}
            resizeMode="contain"
          />
        </HeaderSection>

        {/* 루틴 리스트 */}
        <RoutineList>
          {routines.map((routine) => (
            <RoutineCard key={routine.id}>
              <RoutineText>{routine.title}</RoutineText>
              <CheckButton
                onPress={() => handleRoutineToggle(routine.id)}
                isSelected={selectedRoutines.includes(routine.id)}
              >
                <MaterialIcons
                  name={
                    selectedRoutines.includes(routine.id)
                      ? 'check-circle'
                      : 'radio-button-unchecked'
                  }
                  size={24}
                  color={
                    selectedRoutines.includes(routine.id)
                      ? theme.colors.primary
                      : theme.colors.gray300
                  }
                />
              </CheckButton>
            </RoutineCard>
          ))}
        </RoutineList>
      </Content>

      {/* 하단 버튼 */}
      <ButtonWrapper>
        <CustomButton
          text={`${selectedRoutines.length}개 선택 완료`}
          onPress={handleComplete}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default AIRecommendationResultScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const HeaderSection = styled.View`
  align-items: flex-start;
  /* margin-bottom: 16px; */
`;

const TitleContainer = styled.View`
  align-items: flex-start;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: black;
  text-align: left;
  line-height: 34px;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: #98989e;
  text-align: left;
  line-height: 24px;
`;

const CharacterImage = styled(Image)`
  width: 120px;
  height: 120px;
  align-self: flex-start;
  opacity: 0.3;
`;

const RoutineList = styled.View`
  flex: 1;
`;

const RoutineCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  /* border: 1px solid ${theme.colors.gray200}; */
`;

const RoutineText = styled.Text`
  flex: 1;
  font-size: 15px;
  font-weight: 400;
  color: #3f3f42;
`;

const CheckButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 4px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
