import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
// import {Text} from 'react-native-paper';
import { Text } from 'react-native';

import ServiceGenerico from '@/share/services/ServiceGenerico';
import { colors, sizes } from '@/share/settings/Settings';
import { ScreenGenerico } from '@/app/share/screen-generico';
import { Protocolo } from '@/src/protocolo/models/Protocolo';
import { SubListResumidaOC } from '@/share/components/list-oc/SubListResumidaOC';
import { Tramitacao } from '@/src/protocolo/models/Tramitacao';
import { Column } from '@/share/models/objects/Column';
import { Dependent } from '@/share/models/objects/Dependent';
import { AvatarAroundImageOC } from '@/share/components/avatar-around-oc/ImagemAroundOC';
import Moment from 'moment';
import 'moment/locale/pt-br';
import { CadastroProtocoloSteep1Generico } from '.';
import { ListaProtocoloGenerico } from '../lista-protocolo';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';

const ViewCadastroProtocoloGenerico = new ScreenGenerico(
  'Serviço',
  'ViewCadastroProtocolo',
  Protocolo,
);
export { ViewCadastroProtocoloGenerico };

// export default function ViewCadastroProtocolo({navigation}) {

export default function ViewCadastroProtocolo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [model, setModel] = useState<Protocolo>(new Protocolo());
  const [loading, setLoading] = useState<boolean>(true);
  const [exclude, setExclude] = useState<boolean>(false);


  useEffect(() => {
    CadastroProtocoloSteep1Generico.onDelete = () => {
      ViewCadastroProtocoloGenerico.delete(Number(id)).then(retorno => {
        if (retorno.error) {
          Alert.alert(retorno.message, "");
          //setRetornoDTO(retorno);
        } else {
          Alert.alert("Serviço excluído com sucesso.", "");
          // router.push(ListaProtocoloGenerico.route);
          router.push(ListaProtocoloGenerico.route as any);
        }
      });

      setExclude(true);
    };

    async function getDados() {
      if (id) {
        const retorno = await new ServiceGenerico<Protocolo>().get(Protocolo, '', 'id = ' + id);
        if (retorno.conteudo.length > 0) {
          const protocolo = retorno.conteudo[0];

          Moment.locale('pt-br');
          protocolo.dataProtocolo = Moment(protocolo.dataProtocolo).format('DD/MM/YYYY');

          setModel(protocolo);
        }
      }
    }
    useFocusEffect(
      React.useCallback(() => {
        setLoading(true);
        getDados().finally(() => setLoading(false));
      }, [id])
    );

    // Removed navigation.addListener('willFocus', ...) as it's not compatible with expo-router
    // setLoading(true);
    // getDados().then(() => setLoading(false));

    ViewCadastroProtocoloGenerico.onRegister = () => {
      //router.push({ pathname: CadastroProtocoloSteep1Generico.route, params: { id } });
    };
  }, []);

  return (
    <ScrollView style={styles.view}>
      <Text style={styles.text}><Text style={styles.title}>Número: </Text>{model.codigo}/{model.ano}</Text>
      <Text style={styles.text}><Text style={styles.title}>Data: </Text>{model.dataProtocolo}</Text>
      <Text style={styles.text}><Text style={styles.title}>Assunto: </Text>{model.assunto?.descricao}</Text>
      <Text style={styles.text}><Text style={styles.title}>Descrição: </Text>{model.descricao}</Text>
      <Text style={styles.text}><Text style={styles.title}>Setor: </Text>{model.setor.descricao}</Text>
      {
        model.tramitacoes[0]?.dataTramitacao != null ?
          false
          : <Text style={styles.text}><Text style={styles.title}>Situação: </Text>Aguardando</Text>
      }

      {
        model.foto != null ?
          <View style={styles.avatar}>
            <AvatarAroundImageOC
              selectImage={false}
              onLoading={(loading) => setLoading(loading)}
              imageBase64={model.foto}
            />
          </View>
          : false
      }
      {
        model.foto2 != null ?
          <View style={styles.avatar}>
            <AvatarAroundImageOC
              selectImage={false}
              onLoading={(loading) => setLoading(loading)}
              imageBase64={model.foto2}
            />
          </View>
          : false
      }


      <SubListResumidaOC
        class={Protocolo}
        loading={loading}
        dependent={new Dependent(Tramitacao, 'tramitacoes', undefined, 'tramitacoes')}
        filter={'id = ' + id}
        onPress={(id) => {

        }}
        onNew={() => {

        }}
        service={new ServiceGenerico()}
        arrayColumns={[
          new Column('Data', 'dataTramitacao', false, 'date'),
          new Column('Setor', 'setor.descricao', true, 'custom'),
          new Column('Parecer', 'parecer.descricao', false, 'custom'),
          new Column('Observação', 'observacao', false, 'custom'),
        ]}
      />

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  view: {
    margin: 15,
  },
  text: {
    fontSize: sizes.fontSmall,
    padding: 3,
  },
  title: {
    fontWeight: 'bold',
  },
  avatar: {
    margin: 2,
    flex: 1,
    width: '100%', height: '100%'
  }
});
