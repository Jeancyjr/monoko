import React from 'react';
import { Animated, Easing, View } from 'react-native';

export const createSpringAnimation = (value, toValue, config = {}) => {
  return Animated.spring(value, {
    toValue,
    tension: 100,
    friction: 8,
    useNativeDriver: true,
    ...config,
  });
};

export const createTimingAnimation = (value, toValue, duration = 300, easing = Easing.bezier(0.25, 0.46, 0.45, 0.94)) => {
  return Animated.timing(value, {
    toValue,
    duration,
    easing,
    useNativeDriver: true,
  });
};

export const FadeInView = ({ children, delay = 0, duration = 600, style }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      createTimingAnimation(fadeAnim, 1, duration)
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};

export const SlideInView = ({ children, delay = 0, duration = 600, direction = 'up', distance = 50, style }) => {
  const slideAnim = React.useRef(new Animated.Value(distance)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        createSpringAnimation(slideAnim, 0, { tension: 80, friction: 10 }),
        createTimingAnimation(fadeAnim, 1, duration)
      ])
    ]).start();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return [{ translateY: slideAnim }];
      case 'down':
        return [{ translateY: slideAnim.interpolate({ inputRange: [0, distance], outputRange: [0, -distance] }) }];
      case 'left':
        return [{ translateX: slideAnim.interpolate({ inputRange: [0, distance], outputRange: [0, -distance] }) }];
      case 'right':
        return [{ translateX: slideAnim }];
      default:
        return [{ translateY: slideAnim }];
    }
  };

  return (
    <Animated.View style={[style, { opacity: fadeAnim, transform: getTransform() }]}>
      {children}
    </Animated.View>
  );
};

export const ScaleInView = ({ children, delay = 0, duration = 400, style }) => {
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        createSpringAnimation(scaleAnim, 1, { tension: 120, friction: 8 }),
        createTimingAnimation(fadeAnim, 1, duration)
      ])
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      {children}
    </Animated.View>
  );
};

export const StaggeredList = ({ children, staggerDelay = 100, style }) => {
  return (
    <View style={style}>
      {React.Children.map(children, (child, index) => (
        <FadeInView key={index} delay={index * staggerDelay}>
          {child}
        </FadeInView>
      ))}
    </View>
  );
};

export const PulseView = ({ children, style, pulseScale = 1.05, duration = 1000 }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        createSpringAnimation(pulseAnim, pulseScale, { tension: 100, friction: 8 }),
        createSpringAnimation(pulseAnim, 1, { tension: 100, friction: 8 }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale: pulseAnim }] }]}>
      {children}
    </Animated.View>
  );
};

export const ShakeView = ({ children, style, trigger }) => {
  const shakeAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [trigger]);

  return (
    <Animated.View style={[style, { transform: [{ translateX: shakeAnim }] }]}>
      {children}
    </Animated.View>
  );
};
