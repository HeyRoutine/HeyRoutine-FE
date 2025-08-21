import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { TextInput, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import RoutineCategorySelector from '../../components/domain/routine/RoutineCategorySelector';
import DayOfWeekSelector from '../../components/domain/routine/DayOfWeekSelector';
import TimeRangeSelector from '../../components/domain/routine/TimeRangeSelector';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import DatePickerModal from '../../components/domain/routine/DatePickerModal';
import TimePickerModal from '../../components/domain/routine/TimePickerModal';

interface CreateRoutineScreenProps {
  navigation: any;
}

const CreateRoutineScreen = ({ navigation }: CreateRoutineScreenProps) => {
  const [routineName, setRoutineName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('life');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleCreateRoutine = () => {
    // TODO: 루틴 생성 로직
    console.log('루틴 생성:', {
      name: routineName,
      category: selectedCategory,
      days: selectedDays,
      startTime,
      endTime,
    });

    // CreateRoutineDetailScreen으로 이동
    navigation.navigate('CreateRoutineDetail', {
      routineData: {
        name: routineName,
        category: selectedCategory,
        days: selectedDays,
        startTime,
        endTime,
      },
    });
  };

  const isFormValid = routineName.trim() && selectedDays.length > 0;

  const categories = [
    { id: 'life', name: '생활' },
    { id: 'finance', name: '소비' },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryModal(false);
  };

  const handleDateSelect = (date: string) => {
    setSelectedStartDate(date);
    setShowDatePicker(false);
  };

  const handleStartTimeSelect = (time: string | number) => {
    console.log('시작 시간 선택됨:', time, typeof time);
    if (typeof time === 'string') {
      setStartTime(time);
      console.log('시작 시간 설정됨:', time);
    }
    setShowStartTimePicker(false);
  };

  const handleEndTimeSelect = (time: string | number) => {
    console.log('종료 시간 선택됨:', time, typeof time);
    if (typeof time === 'string') {
      setEndTime(time);
      console.log('종료 시간 설정됨:', time);
    }
    setShowEndTimePicker(false);
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.gray800}
          />
        </BackButton>
        <Title>루틴 생성</Title>
        <Spacer />
      </Header>

      <Content>
        {/* 루틴 이름 입력 */}
        <InputSection>
          <InputContainer>
            <NameInput
              placeholder="예) 아침루틴"
              value={routineName}
              onChangeText={setRoutineName}
              placeholderTextColor={theme.colors.gray400}
            />
            <Underline />
          </InputContainer>
        </InputSection>

        {/* 루틴 카테고리 선택 */}
        <RoutineCategorySelector
          selectedCategory={selectedCategory}
          onCategoryChange={() => setShowCategoryModal(true)}
        />

        {/* 요일 선택 */}
        <DayOfWeekSelector
          selectedDays={selectedDays}
          onDaysChange={setSelectedDays}
          onStartDatePress={() => setShowDatePicker(true)}
          selectedStartDate={selectedStartDate}
          buttonSize={40}
          borderRadius={20}
        />

        {/* 시간 선택 */}
        <TimeRangeSelector
          startTime={startTime}
          endTime={endTime}
          onStartTimePress={() => setShowStartTimePicker(true)}
          onEndTimePress={() => setShowEndTimePicker(true)}
        />
      </Content>

      {/* 하단 버튼 */}
      <ButtonWrapper>
        <CustomButton
          text="루틴 생성"
          onPress={handleCreateRoutine}
          disabled={!isFormValid}
          backgroundColor={
            isFormValid ? theme.colors.primary : theme.colors.gray300
          }
          textColor={isFormValid ? theme.colors.white : theme.colors.gray500}
        />
      </ButtonWrapper>

      {/* 루틴 카테고리 선택 모달 */}
      <BottomSheetDialog
        visible={showCategoryModal}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <ModalTitle>루틴 유형</ModalTitle>
        <CategoryButtonsContainer>
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              onPress={() => handleCategorySelect(category.id)}
              isSelected={selectedCategory === category.id}
            >
              <CategoryButtonText isSelected={selectedCategory === category.id}>
                {category.name}
              </CategoryButtonText>
            </CategoryButton>
          ))}
        </CategoryButtonsContainer>
      </BottomSheetDialog>

      {/* 시작 날짜 선택 모달 */}
      <DatePickerModal
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
        onDateSelect={handleDateSelect}
      />

      {/* 시작 시간 선택 모달 */}
      <TimePickerModal
        visible={showStartTimePicker}
        onRequestClose={() => setShowStartTimePicker(false)}
        onTimeSelect={handleStartTimeSelect}
        type="time"
        initialTime="09:00"
      />

      {/* 종료 시간 선택 모달 */}
      <TimePickerModal
        visible={showEndTimePicker}
        onRequestClose={() => setShowEndTimePicker(false)}
        onTimeSelect={handleEndTimeSelect}
        type="time"
        initialTime="11:00"
      />
    </Container>
  );
};

export default CreateRoutineScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray200};
`;

const BackButton = styled(TouchableOpacity)`
  padding: 4px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
`;

const Spacer = styled.View`
  width: 32px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px 16px;
`;

const InputSection = styled.View`
  margin-bottom: 24px;
`;

const InputLabel = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 12px;
`;

const InputContainer = styled.View`
  align-items: center;
`;

const NameInput = styled(TextInput)`
  font-family: ${theme.fonts.SemiBold};
  font-size: 28px;
  color: ${theme.colors.gray300};
  padding: 16px 0;
  text-align: center;
`;

const Underline = styled.View`
  height: 1px;
  background-color: ${theme.colors.gray300};
  width: 100%;
`;

const ButtonWrapper = styled.View`
  padding: 24px 16px;
  background-color: ${theme.colors.white};
  border-top-width: 1px;
  border-top-color: ${theme.colors.gray200};
`;

// 모달 관련 스타일
const ModalTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
  text-align: center;
  margin-bottom: 24px;
`;

const CategoryButtonsContainer = styled.View`
  gap: 12px;
`;

const CategoryButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ isSelected }) =>
      isSelected ? theme.colors.primary : theme.colors.gray300};
  background-color: ${theme.colors.white};
  align-items: center;
`;

const CategoryButtonText = styled(Text)<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray600};
`;
