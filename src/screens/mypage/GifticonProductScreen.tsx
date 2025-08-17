import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';

interface IGifticonProductScreenProps {
	navigation: any;
	route: any;
}

const GifticonProductScreen = ({ navigation, route }: IGifticonProductScreenProps) => {
	const { product } = route.params || {};

	return (
		<Container>
			<Header title={product?.title ?? '상품 상세'} onBackPress={() => navigation.goBack()} />

			<Content>
				<ImagePlaceholder>
					<PlaceholderText>이미지</PlaceholderText>
				</ImagePlaceholder>
				<ProductTitle>{product?.title}</ProductTitle>
				<BrandText>{product?.brand}</BrandText>
				<PriceText>{product?.price.toLocaleString()}P</PriceText>
			</Content>
		</Container>
	);
};

export default GifticonProductScreen;

const Container = styled(SafeAreaView)`
	flex: 1;
	background-color: ${theme.colors.white};
`;

const Content = styled.View`
	flex: 1;
	padding: 24px;
`;

const ImagePlaceholder = styled.View`
	height: 220px;
	background-color: ${theme.colors.gray100};
	border-radius: 12px;
	align-items: center;
	justify-content: center;
	margin-bottom: 20px;
`;

const PlaceholderText = styled.Text`
	font-family: ${theme.fonts.Medium};
	color: ${theme.colors.gray500};
`;

const ProductTitle = styled.Text`
	font-size: 20px;
	font-family: ${theme.fonts.SemiBold};
	color: ${theme.colors.gray900};
	margin-bottom: 6px;
`;

const BrandText = styled.Text`
	font-size: 14px;
	font-family: ${theme.fonts.Regular};
	color: ${theme.colors.gray500};
	margin-bottom: 20px;
`;

const PriceText = styled.Text`
	font-size: 22px;
	font-family: ${theme.fonts.Bold};
	color: ${theme.colors.primary};
`;
