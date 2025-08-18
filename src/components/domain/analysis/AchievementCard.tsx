import React from 'react';
import styled from 'styled-components/native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../styles/theme';

/**
 * AchievementCard의 props 인터페이스
 */
interface IAchievementCardProps {
  /** 성취 제목 (예: "최대 연속") */
  title: string;
  /** 성취 수치 (예: "6일 달성") */
  achievement: string;
  /** 루틴 이름 (예: "아침루틴") */
  routineName: string;
  /** 포인트 */
  points: number;
  /** 진행률 (0-100) */
  progress: number;
  /** 남은 일수 */
  daysLeft: number;
  /** 포인트 아이콘 색상 */
  pointIconColor?: string;
}

/**
 * 성취 카드 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 성취 카드 컴포넌트
 */
const AchievementCard = ({
  title,
  achievement,
  routineName,
  points,
  progress,
  daysLeft,
  pointIconColor = '#FFD700',
}: IAchievementCardProps) => {
  return (
    <Container>
      <LeftSection>
        <TitleText>{title}</TitleText>
        <AchievementText>{achievement}</AchievementText>
        <RoutineName>{routineName}</RoutineName>
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={progress} />
            <ProgressText>{daysLeft}일 남음</ProgressText>
          </ProgressBar>
        </ProgressContainer>
      </LeftSection>
      <RightSection>
        <PointIconContainer>
          <PointImage source={require('../../../assets/images/point.png')} />
        </PointIconContainer>
        <PointText>+{points} p</PointText>
      </RightSection>
    </Container>
  );
};

export default AchievementCard;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: ${theme.colors.white};
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid ${theme.colors.gray200};
`;

const LeftSection = styled.View`
  flex: 1;
`;

const TitleText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-bottom: 4px;
`;

const AchievementText = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.primary};
  margin-bottom: 8px;
`;

const RoutineName = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-bottom: 16px;
`;

const ProgressContainer = styled.View`
  width: 100%;
`;

const ProgressBar = styled.View`
  height: 8px;
  background-color: ${theme.colors.gray200};
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.View<{ progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: ${theme.colors.primary};
  border-radius: 4px;
`;

const ProgressText = styled.Text`
  position: absolute;
  top: -20px;
  right: 0;
  font-size: 12px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray500};
`;

const RightSection = styled.View`
  align-items: center;
  margin-left: 16px;
`;

const PointIconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${theme.colors.gray100};
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const PointImage = styled(Image)`
  width: 32px;
  height: 32px;
`;

const PointText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.SemiBold};
  color: #ffd700;
`;
