import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import { theme } from '../../styles/theme';
import TermItem from '../../components/domain/auth/TermItem';

const TermsAgreementScreen = ({ navigation, route }: any) => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  // '완료' 버튼 활성화 조건 (필수 약관 모두 동의)
  const isButtonEnabled = agreeTerms && agreePrivacy;

  const agreeAll = agreeTerms && agreePrivacy && agreeMarketing;

  const handleNext = () => {
    navigation.navigate('Welcome', { ...route.params });
  };

  const handleAgreeAll = () => {
    const nextState = !agreeAll;
    setAgreeTerms(nextState);
    setAgreePrivacy(nextState);
    setAgreeMarketing(nextState);
  };

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={<ProgressText>5/5</ProgressText>}
      />

      <Content>
        <TopWrapper>
          <Title>
            <HighlightText>헤이루틴</HighlightText> 서비스 이용 약관에{'\n'}
            동의해주세요
          </Title>
          <SubTitle>
            사용자의 개인정보 및 서비스 이용 권리{'\n'}잘 지켜드릴게요
          </SubTitle>
        </TopWrapper>

        <BottomWrapper>
          <TermsContainer>
            <TermItem
              isChecked={agreeTerms}
              onPress={() => setAgreeTerms(!agreeTerms)}
              text="서비스 이용약관 동의"
            />
            <TermItem
              isChecked={agreePrivacy}
              onPress={() => setAgreePrivacy(!agreePrivacy)}
              text="개인정보 처리방침 동의"
            />
            <TermItem
              isChecked={agreeMarketing}
              onPress={() => setAgreeMarketing(!agreeMarketing)}
              isOptional={true}
              text="마케팅 수신동의"
            />
          </TermsContainer>

          <Divider />

          <AllTermsRow onPress={handleAgreeAll}>
            <CheckButton>
              <MaterialIcons
                name="check-circle"
                size={24}
                color={agreeAll ? theme.colors.primary : theme.colors.gray300}
              />
            </CheckButton>
            <AllTermTextContainer>
              <AllTermTitle>전체 약관동의</AllTermTitle>
              <AllTermSubText>
                서비스 이용을 위해 약관들을 모두 동의합니다.
              </AllTermSubText>
            </AllTermTextContainer>
          </AllTermsRow>
        </BottomWrapper>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text="완료"
          onPress={handleNext}
          disabled={!isButtonEnabled}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default TermsAgreementScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ProgressText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const TopWrapper = styled.View`
  flex: 1;
  justify-content: center;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 24px;
  color: ${theme.colors.gray900};
  text-align: center;
  line-height: 34px;
  margin-bottom: 16px;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const SubTitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 24px;
`;

const BottomWrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const TermsContainer = styled.View`
  margin-bottom: 24px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.gray200};
  margin: 24px 0;
`;

const AllTermsRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
`;

const CheckButton = styled.View`
  margin-right: 12px;
`;

const AllTermTextContainer = styled.View`
  flex: 1;
`;

const AllTermTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray900};
  margin-bottom: 4px;
`;

const AllTermSubText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
