import { useEffect, useState } from 'react';
import { View, Image, FlatList } from 'react-native';

import {useNavigation} from '@react-navigation/native'

import { styles } from './styles';

import logoImg from '../../assets/logo-nlw-esports.png';
import { Heading } from '../../components/Heading';
import React from 'react';
import { GameCard, GameCardProps } from '../../components/GameCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Background } from '../../components/Background';

export function Home() {
  const [games, setGames] = useState<GameCardProps[]>([])

  const navigation =  useNavigation();

  function handleOpenGame({id, bannerUrl, title}: GameCardProps) {
    navigation.navigate('game', {id, bannerUrl, title});
  }

  useEffect(() => {
    fetch('https://3680-45-174-216-36.sa.ngrok.io/games')
      .then(response => response.json())
      .then(data => {
        setGames(data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Image source={logoImg} style={styles.logo} />

        <Heading  title="Encontre seu Duo" subtitle="Selecione o game que deseja jogar..."/>

        <FlatList
          contentContainerStyle={styles.contentList}
          data={games}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <GameCard
              data={item}
              onPress={() => handleOpenGame(item)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

      </SafeAreaView>
    </Background>

  );
}