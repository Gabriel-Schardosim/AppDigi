import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { screenStyles } from '@/share/settings/GlobalStyle';
import { colors, sizes } from '@/share/settings/Settings';
import { ErroSincronizacao } from '@/share/models/ErroSincronizacao';
import { DateUtils } from '@/share/services/DateUtils';
import { ErroSincronizacaoService } from '@/share/services/ErroSincronizacaoService';
import { LoadingDialogOc } from '@/share/components/loading-oc/LoadingOC';
import { SwitchLabelOC } from '@/share/components/switch-oc/SwitchOC';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

// export default function Erro({navigation}) {
export default function Erro() {
  const router = useRouter();

  const [erros, setErros] = useState<Array<ErroSincronizacao>>([]);
  const [loading, setLoading] = useState(false);
  const [verCorrigidos, setVerCorrigidos] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getErros().then();
    }, [])
  );

  // useEffect(() => {
  //   navigation.addListener('willFocus', async () => {
  //     setLoading(true);
  //     getErros().then();
  //   });
  //   setLoading(true);
  //   getErros().then();
  // }, []);

  async function getErros(verTodos = false) {
    let filtro = '';
    if (!verTodos) {
      filtro = 'cadastroAlterado = false';
    }
    setErros([]);
    await new ErroSincronizacaoService().get(ErroSincronizacao, '', filtro, 'data').then(retorno => {
      if (retorno?.conteudo?.length > 0) {
        setErros(retorno.conteudo)
      }
    });
    setLoading(false)
  }

  return (
    <View>
      <LoadingDialogOc
        visible={loading}
      />
      <SwitchLabelOC
        label='Ver Corrigidos'
        checked={verCorrigidos}
        onPress={(flag) => {
          setVerCorrigidos(flag);
          getErros(flag).then();
        }}
      />

      <ScrollView style={screenStyles.scroll}>
        {
          erros.map((erro) => {
            return (
              <View
                key={erro.id}
                style={[styles.card, erro.cadastroAlterado ? styles.backgroundFinalizado : styles.backgroundAberto]}
              >
                <TouchableOpacity

                  // key={erro.id + '1'}
                  // onPress={() => {
                  // navigation.navigate(erro.nomeFicha + 'Steep1', {'id': erro.idFicha, 'isFixingError': true});
                  onPress={() => {
                    const path = `/${erro.nomeFicha}Steep1?id=${erro.idFicha}&isFixingError=true`;
                    router.push(path as any);
                  }}
                >
                  <Text
                    key={erro.id + '2'}
                    style={[styles.title, erro.cadastroAlterado ? styles.colorFinalizado : styles.colorAberto]}>{erro.nomeFicha.split(/(?=[A-ZÀ-Ú])/).join(' ')}</Text>
                  <Text
                    key={erro.id + '3'}
                    style={[styles.text, erro.cadastroAlterado ? styles.colorFinalizado : styles.colorAberto]}>Data: {DateUtils.formatDateTimeToBr(erro.data, true)}</Text>
                  <Text
                    key={erro.id + '4'}
                    style={[styles.text, erro.cadastroAlterado ? styles.colorFinalizado : styles.colorAberto]}>Erros:</Text>
                  {
                    erro?.errosEnvio?.split(';').map((e) => {
                      if (e && e != '') {
                        return (
                          <Text
                            key={erro.id + e}
                            style={[styles.textErros, erro.cadastroAlterado ? styles.colorFinalizado : styles.colorAberto]}>- {e}</Text>
                        )
                      }
                    })
                  }
                </TouchableOpacity>
              </View>
            )
          })
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  backgroundAberto: {
    borderColor: colors.primary,
  },
  backgroundFinalizado: {
    borderColor: '#4aaa4e',
  },
  colorAberto: {
    color: colors.primary,
  },
  colorFinalizado: {
    color: '#4aaa4e',
  },
  title: {
    fontWeight: 'bold',
    fontSize: sizes.fontMedium,
  },
  text: {
    marginTop: 3,
    fontSize: sizes.fontMedium,
  },
  textErros: {
    marginLeft: 5,
    marginTop: 2,
    fontSize: sizes.fontSmall,
  },
});
