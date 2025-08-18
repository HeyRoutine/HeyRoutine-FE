import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';

import { theme } from '../../../styles/theme';

/**
 * TabNavigation의 props 인터페이스
 */
interface ITabNavigationProps {
  /** 현재 선택된 탭 인덱스 */
  selectedIndex: number;
  /** 탭 변경 시 호출되는 콜백 */
  onTabChange: (index: number) => void;
  /** 탭 라벨 배열 */
  tabs: string[];
}

/**
 * 분석 탭에서 사용하는 탭 네비게이션 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 탭 네비게이션 컴포넌트
 */
const TabNavigation = ({
  selectedIndex,
  onTabChange,
  tabs,
}: ITabNavigationProps) => {
  const [textWidths, setTextWidths] = useState<number[]>([]);

  const handleTextLayout = (index: number, event: any) => {
    const { width } = event.nativeEvent.layout;
    setTextWidths((prev) => {
      const newWidths = [...prev];
      newWidths[index] = width;
      return newWidths;
    });
  };

  return (
    <Container>
      {tabs.map((tab, index) => (
        <TabButton
          key={index}
          onPress={() => onTabChange(index)}
          isSelected={selectedIndex === index}
        >
          <TabText
            isSelected={selectedIndex === index}
            onLayout={(event) => handleTextLayout(index, event)}
          >
            {tab}
          </TabText>
          {selectedIndex === index && (
            <SelectedIndicator style={{ width: textWidths[index] || 0 }} />
          )}
        </TabButton>
      ))}
    </Container>
  );
};

export default TabNavigation;

const Container = styled.View`
  flex-direction: row;
  margin-right: 24px;
  margin-bottom: 24px;
  margin-top: 60px;
  width: 30%;
  justify-content: space-between;
`;

const TabButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
  align-items: flex-start;
  padding: 16px 0;
`;

const TabText = styled.Text<{ isSelected: boolean }>`
  font-size: 16px;
  font-family: ${(props) =>
    props.isSelected ? theme.fonts.SemiBold : theme.fonts.Regular};
  color: ${(props) =>
    props.isSelected ? theme.colors.primary : theme.colors.gray400};
  margin-bottom: 8px;
  align-self: flex-start;
`;

const SelectedIndicator = styled.View`
  height: 2px;
  background-color: ${theme.colors.primary};
  border-radius: 1px;
`;
