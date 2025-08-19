import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';

interface CreateRoutineScreenProps {
  navigation: any;
}

const CreateRoutineScreen = ({ navigation }: CreateRoutineScreenProps) => {
  const [routineName, setRoutineName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('생활');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCreate = () => {
    // 루틴 생성 로직
    navigation.goBack();
  };

  return (
    <Container>
      <Header title="루틴 만들기" onBackPress={handleBack} />
      <Content>
        <Section>
          <SectionTitle>루틴 이름</SectionTitle>
          <Input
            value={routineName}
            onChangeText={setRoutineName}
            placeholder="루틴 이름을 입력하세요"
          />
        </Section>

        <Section>
          <SectionTitle>카테고리</SectionTitle>
          {/* RoutineCategorySelector 컴포넌트가 여기에 들어갑니다 */}
        </Section>

        <Section>
          <SectionTitle>시간</SectionTitle>
          {/* TimeRangeSelector 컴포넌트가 여기에 들어갑니다 */}
        </Section>

        <Section>
          <SectionTitle>요일</SectionTitle>
          {/* DayOfWeekSelector 컴포넌트가 여기에 들어갑니다 */}
        </Section>
      </Content>
    </Container>
  );
};

export default CreateRoutineScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 12px;
`;

const Input = styled.TextInput`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 16px;
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;
