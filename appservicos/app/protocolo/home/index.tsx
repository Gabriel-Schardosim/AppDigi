import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
// import {Card, Text} from 'react-native-paper';
import { Card } from 'react-native-paper';
import { Text } from 'react-native';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen'; substituted with custom responsive utility
import {hp} from '@/share/utils/responsive';

import {ListCardInitialOC} from '@/share/components/list-card-initial-oc/ListCardInitialOC';
import {Usuario} from '@/share/models/objects/Usuario';
import {getSession} from '@/share/services/Auth';
import {colors, sizes} from '@/share/settings/Settings';
import {ScreenGenerico} from '@/share/screens/screen-generico/ScreenGenerico';
import {ListaProtocoloGenerico} from '../protocolo/lista-protocolo';
import {CadastroProtocoloSteep1Generico} from '../protocolo/cadastro-protocolo';
import { useRouter } from 'expo-router';



// export default function Home({navigation}) {
export default function Home() {
  const router = useRouter();
  
const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: hp(100), // ou hp('100%')

  },
  
  title: {
    fontSize: sizes.fontLarge,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: sizes.fontMedium,
    marginBottom: '10%',
  },
  information: {
    marginTop: '12%',
    marginBottom: 5,
    fontSize: sizes.fontMedium,
    fontWeight: 'bold'
  },
  card: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    marginBottom: 5,
  },
  cardContent: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textSync: {
    fontSize: sizes.fontSmall,
    marginLeft: 10
  }
});

  const [usuario, setUsuario] = useState(new Usuario());

  useEffect(() => {
    //navigation.addListener('willFocus', async () => {
      //await verificaDados();
    //});

    async function getUser() {
      const session = await getSession();
      if (session?.usuario) {
        setUsuario(session.usuario);        
      }
    }

    async function useEffectAsync() {
      await getUser();
    }

    useEffectAsync().then();
  }, []);

  async function navegarParaFicha(ficha: ScreenGenerico<any>) {
    // navigation.navigate(ficha.route);
    router.push(ficha.route as any);
  }

  return (
    <View>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Olá, {usuario.nome.split(' ')[0]}</Text>
        <ListCardInitialOC items={
          [
            {
              icon: 'add',
              title: 'Solicitação de Serviço',
              onPress: (() => {
                navegarParaFicha(CadastroProtocoloSteep1Generico);
              })
            },            
            {
              icon: 'list',
              title: 'Consulta de Serviço',
              onPress: (() => {
                navegarParaFicha(ListaProtocoloGenerico);
              })
            }
          ]
        }/>
      </ScrollView>
    </View>
  );
}



