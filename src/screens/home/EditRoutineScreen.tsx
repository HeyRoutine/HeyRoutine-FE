import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {
  TextInput,
  TouchableOpacity,
  Text,
  View,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import RoutineCategorySelector from '../../components/domain/routine/RoutineCategorySelector';
import DayOfWeekSelector from '../../components/domain/routine/DayOfWeekSelector';
import TimeRangeSelector from '../../components/domain/routine/TimeRangeSelector';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import DatePickerModal from '../../components/domain/routine/DatePickerModal';
import TimePickerModal from '../../components/domain/routine/TimePickerModal';

interface EditRoutineScreenProps {
  navigation: any;
  route: { params?: { routineData?: any } };
}

const EditRoutineScreen = ({ navigation, route }: EditRoutineScreenProps) => {
  const routineData = route?.params?.routineData;
  const [routineName, setRoutineName] = useState(routineData?.name || '');
  const [selectedCategory, setSelectedCategory] = useState(
    routineData?.category || 'life',
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.days || [],
  );
  const [startTime, setStartTime] = useState(routineData?.startTime || '');
  const [endTime, setEndTime] = useState(routineData?.endTime || '');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(
    routineData?.startDate || '2025-01-01',
  );
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);

  const handleEditRoutine = () => {
    // TODO: 루틴 수정 로직
    console.log('루틴 수정:', {
      name: routineName,
      category: selectedCategory,
      days: selectedDays,
      startTime,
      endTime,
    });

    // 수정 완료 후 ResultScreen으로 이동
    navigation.navigate('Result', {
      type: 'success',
      title: '루틴 수정 완료',
      description: '루틴이 성공적으로 수정되었습니다.',
      nextScreen: 'Home',
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

  // 폰의 뒤로가기 버튼 처리
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setExitConfirmVisible(true);
        return true; // 이벤트 소비
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const handleBack = () => {
    setExitConfirmVisible(true);
  };

  const closeExitConfirm = () => setExitConfirmVisible(false);

  const handleConfirmExit = () => {
    closeExitConfirm();
    navigation.goBack();
  };

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header>
        <BackButton onPress={handleBack}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.gray800}
          />
        </BackButton>
        <Title>루틴 수정</Title>
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
          readOnly={false}
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
      <ButtonContainer>
        <CustomButton
          text="루틴 수정"
          onPress={handleEditRoutine}
          disabled={!isFormValid}
          backgroundColor={
            isFormValid ? theme.colors.primary : theme.colors.gray200
          }
          textColor={isFormValid ? theme.colors.white : theme.colors.gray500}
        />
      </ButtonContainer>

      {/* 루틴 카테고리 선택 모달 */}
      <BottomSheetDialog
        visible={showCategoryModal}
        onRequestClose={() => setShowCategoryModal(false)}
      >
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

      {/* 나가기 확인 모달 */}
      <BottomSheetDialog
        visible={exitConfirmVisible}
        onRequestClose={closeExitConfirm}
      >
        <ModalTitle>정말 나가시겠습니까?</ModalTitle>
        <ModalSubtitle>변경한 내용은 저장되지 않습니다.</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={closeExitConfirm}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <ConfirmButton onPress={handleConfirmExit}>
              <ConfirmText>나가기</ConfirmText>
            </ConfirmButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>
    </Container>
  );
};

export default EditRoutineScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
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
  flex: 1;
`;

const ButtonContainer = styled.View`
  padding: 24px;
`;

// 모달 관련 스타일
const ModalTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
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

// 나가기 확인 모달 스타일
const ModalSubtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 36px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: ${theme.colors.gray200};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const CancelText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray700};
`;

const ConfirmButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const ConfirmText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;
