import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface StreakCelebrationProps {
  show: boolean;
}

export const StreakCelebration: React.FC<StreakCelebrationProps> = ({ show }) => {
  const animations = useRef(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    if (show) {
      animations.forEach((anim, index) => {
        const delay = index * 50;
        const duration = 2000 + Math.random() * 1000;
        
        Animated.parallel([
          Animated.timing(anim.translateY, {
            toValue: height,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateX, {
            toValue: (Math.random() - 0.5) * width * 0.5,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim.rotate, {
            toValue: Math.random() * 10 - 5,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: duration * 0.8,
            delay: delay + duration * 0.2,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [show]);

  if (!show) return null;

  const emojis = ['🎉', '⭐', '🔥', '💫', '✨'];

  return (
    <View style={styles.container} pointerEvents="none">
      {animations.map((anim, index) => {
        const emoji = emojis[index % emojis.length];
        const startX = Math.random() * width;
        
        return (
          <Animated.Text
            key={index}
            style={[
              styles.emoji,
              {
                left: startX,
                transform: [
                  { translateY: anim.translateY },
                  { translateX: anim.translateX },
                  { rotate: anim.rotate.interpolate({
                    inputRange: [0, 10],
                    outputRange: ['0deg', '360deg'],
                  })},
                ],
                opacity: anim.opacity,
              },
            ]}
          >
            {emoji}
          </Animated.Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  emoji: {
    position: 'absolute',
    top: 0,
    fontSize: 24,
  },
});
