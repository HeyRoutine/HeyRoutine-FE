import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { theme } from '../../styles/theme';

interface ProgressCircleProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const ProgressCircle = ({
  progress,
  size = 200,
  strokeWidth = 8,
  color = theme.colors.primary,
}: ProgressCircleProps) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const animatedText = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(animatedText, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const animatedTextValue = animatedText.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
  });

  return (
    <Container size={size}>
      <Svg width={size} height={size}>
        {/* 배경 원 */}
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.gray200}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* 진행률 원 */}
        <AnimatedSvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <AnimatedProgressText>{Math.round(progress)}%</AnimatedProgressText>
    </Container>
  );
};

export default ProgressCircle;

const Container = styled.View<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const AnimatedSvgCircle = Animated.createAnimatedComponent(SvgCircle);

const AnimatedProgressText = styled(Animated.Text)`
  position: absolute;
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
`;
