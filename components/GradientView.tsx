import { Canvas, RadialGradient, Rect, vec } from '@shopify/react-native-skia';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const GradientBackground = ({ children }: { children: any }) => {
  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(width * 0.5, height * 0.3)} // Center point (adjust as needed)
            r={height * 0.8} // Radius
            colors={[
              '#4F46E5', // Indigo/Blue at center
              '#7C3AED', // Purple
              '#EC4899', // Pink
              '#F97316', // Orange (subtle)
            ]}
            positions={[0, 0.4, 0.8, 1]}
          />
        </Rect>
      </Canvas>

      {/* Children content on top of gradient */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  content: {
    flex: 1,
  },
});

export default GradientBackground;
