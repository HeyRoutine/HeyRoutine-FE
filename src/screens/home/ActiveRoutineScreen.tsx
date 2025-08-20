import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import ProgressCircle from '../../components/common/ProgressCircle';
import RoutineActionButton from '../../components/domain/routine/RoutineActionButton';

const ActiveRoutineScreen = ({ navigation }: any) => {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10분을 초로
  const [isActive, setIsActive] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(((10 * 60 - newTime) / (10 * 60)) * 100);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    setIsActive(!isActive);
  };

  const handleComplete = () => {
    // 루틴 완료 로직
    navigation.goBack();
  };

  const handleSkip = () => {
    // 루틴 건너뛰기 로직
    navigation.goBack();
  };

  const handleBack = () => navigation.goBack();

  return (
    <Container>
      <Header title="루틴 타이머" onBackPress={handleBack} />
      <ScrollContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <ContentContainer>
          <Title>식빵 굽기</Title>
          <Subtitle>병병이의 아침루틴</Subtitle>

          <TimerContainer>
            <ProgressCircle
              progress={progress}
              size={280}
              strokeWidth={8}
              progressColor={theme.colors.primary}
              backgroundColor={theme.colors.gray200}
            />
            <TimerContent>
              <BreadIcon>🍞</BreadIcon>
              <TimeLeft>{formatTime(timeLeft)}</TimeLeft>
              <TotalTime>10분</TotalTime>
            </TimerContent>
          </TimerContainer>

          <ActionButtonsContainer>
            <RoutineActionButton type="pause" onPress={handlePause} />
            <RoutineActionButton type="complete" onPress={handleComplete} />
            <RoutineActionButton type="skip" onPress={handleSkip} />
          </ActionButtonsContainer>
        </ContentContainer>
      </ScrollContent>
    </Container>
  );
};

export default ActiveRoutineScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 28px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 60px;
`;

const TimerContainer = styled.View`
  margin-bottom: 60px;
  position: relative;
  width: 280px;
  height: 280px;
  justify-content: center;
  align-items: center;
`;

const TimerContent = styled.View`
  position: absolute;
  align-items: center;
  z-index: 1;
`;

const BreadIcon = styled.Text`
  font-size: 48px;
  margin-bottom: 16px;
`;

const TimeLeft = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 36px;
  color: ${theme.colors.gray900};
  margin-bottom: 8px;
`;

const TotalTime = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
