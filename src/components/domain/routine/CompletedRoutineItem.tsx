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
  onPlusPress?: () => void; // 이모지 클릭 핸들러 추가
  onTextChange?: (text: string) => void; // 텍스트 변경 핸들러 추가
}

const CompletedRoutineItem = ({
  item,
  index,
  onEdit,
  onDelete,
  isEditMode = false, // 기본값 false
  showDeleteButton = false, // 기본값 false
  onClockPress, // 시간 클릭 핸들러 추가
  onPlusPress, // 이모지 클릭 핸들러 추가
  onTextChange, // 텍스트 변경 핸들러 추가
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
          onPlusPress={
            isEditMode
              ? onPlusPress ||
                (() => {
                  // 이모지 선택 모달 열기
                  onEdit(index, item.emoji, item.text, item.time);
                })
              : () => {}
          } // 편집 모드에서만 이모지 선택 모달 열기
          onClockPress={
            isEditMode
              ? onClockPress ||
                (() => {
                  // 시간 선택 모달 열기
                  onEdit(index, item.emoji, item.text, item.time);
                })
              : () => {}
          } // 편집 모드에서만 시간 선택 모달 열기
          onTextChange={
            isEditMode
              ? onTextChange ||
                ((text) => {
                  // 편집 모드에서는 텍스트 변경 가능
                  onEdit(index, item.emoji, text, item.time);
                })
              : () => {}
          } // 편집 모드에서만 텍스트 수정 가능
          onTextPress={
            isEditMode
              ? () => {
                  // 편집 모드에서는 텍스트 입력 활성화 (별도 동작 없음)
                }
              : () => {}
          } // 편집 모드에서만 텍스트 입력 활성화, 일반 모드에서는 아무 동작 없음
          selectedTime={item.time}
          selectedEmoji={item.emoji}
          currentText={item.text}
          completed={!isEditMode && item.isCompleted} // 편집 모드에서는 완료 상태 표시하지 않음
          editable={isEditMode} // 편집 모드에서만 편집 가능
          onDelete={onDelete}
          showDeleteButton={showDeleteButton}
        />
      </Swipeable>
    </>
  );
};

export default CompletedRoutineItem;
