import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

interface IProps {
  children: ReactNode;
}

const GradientContainer = ({ children }: IProps) => {
  return (
    <LinearGradient colors={['#6D73EE', '#E585E3']} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
};

const Wrapper = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TopContent = styled.View`
  flex: 2;
  align-items: center;
  justify-content: flex-end;
`;

const MiddleContent = styled.View`
  flex: 3;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const BottomContent = styled.View`
  flex: 2;
  align-items: center;
  justify-content: center;
`;

const SubTitle = styled.Text`
  font-size: 20px; /* 👈 theme.fonts.subtitle 대신 직접 입력 */
  font-family: 'Pretendard-SemiBold'; /* 👈 theme.fonts.SemiBold 대신 직접 입력 */
  line-height: 28px;
  letter-spacing: 0.1px;
  word-wrap: break-word;
`;

const Title = styled.Text`
  font-size: 64px;
  font-family: 'Pretendard-Bold'; /* 👈 theme.fonts.Bold 대신 직접 입력 */
  color: '#FFFFFF'; /* 👈 theme.colors.white 대신 직접 입력 */
`;

const CharacterImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const LogoImage = styled.Image`
  width: 120px;
  height: 40px;
`;

const SplashScreen = () => {
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
          <LogoImage
            source={require('../../assets/images/logo_heyoung.png')}
            resizeMode="contain"
          />
        </BottomContent>
      </Wrapper>
    </GradientContainer>
  );
};

export default SplashScreen;
