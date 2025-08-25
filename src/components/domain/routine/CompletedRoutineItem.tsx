import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import { Swipeable } from 'react-native-gesture-handler';
import RoutineItemAdder from './RoutineItemAdder';

interface CompletedRoutineItemProps {
  item: {
    emoji: string;
    text: string;
    time: string;
    isCompleted: boolean;
  };
  index: number;
  onEdit: (index: number, emoji: string, text: string, time: string) => void;
  onDelete: (index: number) => void;
  isEditMode?: boolean; // 수정 모드 prop 추가
  showDeleteButton?: boolean; // 삭제 버튼 표시 여부 추가
  onClockPress?: () => void; // 시간 클릭 핸들러 추가
}

const CompletedRoutineItem = ({
  item,
  index,
  onEdit,
  onDelete,
  isEditMode = false, // 기본값 false
  showDeleteButton = false, // 기본값 false
  onClockPress, // 시간 클릭 핸들러 추가
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  // 편집 모드에서 완료된 루틴을 체크 해제하는 함수
  const handleUncomplete = () => {
    if (isEditMode) {
      // 체크 해제: isCompleted를 false로 변경
      onEdit(index, item.emoji, item.text, item.time);
    }
  };

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={undefined} // 스와이프 비활성화 (완료된 루틴은 삭제 불가)
        rightThreshold={40}
        enabled={false} // 스와이프 완전 비활성화
      >
        <RoutineItemAdder
          onPlusPress={isEditMode ? handleUncomplete : () => {}} // 편집 모드에서만 체크 해제 가능
          onClockPress={
            isEditMode
              ? onClockPress ||
                (() => {
                  // 시간 선택 모달 열기
                  onEdit(index, item.emoji, item.text, item.time);
                })
              : () => {}
          } // 편집 모드에서만 시간 선택 가능
          onTextChange={() => {}} // 완료된 루틴은 텍스트 수정 불가
          onTextPress={() => {}} // 완료된 루틴은 텍스트 수정 불가
          selectedTime={item.time}
          selectedEmoji={item.emoji}
          currentText={item.text}
          completed={item.isCompleted}
          editable={false} // 완료된 루틴은 편집 불가
          onDelete={onDelete}
          showDeleteButton={showDeleteButton}
        />
      </Swipeable>
    </>
  );
};

export default CompletedRoutineItem;
