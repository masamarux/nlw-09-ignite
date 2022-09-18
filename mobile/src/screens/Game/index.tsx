import { TouchableOpacity, View, Image, FlatList, Text } from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Entypo} from '@expo/vector-icons'

import { Background } from '../../components/Background';

import { styles } from './styles';
import { GameParams } from '../../@types/@navigation';
import { THEME } from '../../theme';
import logoImg from '../../assets/logo-nlw-esports.png';
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import React, { useEffect, useState } from 'react';
import { DuoMatch } from '../../components/DuoMatch';

export function Game() {
  const route = useRoute();
  const navigation = useNavigation();
  const [ads, setAds] = useState<DuoCardProps[]>([])
  const [discord, setDiscord] = useState<string>('')

  const game = route.params as GameParams;

  function handleGoBack() {
    navigation.goBack()
  }

    async function getDiscordUser(adsId: string) {
    fetch(`https://3680-45-174-216-36.sa.ngrok.io/ads/${adsId}/discord`)
    .then(response => response.json())
    .then(data => {
      setDiscord(data.discord)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetch(`https://3680-45-174-216-36.sa.ngrok.io/games/${game.id}/ads`)
      .then(response => response.json())
      .then(data => {
        setAds(data)
      }).catch(err => {
        console.log(err)
      })
  }, [])



  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>

          <TouchableOpacity onPress={handleGoBack}>
            <Entypo name='chevron-thin-left' size={20} color={THEME.COLORS.CAPTION_300} />
          </TouchableOpacity>

          <Image 
            source={logoImg}
            style={styles.logo}
          />
          <View
            style={styles.right}
          />
        </View>

        <Image
          source={{uri: game.bannerUrl}}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading 
          title={game.title}
          subtitle="Conecte-se e comece a jogar!"
        />

        <FlatList
          data={ads}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <DuoCard data={item} onConnect={() => getDiscordUser(item.id)} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.containerList}
          contentContainerStyle={[ads.length > 0 ? styles.contentList : styles.emptyListContent]}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicados ainda.
            </Text>
          )}
        />

        <DuoMatch discord={discord} visible={!!discord} onClose={() => setDiscord('')} />
      </SafeAreaView>
    </Background>
    
  );
}