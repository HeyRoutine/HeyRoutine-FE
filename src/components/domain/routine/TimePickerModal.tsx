import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { theme } from '../../../styles/theme';
import BottomSheetDialog from '../../common/BottomSheetDialog';

interface TimePickerModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onTimeSelect: (time: string | number) => void;
  type: 'time' | 'minutes';
  initialTime?: string;
  initialMinutes?: number;
}

const TimePickerModal = ({
  visible,
  onRequestClose,
  onTimeSelect,
  type,
  initialTime = '09:00',
  initialMinutes = 40,
}: TimePickerModalProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'오전' | '오후'>('오전');
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(40);

  // 데이터 준비 - useMemo로 최적화
  const periodData = useMemo(
    () => [
      { value: '오전', label: '오전' },
      { value: '오후', label: '오후' },
    ],
    [],
  );

  const hourData = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: (i + 1).toString(),
      })),
    [],
  );

  const minuteData = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        value: i,
        label: i.toString().padStart(2, '0'),
      })),
    [],
  );

  // 1분부터 180분까지 데이터 준비 - 성능 최적화
  const minutesData = useMemo(() => {
    const data: Array<{ value: number; label: string }> = [];
    for (let i = 1; i <= 180; i++) {
      data.push({
        value: i,
        label: i.toString(),
      });
    }
    return data;
  }, []);

  // 초기값 설정
  useEffect(() => {
    if (type === 'time' && initialTime) {
      const [hours, minutes] = initialTime.split(':');
      const hour = parseInt(hours);
      const period = hour < 12 ? '오전' : '오후';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const minute = parseInt(minutes);

      setSelectedPeriod(period);
      setSelectedHour(displayHour);
      setSelectedMinute(minute);
    } else if (type === 'minutes' && initialMinutes) {
      if (initialMinutes >= 1 && initialMinutes <= 180) {
        setSelectedMinutes(initialMinutes);
      }
    }
  }, [initialTime, initialMinutes, type]);

  const handleComplete = () => {
    if (type === 'time') {
      const timeString = `${selectedPeriod} ${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
      onTimeSelect(timeString);
    } else {
      onTimeSelect(selectedMinutes);
    }
    onRequestClose();
  };

  return (
    <BottomSheetDialog
      visible={visible}
      onRequestClose={onRequestClose}
      dismissible={false}
    >
      <Title>{type === 'time' ? '시간 선택' : '분 선택'}</Title>

      <TimePickerContainer>
        <SelectionOverlay />

        {type === 'time' ? (
          <>
            <WheelContainer>
              <WheelPicker
                data={periodData}
                value={selectedPeriod}
                onValueChanged={({ item }) =>
                  setSelectedPeriod(item.value as '오전' | '오후')
                }
                itemHeight={60}
                visibleItemCount={5}
                itemTextStyle={itemTextStyle}
                overlayItemStyle={overlayItemStyle}
                enableScrollByTapOnItem={true}
              />
            </WheelContainer>

            <WheelContainer>
              <WheelPicker
                data={hourData}
                value={selectedHour}
                onValueChanged={({ item }) => setSelectedHour(item.value)}
                itemHeight={60}
                visibleItemCount={5}
                itemTextStyle={itemTextStyle}
                overlayItemStyle={overlayItemStyle}
                enableScrollByTapOnItem={true}
              />
            </WheelContainer>

            <WheelContainer>
              <WheelPicker
                data={minuteData}
                value={selectedMinute}
                onValueChanged={({ item }) => setSelectedMinute(item.value)}
                itemHeight={60}
                visibleItemCount={5}
                itemTextStyle={itemTextStyle}
                overlayItemStyle={overlayItemStyle}
                enableScrollByTapOnItem={true}
              />
            </WheelContainer>
          </>
        ) : (
          <>
            <WheelContainer>
              <WheelPicker
                data={minutesData}
                value={selectedMinutes}
                onValueChanged={({ item }) => setSelectedMinutes(item.value)}
                itemHeight={60}
                visibleItemCount={3}
                itemTextStyle={itemTextStyle}
                overlayItemStyle={overlayItemStyle}
                enableScrollByTapOnItem={true}
              />
            </WheelContainer>

            <MinutesText>분</MinutesText>
          </>
        )}
      </TimePickerContainer>

      <CompleteButton onPress={handleComplete}>
        <CompleteButtonText>선택 완료</CompleteButtonText>
      </CompleteButton>
    </BottomSheetDialog>
  );
};

export default React.memo(TimePickerModal);

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
  text-align: center;
  margin-bottom: 10px;
`;

const CompleteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
`;

const CompleteButtonText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const TimePickerContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 300px;
  margin-bottom: 10px;
  position: relative;
  gap: 0px;
`;

const WheelContainer = styled.View`
  align-items: center;
  width: 80px;
`;

const MinutesText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 24px;
  color: ${theme.colors.gray900};
  margin-left: 8px;
`;

const SelectionOverlay = styled.View`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #f2f6ff;
  border-radius: 8px;
  transform: translateY(-30px);
  z-index: -1;
`;

const itemTextStyle = {
  fontFamily: theme.fonts.Medium,
  fontSize: 24,
  color: theme.colors.gray900,
};

const overlayItemStyle = {
  backgroundColor: '#f2f6ff',
  borderRadius: 8,
};
