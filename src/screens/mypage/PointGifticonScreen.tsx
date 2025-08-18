import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';
import { useUserStore } from '../../store';

interface IPointGifticonScreenProps {
  navigation: any;
}

type CategoryKey =
  | 'all'
  | 'cafe'
  | 'convenience'
  | 'fastfood'
  | 'dining'
  | 'bakery';

type CategoryMeta = {
  key: CategoryKey;
  label: string;
  icon: ImageSourcePropType;
};

const MOCK_PRODUCTS = [
  {
    id: '1',
    title: '아이스 카페 아메리카노 Tall',
    brand: '스타벅스',
    price: 6100,
    category: 'cafe' as CategoryKey,
  },
  {
    id: '2',
    title: '아이스 카페 라떼 Tall',
    brand: '스타벅스',
    price: 6600,
    category: 'cafe' as CategoryKey,
  },
  {
    id: '3',
    title: '불고기버거 세트',
    brand: '맥도날드',
    price: 7900,
    category: 'fastfood' as CategoryKey,
  },
  {
    id: '4',
    title: '교촌콤보',
    brand: '교촌치킨',
    price: 19000,
    category: 'dining' as CategoryKey,
  },
  {
    id: '5',
    title: '소금빵',
    brand: '파리바게뜨',
    price: 3500,
    category: 'bakery' as CategoryKey,
  },
  {
    id: '6',
    title: '삼각김밥',
    brand: 'GS25',
    price: 1200,
    category: 'convenience' as CategoryKey,
  },
];

// 현재는 예시 이미지로 party_popper.png를 넣어두었습니다. 실제 아이콘 이미지를 교체하여 사용하세요.
const iconAll = require('../../assets/images/total_food.png');
const iconCafe = require('../../assets/images/cafe.png');
const iconConvenience = require('../../assets/images/convenience_store.png');
const iconFastfood = require('../../assets/images/fast_food.png');
const iconDining = require('../../assets/images/restaurant.png');
const iconBakery = require('../../assets/images/bakery.png');

const CATEGORIES: CategoryMeta[] = [
  { key: 'all', label: '전체', icon: iconAll },
  { key: 'cafe', label: '카페', icon: iconCafe },
  { key: 'convenience', label: '편의점', icon: iconConvenience },
  { key: 'fastfood', label: '패스트푸드', icon: iconFastfood },
  { key: 'dining', label: '외식', icon: iconDining },
  { key: 'bakery', label: '베이커리', icon: iconBakery },
];

const PointGifticonScreen = ({ navigation }: IPointGifticonScreenProps) => {
  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoryKey>('all');

  const points = useUserStore((s) => s.userInfo?.points ?? 0);

  const filteredProducts = React.useMemo(() => {
    if (selectedCategory === 'all') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handlePressProduct = (product: any) => {
    navigation.navigate('GifticonProduct', { product, userPoints: points });
  };

  const handleGoCashout = () => {
    navigation.navigate('PointCashout');
  };

  const renderProduct = ({ item }: { item: any }) => (
    <ProductItem onPress={() => handlePressProduct(item)}>
      <Thumb />
      <ProductInfo>
        <ProductTitle numberOfLines={1}>{item.title}</ProductTitle>
        <BrandText>{item.brand}</BrandText>
      </ProductInfo>
      <PriceText>{item.price.toLocaleString()}P</PriceText>
    </ProductItem>
  );

  return (
    <Container>
      <Header title="포인트 상점" onBackPress={() => navigation.goBack()} />

      <Content>
        <PointCard>
          <PointHeaderRow>
            <PointHeaderText>포인트</PointHeaderText>
            <PointValue>{points.toLocaleString()}P</PointValue>
          </PointHeaderRow>
          <CashoutTouchable onPress={handleGoCashout}>
            <CashoutText>현금으로 전환하기</CashoutText>
          </CashoutTouchable>
        </PointCard>

        <CategoryScroll horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 12 }}>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.key}
              active={selectedCategory === cat.key}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <CategoryImg source={cat.icon} />
              <CategoryLabel active={selectedCategory === cat.key}>
                {cat.label}
              </CategoryLabel>
            </CategoryChip>
          ))}
        </CategoryScroll>

        <Divider />
      </Content>
      {/* 리스트 스크롤 하면서 탭 세로길이는 동일하게 유지하기 위해 ListContainer 따로 생성 */}
      <ListContainer>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </ListContainer>
    </Container>
  );
};

export default PointGifticonScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  padding: 0 16px 8px 16px;
`;

const PointCard = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 16px;
  padding: 16px;
  margin: 8px 0 12px 0;
`;

const PointHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PointHeaderText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray700};
  font-size: ${theme.fonts.subtitle}px;
`;

const PointValue = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 20px;
  color: ${theme.colors.primary};
`;

const CashoutTouchable = styled(TouchableOpacity)`
  margin-top: 8px;
  align-self: flex-start;
`;

const CashoutText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.primary};
`;

const CategoryScroll = styled.ScrollView`
  padding: 8px 0;
`;

const CategoryChip = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: 18px;
  margin-right: 12px;
  background-color: transparent;
`;

const CategoryImg = styled(Image)`
  width: 44px;
  height: 44px;
  margin-bottom: 8px;
  border-radius: 8px;
`;

const CategoryLabel = styled.Text<{ active: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: ${theme.fonts.caption}px;
  color: ${(p) => (p.active ? theme.colors.primary : theme.colors.gray700)};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.gray200};
  margin: 8px 0 4px 0;
`;

const ProductItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray200};
`;

const Thumb = styled.View`
  width: 48px;
  height: 48px;
  background-color: ${theme.colors.gray100};
  border-radius: 8px;
  margin-right: 12px;
`;

const ProductInfo = styled.View`
  flex: 1;
`;

const ProductTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  margin-bottom: 4px;
`;

const BrandText = styled.Text`
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray500};
`;

const PriceText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const ListContainer = styled.View`
  flex: 1;
  padding: 0 16px 16px 16px;
`;
