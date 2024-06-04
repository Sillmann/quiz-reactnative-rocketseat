import { TouchableOpacity, TouchableOpacityProps, Text, View } from 'react-native';

import { styles } from './styles';
import { THEME } from '../../styles/theme';

import { LevelBars } from '../LevelBars';
import { QUIZZES } from '../../data/quizzes';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';

const TouchableOpacityAnimated = Animated.createAnimatedComponent(TouchableOpacity);

type Props = TouchableOpacityProps & {
  data: typeof QUIZZES[0];
  index: number;
}

export function QuizCard({ data, index, ...rest }: Props) {
  const Icon = data.svg;

  return (
    <TouchableOpacityAnimated
      entering={FadeInUp.delay(index * 100)}
      // Animações de saídas aq n ficam tão claras, pq esse componente é chamado em uma flatList, ai por todo o lance de performance, e de
      // quando a gente clica em um novo filtro, a flatList desmonta todo mundo e monta uma  nova flatList só com os itens disponíveis, n dá 
      //  pra gente ver tão claramente essa animação de saída, é maiss pelo comportamento de performance da flatList msm. Ela remonta  listagem
      // desses itens q a gente consegue ver na tela, por isso a gente n consegue ver mt bem.
      // se vc precisar msm dessa animação de saída usa uma scrollView q dá pra controlar melhor isso.
      exiting={FadeOut}
      style={styles.container}
      {...rest}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {Icon && <Icon size={24} color={THEME.COLORS.GREY_100} />}
        </View>

        <LevelBars level={data.level} />
      </View>

      <Text style={styles.title}>
        {data.title}
      </Text>
    </TouchableOpacityAnimated>
  );
}