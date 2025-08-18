import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Image } from 'react-native';

import { theme } from '../../../styles/theme';

/**
 * BubbleCard의 props 인터페이스
 */
interface IBubbleCardProps {
  /** 로봇 이미지 소스 */
  robotImageSource: any;
  /** 말풍선 제목 */
  title: string;
  /** 말풍선 내용 */
  content: React.ReactNode;
  /** 클릭 핸들러 */
  onPress?: () => void;
}

/**
 * 말풍선 형태의 AI 분석 카드 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 말풍선 카드 컴포넌트
 */
const BubbleCard = ({
  robotImageSource,
  title,
  content,
  onPress,
}: IBubbleCardProps) => {
  return (
    <Container onPress={onPress} disabled={!onPress}>
      <RobotSection>
        <RobotIconContainer>
          <RobotImage source={robotImageSource} />
        </RobotIconContainer>
      </RobotSection>
      <SpeechBubbleContainer>
        <BubbleTail />
        <SpeechBubble>
          <BubbleTitle>{title}</BubbleTitle>
          <BubbleContent>{content}</BubbleContent>
        </SpeechBubble>
      </SpeechBubbleContainer>
    </Container>
  );
};

export default BubbleCard;

const Container = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  background-color: transparent;
  margin-bottom: 16px;
`;

const RobotSection = styled.View`
  margin-right: 12px;
`;

const RobotIconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${theme.colors.white};
  align-items: center;
  justify-content: center;
`;

const RobotImage = styled(Image)`
  width: 48px;
  height: 48px;
`;

const SpeechBubbleContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const SpeechBubble = styled.View`
  background-color: #f2f6ff;
  border-radius: 12px;
  padding: 16px;
  flex: 1;
`;

const BubbleTitle = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray500};
  margin-bottom: 8px;
`;

const BubbleContent = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray700};
  line-height: 20px;
`;

const BubbleTail = styled.View`
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-left-width: 0;
  border-right-width: 12px;
  border-bottom-width: 8px;
  border-top-width: 8px;
  border-left-color: transparent;
  border-right-color: #f2f6ff;
  border-bottom-color: transparent;
  border-top-color: transparent;
`;
