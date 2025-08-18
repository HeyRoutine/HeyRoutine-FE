import React from 'react';
import styled from 'styled-components/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ScrollView, Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../components/common/Header';
import BubbleCard from '../../components/domain/analysis/BubbleCard';
import { theme } from '../../styles/theme';

const robotIcon = require('../../assets/images/robot.png');
// const characterImg = require('../../assets/images/cute_image.png');
const characterImg = require('../../assets/images/character_mori.png');
// 추천 루틴 아이콘 (임시 이미지, 실제 아이콘으로 교체해서 사용하세요)
// const routineTumblerIcon = require('../../assets/images/tumblr.png');
const routineTumblerIcon = require('../../assets/images/robot.png');
// const routineNoSpendIcon = require('../../assets/images/zero_spend.png');
const routineNoSpendIcon = require('../../assets/images/robot.png');

const RoutineSuggestionScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <Container edges={['top', 'bottom']}>
      <Header
        title="✨ New 추천 루틴"
        onBackPress={() => navigation.navigate('ConsumptionAnalysis')}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* AI 안내 버블 */}
        <BotMessageSection>
          <BubbleCard
            title=""
            content={
              <>
                사용자 님은 <Highlight>충동형 소비자</Highlight>예요!
                {'\n'}
                <Em>식비</Em> 카테고리의 변동이 잦고,{'\n'}
                <EmSecondary>쇼핑</EmSecondary> 카테고리 소비가 불규칙해요.
                {'\n\n'}
                이러한 소비습관을 고치기 위해서는{'\n'}
                아래와 같은 루틴이 도움이 될 수 있어요.
              </>
            }
            direction="top"
            robotImageSource={robotIcon}
          />
        </BotMessageSection>

        {/* 추천 루틴 섹션 */}
        <SectionCard>
          <SectionHeader>
            <Sparkle>✨</Sparkle>
            <SectionTitle>추천 루틴</SectionTitle>
          </SectionHeader>

          <RoutineItem>
            <IconSquare color="#FFE4B5">
              <RoutineIcon source={routineTumblerIcon} resizeMode="contain" />
            </IconSquare>
            <RoutineText>외출할 때 텀블러 챙기기</RoutineText>
          </RoutineItem>

          <RoutineItem>
            <IconSquare color="#D3F0E2">
              <RoutineIcon source={routineNoSpendIcon} resizeMode="contain" />
            </IconSquare>
            <RoutineText>주 1회 무지출 데이 실천하기</RoutineText>
          </RoutineItem>
        </SectionCard>

        {/* 본문 끝 */}
      </ScrollView>

      <CharacterDecoration>
        <CharacterImage source={characterImg} resizeMode="contain" />
      </CharacterDecoration>

      {/* 화면 오른쪽 하단 고정 CTA */}
      <CTAFloat>
        <CTAButton>
          <CTAContent>
            <CTAIcon name="add-circle-outline" size={18} />
            <CTAText>추천받은 루틴 추가하러 가기</CTAText>
          </CTAContent>
        </CTAButton>
        <CTAButton style={{ marginTop: 10 }}>
          <CTAContent>
            <CTAIcon name="settings-outline" size={18} />
            <CTAText>커스텀 루틴 설정하기</CTAText>
          </CTAContent>
        </CTAButton>
      </CTAFloat>
    </Container>
  );
};

export default RoutineSuggestionScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Highlight = styled.Text`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.SemiBold};
`;

const Em = styled(Highlight)`
  color: #f77f00;
`;

const EmSecondary = styled(Highlight)`
  color: #ff7a7a;
`;

const BotMessageSection = styled.View`
  align-items: center;
  justify-content: flex-start;
`;

const SectionCard = styled.View`
  margin: 4px 16px 0 16px;
  padding: 12px;
  background-color: ${theme.colors.gray50};
  border-radius: 16px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const Sparkle = styled.Text`
  margin-right: 6px;
  color: #ffc107;
`;

const SectionTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: #ffc107;
`;

const RoutineItem = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.white};
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const IconSquare = styled.View<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const RoutineIcon = styled(Image)`
  width: 32px;
  height: 32px;
`;

const RoutineText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
`;

const CTAFloat = styled.View`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 40px;
  align-items: flex-end;
`;

const CTAButton = styled.TouchableOpacity`
  width: 75%;
  padding: 14px;
  background-color: ${theme.colors.gray100};
  border-radius: 12px;
`;

const CTAContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

const CTAIcon = styled(Ionicons)`
  color: ${theme.colors.primary};
`;

const CTAText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray700};
`;

const CharacterDecoration = styled.View`
  position: absolute;
  left: -80px;
  bottom: 0px;
  width: 300px;
  height: 300px;
  opacity: 0.3;
`;

const CharacterImage = styled(Image)`
  width: 100%;
  height: 100%;
`;
