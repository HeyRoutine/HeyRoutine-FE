import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import CustomInput from '../../components/common/CustomInput';
import { useAuthStore } from '../../store';
import { useGetMajors } from '../../hooks/user/useUser';
import { MajorSearchInfo } from '../../types/api';

const DepartmentScreen = ({ navigation, route }: any) => {
  const [department, setDepartment] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { nickname } = route.params || {};

  // Zustand 스토어에서 학과 설정 함수 가져오기
  const { setSignupDepartment, setSignupMajorId } = useAuthStore();

  // 학과 검색 API 호출
  const { data: searchResults, isLoading: isSearching } =
    useGetMajors(searchKeyword);

  // 검색어 변경 시 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(department);
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timer);
  }, [department]);

  const handleDepartmentSelect = (selectedDepartment: MajorSearchInfo) => {
    setDepartment(selectedDepartment.name);
    setSignupMajorId(selectedDepartment.id);
    setShowSearchResults(false);
  };

  const handleNext = () => {
    // 학과 정보를 스토어에 저장
    setSignupDepartment(department);

    // route.params로 모든 데이터 전달
    const { email, password, nickname, university } = route.params || {};
    navigation.navigate('ProfileImage', {
      email,
      password,
      nickname,
      university,
      department,
    });
  };

  const { signupData } = useAuthStore();
  const isButtonEnabled = signupData.majorId !== null;

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={<ProgressText>5/6</ProgressText>}
      />

      <Content>
        <Title>
          현재 다니시는 <HighlightText>학과</HighlightText>를{'\n'}
          입력해주세요.
        </Title>
        <SubTitle>학과 랭킹에 도움을 줄 수 있어요!</SubTitle>

        <InputContainer isSelected={signupData.majorId !== null}>
          <CustomInput
            value={department}
            placeholder="학과 명을 입력해주세요."
            onChangeText={(text) => {
              setDepartment(text);
              setSignupMajorId(null); // 텍스트 변경 시 ID 초기화
              setShowSearchResults(true);
            }}
            showCharCounter={false}
            isSelected={signupData.majorId !== null}
          />
          <SearchIcon>
            <MaterialIcons
              name="search"
              size={20}
              color={theme.colors.gray400}
            />
          </SearchIcon>
        </InputContainer>

        {/* 검색 결과 리스트 */}
        {showSearchResults && department.length > 0 && (
          <SearchResultsContainer>
            {isSearching ? (
              <LoadingText>검색 중...</LoadingText>
            ) : searchResults?.result && searchResults.result.length > 0 ? (
              <FlatList
                data={searchResults.result}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <SearchResultItem
                    onPress={() => handleDepartmentSelect(item)}
                  >
                    <SearchResultText>{item.name}</SearchResultText>
                  </SearchResultItem>
                )}
                style={{ maxHeight: 200 }}
              />
            ) : (
              <NoResultText>검색 결과가 없습니다.</NoResultText>
            )}
          </SearchResultsContainer>
        )}
      </Content>

      <ButtonWrapper>
        <CustomButton
          text="다음"
          onPress={handleNext}
          backgroundColor={
            isButtonEnabled ? theme.colors.primary : theme.colors.gray200
          }
          textColor={
            isButtonEnabled ? theme.colors.white : theme.colors.gray500
          }
          disabled={!isButtonEnabled}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default DepartmentScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ProgressText = styled.Text`
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const SubTitle = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-top: 8px;
  margin-bottom: 24px;
`;

const InputContainer = styled.View<{ isSelected: boolean }>`
  position: relative;
  padding-bottom: 8px;
`;

const SearchIcon = styled.View`
  position: absolute;
  right: 0;
  top: 8px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
  margin-top: auto;
`;

const SearchResultsContainer = styled.View`
  margin-top: 8px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray200};
  border-radius: 8px;
  max-height: 200px;
`;

const SearchResultItem = styled.TouchableOpacity`
  padding: 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray100};
`;

const SearchResultText = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray900};
`;

const LoadingText = styled.Text`
  padding: 12px 16px;
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  text-align: center;
`;

const NoResultText = styled.Text`
  padding: 12px 16px;
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  text-align: center;
`;
