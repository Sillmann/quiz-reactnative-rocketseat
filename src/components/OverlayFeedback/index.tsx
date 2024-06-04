import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Canvas, Rect, BlurMask } from '@shopify/react-native-skia';
import { THEME } from '../../styles/theme';
// canvas é oq usamos para de fato desenhar na tela, é nossa área de desenho

const STATUS = ['transparent', THEME.COLORS.BRAND_LIGHT, THEME.COLORS.DANGER_LIGHT]

type Props = {
  status: number
}

export function OverlayFeedback({ status }: Props) {
  const opacity = useSharedValue(0);

  const color = STATUS[status]

  const { width, height } = useWindowDimensions();

  const styledAnimated = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    }
  })

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 400, easing: Easing.bounce }),
      withTiming(0)
    )
  }, [status])

  return (
    <Animated.View style={[{ width, height, position: 'absolute' }, styledAnimated]}>
      <Canvas style={{ flex: 1 }}>
        {/* Criando um retângulo */}
        <Rect
          // definimos qual a posição do nosso elemento dentro do canvas
          x={0}
          y={0}
          width={width}
          height={height}
          color={color}
        >
          {/* To aplicando aq um blue, dentro do meu retângulo */}
          <BlurMask blur={50} style='inner' />
        </Rect>
      </Canvas>
    </Animated.View>
  );
}