import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import SocialLoginButton from '../../components/domain/auth/SocialLoginButton';
import { theme } from '../../styles/theme';

const GradientContainer = styled(LinearGradient).attrs({
  colors: [theme.colors.landing.start, theme.colors.landing.end],
})`
  flex: 1;
`;

const Wrapper = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
`;

const TopContent = styled.View`
  flex: 3;
  align-items: center;
  justify-content: center;
`;

const MiddleContent = styled.View`
  flex: 4;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const BottomContent = styled.View`
  flex: 3;
  width: 90%;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
`;

const SubTitle = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.SemiBold};
  color: #ffffff;
  margin-bottom: 4px;
`;

const Title = styled.Text`
  font-size: 40px;
  font-family: ${theme.fonts.SchoolsafeBold};
  color: #ffffff;
`;

const CharacterImage = styled.Image`
  width: 280px;
  height: 280px;
`;

const EmailLoginButton = styled.TouchableOpacity`
  margin-top: 12px;
`;

const EmailLoginText = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: #ffffff;
  text-decoration-line: underline;
`;

// --- 로그인 화면 컴포넌트 ---
const LoginScreen = ({ navigation }: { navigation: any }) => {
  return (
    <GradientContainer>
      <Wrapper>
        <TopContent>
          <SubTitle>나만의 루틴 어플</SubTitle>
          <Title>헤이루틴</Title>
        </TopContent>

        <MiddleContent>
          <CharacterImage
            source={require('../../assets/images/character_mori.png')}
            resizeMode="contain"
          />
        </MiddleContent>

        <BottomContent>
          <SocialLoginButton
            type="kakao"
            onPress={() => console.log('카카오 로그인')}
          />
          <SocialLoginButton
            type="naver"
            onPress={() => console.log('네이버 로그인')}
          />

          <EmailLoginButton onPress={() => navigation.navigate('EmailLogin')}>
            <EmailLoginText>이메일로 로그인</EmailLoginText>
          </EmailLoginButton>
        </BottomContent>
      </Wrapper>
    </GradientContainer>
  );
};

export default LoginScreen;
