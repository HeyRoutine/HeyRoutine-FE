import React, { useState, useEffect } from 'react';
import { Image, ImageProps } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface SvgImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  width?: number;
  height?: number;
  fallbackSource?: any;
}

const SvgImage: React.FC<SvgImageProps> = ({
  uri,
  width = 20,
  height = 20,
  fallbackSource,
  style,
  ...props
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // URI 유효성 검사
  const isValidUri =
    uri && uri.trim() !== '' && uri !== 'undefined' && uri !== 'null';

  useEffect(() => {
    if (!isValidUri) {
      setHasError(true);
      return;
    }

    if (uri.toLowerCase().endsWith('.svg')) {
      setIsLoading(true);
      setHasError(false);

      // SVG URL에서 내용을 가져오기
      fetch(uri)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.text();
        })
        .then((svgText) => {
          setSvgContent(svgText);
        })
        .catch((error) => {
          console.log('SVG 로드 실패:', uri, error);
          setHasError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [uri, isValidUri]);

  // 유효하지 않은 URI이거나 에러가 발생한 경우 기본 아이콘 표시
  if (!isValidUri || hasError) {
    return (
      <Ionicons
        name="image-outline"
        size={width}
        color={theme.colors.gray400}
      />
    );
  }

  // SVG 파일이고 내용이 로드된 경우
  if (uri.toLowerCase().endsWith('.svg') && svgContent && !isLoading) {
    return (
      <SvgUri
        width={width}
        height={height}
        uri={uri}
        onError={(error: Error) => {
          console.log('SVG 로드 실패:', uri, error);
          setHasError(true);
        }}
      />
    );
  }

  // SVG 로딩 중인 경우 로딩 표시
  if (uri.toLowerCase().endsWith('.svg') && isLoading) {
    return (
      <Ionicons
        name="ellipsis-horizontal"
        size={width}
        color={theme.colors.gray400}
      />
    );
  }

  // 일반 이미지 파일인 경우 Image 사용
  return (
    <Image
      source={{ uri }}
      style={[{ width, height }, style]}
      resizeMode="contain"
      onError={() => {
        console.log('이미지 로드 실패:', uri);
        setHasError(true);
      }}
      {...props}
    />
  );
};

export default SvgImage;
