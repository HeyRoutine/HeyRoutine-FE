import React, { useState, useEffect } from 'react';
import { Image, ImageProps } from 'react-native';
import { SvgUri } from 'react-native-svg';

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

  useEffect(() => {
    if (uri.toLowerCase().endsWith('.svg')) {
      setIsLoading(true);
      // SVG URL에서 내용을 가져오기
      fetch(uri)
        .then((response) => response.text())
        .then((svgText) => {
          setSvgContent(svgText);
        })
        .catch((error) => {
          console.log('SVG 로드 실패:', uri, error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [uri]);

  // SVG 파일이고 내용이 로드된 경우
  if (uri.toLowerCase().endsWith('.svg') && svgContent && !isLoading) {
    return (
      <SvgUri
        width={width}
        height={height}
        uri={uri}
        onError={(error: Error) => {
          console.log('SVG 로드 실패:', uri, error);
        }}
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
      }}
      {...props}
    />
  );
};

export default SvgImage;
