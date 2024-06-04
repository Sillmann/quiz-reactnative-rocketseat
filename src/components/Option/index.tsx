import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { styles } from './styles';
import { BlurMask, Canvas, Circle, Easing, Path, Skia, runTiming, useValue } from '@shopify/react-native-skia';
import { THEME } from '../../styles/theme';
import { useEffect } from 'react';

type Props = TouchableOpacityProps & {
  checked: boolean;
  title: string;
}

const CHECK_SIZE = 28;
const CHECK_STROKE = 2;

export function Option({ checked, title, ...rest }: Props) {
  // useValue = useSharedValue porém do skia
  const percentage = useValue(0);
  const circle = useValue(0);

  const RADIUS = (CHECK_SIZE - CHECK_STROKE) / 2;
  const CENTER_CIRCLE = RADIUS / 2;

  // Criando um novo caminho com Skia, caminho é literalmente uma caneta, como se a gente pegasse uma caneta pra desenhar e enfim
  // Então dentro desse path aq, eu consigo criar meus desenhos, meus elementos
  const path = Skia.Path.Make();
  path.addCircle(CHECK_SIZE, CHECK_SIZE, RADIUS);

  useEffect(() => {
    if (checked) {
      // aq também temos modificadores de transições como no reanimated, q temos o withTiming
      runTiming(percentage, 1, { duration: 700 })
      runTiming(circle, CENTER_CIRCLE, { easing: Easing.bounce })
    } else {
      runTiming(percentage, 0, { duration: 300 })
      runTiming(circle, 0, { duration: 300 })
    }
  }, [checked])

  return (
    <TouchableOpacity
      style={
        [
          styles.container,
          checked && styles.checked
        ]
      }
      {...rest}
    >
      <Text style={styles.title}>
        {title}
      </Text>

      <Canvas style={{ height: CHECK_SIZE * 2, width: CHECK_SIZE * 2 }}>
        {/* dessa forma fazemos com que apareça o nosso círculo q desenhamos com o path */}
        <Path
          path={path}
          color={THEME.COLORS.GREY_500}
          style='stroke'
          strokeWidth={CHECK_STROKE}
        // começa em 0, ou seja, n mostra nada do círculo, e termina em 1, ou seja, mostra o círculo todo
        // start={0}
        // end={1}
        />
        {/* também conseguimos fazer animações no skia, porém como no reanimated, no skia também temos um "useSharedValue" */}
        <Path
          path={path}
          color={THEME.COLORS.BRAND_LIGHT}
          style='stroke'
          strokeWidth={CHECK_STROKE}
          start={0}
          end={percentage}
        >
          <BlurMask blur={1} style='solid' />
        </Path>

        <Circle
          cx={CHECK_SIZE}
          cy={CHECK_SIZE}
          r={circle}
          color={THEME.COLORS.BRAND_LIGHT}
        >
          <BlurMask blur={4} style='solid' />
        </Circle>
      </Canvas>
    </TouchableOpacity>
  );
}