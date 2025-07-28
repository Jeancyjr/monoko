import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const getDeviceType = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return 'tablet';
  } else if (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
    return 'tablet';
  } else if (SCREEN_WIDTH >= 768) {
    return 'tablet';
  } else if (SCREEN_WIDTH >= 414) {
    return 'large-phone';
  } else if (SCREEN_WIDTH >= 375) {
    return 'medium-phone';
  } else {
    return 'small-phone';
  }
};

export const breakpoints = {
  smallPhone: 320,
  mediumPhone: 375,
  largePhone: 414,
  tablet: 768,
  desktop: 1024,
};

export const responsive = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallPhone: SCREEN_WIDTH < breakpoints.mediumPhone,
  isMediumPhone: SCREEN_WIDTH >= breakpoints.mediumPhone && SCREEN_WIDTH < breakpoints.largePhone,
  isLargePhone: SCREEN_WIDTH >= breakpoints.largePhone && SCREEN_WIDTH < breakpoints.tablet,
  isTablet: SCREEN_WIDTH >= breakpoints.tablet,
  isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT,
  isPortrait: SCREEN_HEIGHT > SCREEN_WIDTH,
  deviceType: getDeviceType(),
};

export const getFontSize = (size) => {
  const scale = SCREEN_WIDTH / 375; // Base on iPhone X width
  const newSize = size * scale;
  
  if (newSize < 12) return 12;
  if (newSize > 30) return 30;
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const getSpacing = (size) => {
  const scale = SCREEN_WIDTH / 375;
  return Math.round(size * scale);
};

export const getResponsiveWidth = (percentage) => {
  return (SCREEN_WIDTH * percentage) / 100;
};

export const getResponsiveHeight = (percentage) => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

export const getValueForDevice = (values) => {
  const deviceType = getDeviceType();
  
  if (values[deviceType]) {
    return values[deviceType];
  }
  
  if (responsive.isTablet && values.tablet) return values.tablet;
  if (responsive.isLargePhone && values.largePhone) return values.largePhone;
  if (responsive.isMediumPhone && values.mediumPhone) return values.mediumPhone;
  if (responsive.isSmallPhone && values.smallPhone) return values.smallPhone;
  
  return values.default || values.mediumPhone || Object.values(values)[0];
};

export const getGridColumns = () => {
  if (responsive.isTablet) return 3;
  if (responsive.isLargePhone) return 2;
  return 2;
};

export const getCardDimensions = () => {
  const columns = getGridColumns();
  const totalSpacing = getSpacing(16) * (columns + 1);
  const cardWidth = (SCREEN_WIDTH - totalSpacing) / columns;
  
  return {
    width: cardWidth,
    height: cardWidth * 0.8, // Maintain aspect ratio
  };
};

export const getModalDimensions = () => {
  return {
    width: responsive.isTablet ? getResponsiveWidth(60) : getResponsiveWidth(90),
    maxHeight: getResponsiveHeight(80),
  };
};

export const getIconSize = (baseSize = 24) => {
  return getValueForDevice({
    'small-phone': baseSize * 0.8,
    'medium-phone': baseSize,
    'large-phone': baseSize * 1.1,
    'tablet': baseSize * 1.3,
  });
};

export const getCharacterSize = (baseSize = 64) => {
  return getValueForDevice({
    'small-phone': baseSize * 0.7,
    'medium-phone': baseSize * 0.8,
    'large-phone': baseSize,
    'tablet': baseSize * 1.2,
  });
};
