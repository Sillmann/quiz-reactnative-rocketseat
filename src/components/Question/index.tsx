import { View, Text, Dimensions } from 'react-native';

import { Option } from '../Option';
import { styles } from './styles';
import Animated, { Keyframe, runOnJS } from 'react-native-reanimated';

type QuestionProps = {
  title: string;
  alternatives: string[];
}

type Props = {
  question: QuestionProps;
  alternativeSelected?: number | null;
  setAlternativeSelected?: (value: number) => void;
  onUnmount: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

// Vamos utilizar keyframes para construir uma animação nossa do zero

export function Question({ question, alternativeSelected, setAlternativeSelected, onUnmount }: Props) {
  // useWindowDimensions é um hook que fica observando se houve alguma mudança no tamanho da tela, por ex, mudamos na horizontal

  // Assim q criamos nossa animação customizada através do keyframe
  // frame a frame oq a animação deve fazer
  const enteringKeyframe = new Keyframe({
    // aq definimos em qual passo estamos e oq fazemos, podemos definir com um numero, uma porcentagem, uma string
    // dizemos oq nossa animação vai fazer em cada frame
    // essa estratégia é bem legal pra quando vc quer definir exatamente oq sua animação deve fazer exatamente nesse frama
    0: {
      opacity: 0,
      transform: [
        // jogando nosso componente pra fora da tela
        { translateX: SCREEN_WIDTH },
        { rotate: '90deg' }
      ]
    },
    70: {
      opacity: 0.3
    },
    100: {
      opacity: 1,
      transform: [
        // jogando nosso componente pra fora da tela
        { translateX: 0 },
        { rotate: '0deg' }
      ]
    }
  });

  // aq simplesmente sai disso e vai pra isso
  const exitingKeyframe = new Keyframe({
    // aq vamos fazer um keyframe de um jeito mais enxuto
    from: {
      opacity: 1,
      transform: [
        { translateX: 0 },
        { rotate: '0deg' }
      ]
    },
    to: {
      opacity: 0,
      transform: [
        { translateX: SCREEN_WIDTH * (-1) },
        { rotate: '-90deg' }
      ]
    }
  });

  return (
    <Animated.View
      style={styles.container}
      // podemos também adicionar modificadores nos nosso keyframes
      entering={enteringKeyframe.duration(400)}
      exiting={exitingKeyframe.duration(400).withCallback((finished) => {
        'worklet'
        if (finished) {
          runOnJS(onUnmount)();
        }
      })}
    >
      <Text style={styles.title}>
        {question.title}
      </Text>

      {
        question.alternatives.map((alternative, index) => (
          <Option
            key={index}
            title={alternative}
            checked={alternativeSelected === index}
            onPress={() => setAlternativeSelected && setAlternativeSelected(index)}
          />
        ))
      }
    </Animated.View>
  );
}