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
import {
  useCreateGroupRoutine,
  useUpdateGroupRoutine,
} from '../../hooks/routine/group/useGroupRoutines';
import { RoutineType, DayType } from '../../types/api';

interface CreateGroupRoutineScreenProps {
  navigation: any;
  route: { params?: { mode?: 'create' | 'edit'; routineData?: any } };
}

const CreateGroupRoutineScreen = ({
  navigation,
  route,
}: CreateGroupRoutineScreenProps) => {
  const mode = route?.params?.mode || 'create';
  const routineData = route?.params?.routineData;

  console.log('🔍 CreateGroupRoutineScreen - 전달받은 데이터:', {
    mode,
    routineData,
  });

  // 기존 데이터로 초기화 (수정 모드인 경우)
  const [routineName, setRoutineName] = useState(routineData?.title || '');
  const [description, setDescription] = useState(
    routineData?.description || '',
  );
  const [selectedCategory, setSelectedCategory] = useState(
    routineData?.routineType === 'DAILY' ? 'life' : 'finance',
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.dayTypes || [],
  );
  const [startTime, setStartTime] = useState(routineData?.startTime || '');
  const [endTime, setEndTime] = useState(routineData?.endTime || '');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(
    routineData?.startDate || '',
  );

  console.log('🔍 CreateGroupRoutineScreen - 초기화된 상태:', {
    routineName,
    description,
    selectedCategory,
    selectedDays,
    startTime,
    endTime,
    selectedStartDate,
  });
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // 그룹루틴 생성/수정 훅
  const { mutate: createGroupRoutine, isPending: isCreating } =
    useCreateGroupRoutine();
  const { mutate: updateGroupRoutine, isPending: isUpdating } =
    useUpdateGroupRoutine();

  const isPending = isCreating || isUpdating;

  const handleSubmitRoutine = () => {
    console.log('🔍 그룹 루틴 처리 시작:', {
      mode,
      name: routineName,
      category: selectedCategory,
      days: selectedDays,
      startTime,
      endTime,
      startDate: selectedStartDate,
    });

    // API 요청 데이터 준비
    const submitData = {
      title: routineName,
      description: description, // 그룹 루틴은 description 필드가 필요
      startTime: formatTimeForAPI(startTime), // HH:mm 형식
      endTime: formatTimeForAPI(endTime), // HH:mm 형식
      routineType: (selectedCategory === 'life'
        ? 'DAILY'
        : 'FINANCE') as RoutineType,
      daysOfWeek: selectedDays as DayType[],
    };

    console.log('🔍 그룹 루틴 API 요청 데이터:', submitData);

    if (mode === 'edit') {
      // 수정 모드
      if (!routineData?.id) {
        console.error('🔍 그룹 루틴 ID가 없습니다:', routineData);
        return;
      }

      updateGroupRoutine(
        {
          groupRoutineListId: routineData.id.toString(),
          data: submitData,
        },
        {
          onSuccess: (data) => {
            console.log('🔍 그룹 루틴 수정 성공:', data);
            navigation.navigate('Result', {
              type: 'success',
              title: '그룹 루틴 수정 완료',
              description: '그룹 루틴이 성공적으로 수정되었습니다.',
              nextScreen: 'HomeMain',
            });
          },
          onError: (error) => {
            console.error('🔍 그룹 루틴 수정 실패:', error);
            // 에러 처리 (나중에 토스트나 알림 추가)
          },
        },
      );
    } else {
      // 생성 모드 - API 호출 없이 상세 생성 화면으로 이동
      console.log('🔍 그룹 루틴 상세 생성 화면으로 이동');

      // CreateGroupRoutineDetailScreen으로 이동 (API 호출 없이)
      navigation.navigate('CreateGroupRoutineDetail', {
        routineData: {
          name: routineName,
          category: selectedCategory,
          days: selectedDays,
          startTime,
          endTime,
          startDate: selectedStartDate,
          description: description, // 설명도 전달
        },
      });
    }
  };

  const isFormValid =
    routineName.trim() && selectedDays.length > 0 && startTime && endTime;

  const categories = [
    { id: 'life', name: '생활' },
    { id: 'finance', name: '소비' },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryModal(false);
  };

  const handleDateSelect = (date: string) => {
    // date는 이미 YYYY-MM-DD 형식으로 전달됨
    console.log('선택된 날짜:', date);
    setSelectedStartDate(date);
    setShowDatePicker(false);
  };

  // 시간을 HH:mm 형식으로 변환하는 함수 (화면 표시용)
  const formatTimeForDisplay = (time: string): string => {
    // "오전 9:00" 또는 "오후 2:30" 형식을 "09:00" 또는 "14:30"으로 변환
    let hour: string;
    let minute: string;

    if (time.includes('오전')) {
      hour = time.replace('오전 ', '').split(':')[0];
      minute = time.split(':')[1];
      return `${hour.padStart(2, '0')}:${minute}`;
    } else if (time.includes('오후')) {
      const hourNum = parseInt(time.replace('오후 ', '').split(':')[0]) + 12;
      minute = time.split(':')[1];
      return `${hourNum.toString().padStart(2, '0')}:${minute}`;
    }
    return time; // 이미 HH:mm 형식이면 그대로 반환
  };

  // 시간을 HH:mm 형식으로 변환하는 함수 (API 요청용)
  const formatTimeForAPI = (time: string): string => {
    // HH:mm 형식을 그대로 반환 (그룹 루틴은 HH:mm 형식 사용)
    return time;
  };

  const handleStartTimeSelect = (time: string | number) => {
    console.log('시작 시간 선택됨:', time, typeof time);
    if (typeof time === 'string') {
      const displayTime = formatTimeForDisplay(time);
      setStartTime(displayTime);
      console.log('시작 시간 설정됨:', displayTime);
    }
    setShowStartTimePicker(false);
  };

  const handleEndTimeSelect = (time: string | number) => {
    console.log('종료 시간 선택됨:', time, typeof time);
    if (typeof time === 'string') {
      const displayTime = formatTimeForDisplay(time);
      setEndTime(displayTime);
      console.log('종료 시간 설정됨:', displayTime);
    }
    setShowEndTimePicker(false);
  };

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.gray800}
          />
        </BackButton>
        <Title>{mode === 'edit' ? '그룹 루틴 수정' : '그룹 루틴 생성'}</Title>
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

        {/* 소개 입력 */}
        <InputSection>
          <InputLabel>소개</InputLabel>
          <DescriptionInput
            placeholder="해당 루틴에 대한 소개를 해주세요."
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={theme.colors.gray400}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
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
      <ButtonWrapper>
        <CustomButton
          text={mode === 'edit' ? '그룹 루틴 수정' : '그룹 루틴 생성'}
          onPress={handleSubmitRoutine}
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

export default CreateGroupRoutineScreen;

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

const DescriptionInput = styled(TextInput)`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray800};
  padding: 16px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: 12px;
  min-height: 80px;
  background-color: ${theme.colors.white};
  line-height: 24px;
`;

const Underline = styled.View`
  height: 1px;
  background-color: ${theme.colors.gray300};
  width: 100%;
`;

const ButtonWrapper = styled.View`
  padding: 24px 16px;
  background-color: ${theme.colors.white};
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
