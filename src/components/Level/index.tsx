import { Pressable, PressableProps, Text } from 'react-native';

import { THEME } from '../../styles/theme';
import { styles } from './styles';
import Animated,
{
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring, withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { useEffect } from 'react';

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

const TYPE_COLORS = {
  EASY: THEME.COLORS.BRAND_LIGHT,
  HARD: THEME.COLORS.DANGER_LIGHT,
  MEDIUM: THEME.COLORS.WARNING_LIGHT,
}

type Props = PressableProps & {
  title: string;
  isChecked?: boolean;
  type?: keyof typeof TYPE_COLORS;
}

export function Level({ title, type = 'EASY', isChecked = false, ...rest }: Props) {
  const COLOR = TYPE_COLORS[type];

  const scale = useSharedValue(1);
  const checked = useSharedValue(1);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      // interpolate vai fazer a transição das nossas cores de uma forma q n fique tão brusca
      // valor do nosso interpolate, por segundo quais valores possíveis, terceiro qual cor, para cada valor no segundo parâmetro 
      backgroundColor: interpolateColor(
        checked.value,
        [0, 1],
        ['transparent', COLOR]
      )
    }
  })

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        checked.value,
        [0, 1],
        [COLOR, THEME.COLORS.GREY_100]
      )
    }
  })

  function onPressIn() {
    // podemos alterar n osso valor usando uma transição (withTiming, withSpring...)
    // podemos além disso dizewr qual a duração, e até fazer mais modificação ainda na nossa transição com o Easing
    // scale.value = withTiming(1.1, { duration: 500, easing: Easing.bounce });
    scale.value = withTiming(1.1);
  }

  function onPressOut() {
    scale.value = withTiming(1);
  }

  useEffect(() => {
    // trocar nossas cores mais "suaves" com o withTiming
    checked.value = withTiming(isChecked ? 1 : 0);
  }, [isChecked])

  return (
    // pressable por padrão n vem como um componente animado, ou seja, ele n está na lista de Animated.
    // mas podemos criar um componente animado customizado pra gente
    <PressableAnimated
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={
        [
          styles.container,
          { borderColor: COLOR },
          animatedContainerStyle
        ]
      }
      {...rest}
    >
      <Animated.Text style={
        [
          styles.title,
          animatedTextStyle
        ]}>
        {title}
      </Animated.Text>
    </PressableAnimated>
  );
}