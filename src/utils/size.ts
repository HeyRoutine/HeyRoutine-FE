import {
  scale as _scale,
  verticalScale as _verticalScale,
  moderateScale as _moderateScale,
  moderateVerticalScale as _moderateVerticalScale,
} from 'react-native-size-matters';

// 네이밍을 짧게 줄인 공통 헬퍼들
export const s = (value: number) => _scale(value);
export const vs = (value: number) => _verticalScale(value);
export const ms = (value: number, factor = 0.5) => _moderateScale(value, factor);
export const mvs = (value: number, factor = 0.5) =>
  _moderateVerticalScale(value, factor);

// 원래 함수들도 그대로 export 해서 필요 시 직접 사용 가능
export {
  _scale as scale,
  _verticalScale as verticalScale,
  _moderateScale as moderateScale,
  _moderateVerticalScale as moderateVerticalScale,
};


