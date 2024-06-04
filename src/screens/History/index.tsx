import { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, Pressable, Alert } from 'react-native';
import { HouseLine, Trash } from 'phosphor-react-native';

import { Header } from '../../components/Header';
import { HistoryCard, HistoryProps } from '../../components/HistoryCard';

import { styles } from './styles';
import { historyGetAll, historyRemove } from '../../storage/quizHistoryStorage';
import { Loading } from '../../components/Loading';
import Animated, { Layout, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import { THEME } from '../../styles/theme';

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryProps[]>([]);

  const { goBack } = useNavigation();

  const swipeableRefs = useRef<Swipeable[]>([]);

  async function fetchHistory() {
    const response = await historyGetAll();
    setHistory(response);
    setIsLoading(false);
  }

  async function remove(id: string) {
    await historyRemove(id);

    fetchHistory();
  }

  function handleRemove(id: string, index: number) {
    // acessando nosso item em específico
    swipeableRefs.current?.[index].close();
    Alert.alert(
      'Remover',
      'Deseja remover esse registro?',
      [
        {
          text: 'Sim', onPress: () => remove(id)
        },
        { text: 'Não', style: 'cancel' }
      ]
    );

  }

  useEffect(() => {
    fetchHistory();
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <Header
        title="Histórico"
        subtitle={`Seu histórico de estudos${'\n'}realizados`}
        icon={HouseLine}
        onPress={goBack}
      />

      <ScrollView
        contentContainerStyle={styles.history}
        showsVerticalScrollIndicator={false}
      >
        {
          history.map((item, index) => (
            // conseguimso aplicar animações tbm quando tem alterações de layout
            // ou seja, apagamos um elemento da lista de histórico, nossa lista vai se organizar sem o elemento deletado
            // conseguimos fazer uma animação justamente nisso

            // só essas 3 animações já fez uma animação muito legal
            <Animated.View
              key={item.id}
              entering={SlideInRight}
              exiting={SlideOutRight}
              layout={Layout.springify()}
            >
              <Swipeable
                // estamos pegando cada referência de cada item do array, para podermos selecionar o menu em específico, e nao a msm referência pra cada item
                ref={(ref) => {
                  if (ref) {
                    swipeableRefs.current?.push(ref)
                  }
                }}
                overshootLeft={false}
                containerStyle={styles.swipeableContainer}
                // definimos qual o tamanho a gente quer q "deslize" e ele já abre o cartão todo pra gente, o usuário n precisa arrastar tudo para o lado
                leftThreshold={10}
                // Evento de quando a pessoa abre
                onSwipeableOpen={() => handleRemove(item.id, index)}
                // garantindo q n renderize nd, pq no ios a gente consegue puxar pra direita
                renderRightActions={() => null}
                renderLeftActions={() => (
                  <View style={styles.swipeableRemove}>
                    <Trash size={32} color={THEME.COLORS.GREY_100} />
                  </View>
                )}
              >
                <HistoryCard data={item} />
              </Swipeable>
            </Animated.View>
          ))
        }
      </ScrollView>
    </View>
  );
}