import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import base64 from 'react-native-base64';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {InputTextOC} from '@/share/components/text-input-oc/InputTextOC';
import manipuladorExcecoes from '@/share/services/ManipuladorExcecoes';
import api from '@/share/services/Api';
import {ButtonOC} from '@/share/components/button-oc/ButtonOC';
import {Session} from '@/share/models/objects/Session';
import {estaLogado, getAntSession, getSession, onSignIn, setAntSession} from '@/share/services/Auth';
import {LoadingOc} from '@/share/components/loading-oc/LoadingOC';
import {InputTextMaskCpfCnpjOC} from '@/share/components/text-input-oc/InputTextMaskOC';
import {apiUrls, sizes} from '@/share/settings/Settings';
import {ValidationDTO} from '@/share/components/form-oc/ValidationDTO';
import {Context} from '@/share/models/Context';
import configSistema from '@/share/services/ConfigSistema';
import DialogOC, {ItemDialog} from '@/share/components/dialog-oc/DialogOC';
import { Cidade } from '@/src/protocolo/models/Cidade';
import { AutocompleteModalOC } from '@/share/components/autocomplete-oc/AutocompleteModalOC';
import ServiceGenerico from '@/share/services/ServiceGenerico';
import { Column } from '@/share/models/objects/Column';
import useForm from '@/share/components/form-oc/Form';
import { RequestParams } from '@/share/models/objects/RequestParams';
import {Card, Avatar} from 'react-native-paper';

class DtoLogin {
  static endPoint = `${apiUrls.protocolo}/login`;
  static api = 'protocolo';
  static className = 'Login';
  cidade: Cidade = new Cidade();
  cpfCnpj: any = '';
  senha: any = '';
}
export default function Login({navigation}) {

  const [usuario, setUsuario] = useState<DtoLogin>(new DtoLogin());
  const [loading, setLoading] = useState(false);
  const [cidadesItemDialog, setCidadesItemDialog] = useState<ItemDialog[]>([]);
  const [values, setValues, valid, setValidations, handleChange, handleSubmit, handleChangeArray, getValidation] = useForm(new Cidade());

  let session = new Session();

  async function autenticar() {
    setLoading(true);
    if (usuario.cpfCnpj && usuario.senha && usuario.cpfCnpj !== '' && usuario.senha !== '') {
      const params = new RequestParams();
      params.headers['codigoentidade'] = usuario.cidade.id;

      api.post(DtoLogin, usuario, params).then(async value => {
        session.usuario.nome = value?.nome;
        session.usuario.cpfCnpj = usuario.cpfCnpj;
        session.cidade = usuario.cidade;

        session.token = value?.token?.accessToken;

        await onSignIn(session).then();

        const antSession = await getAntSession();
        if (antSession) {
            await onSignIn(session).then();
            await concluirLogin();
        } else {
          await getCidade();
          getLocalizacao();
          concluirLogin();
        }
      }).catch(reason => {
        setLoading(false);
        manipuladorExcecoes.req(reason);
      });
    }
  }

  async function getCidade() {
    const config = await configSistema.getConfig();
    if (config?.usaContext === 'sim') {
      const cidades = await api.get<Cidade>({
        api: 'protocolo',
        endPoint: Cidade.endPoint,
      }, 'id,ibge,descricao,siglaUf', '', '');

      if (cidades?.conteudo?.length > 1) {
        const itens: ItemDialog[] = [];
        cidades.conteudo.forEach(cidade => {
          const item = new ItemDialog();
          item.chave = cidade.descricao;
          item.descricao = cidade.descricao;
          itens.push(item);
        });
        setCidadesItemDialog(itens);
      } else if (cidades?.conteudo?.length === 1) {
        usuario.cidade = cidades.conteudo[0];
        getLocalizacao();
      } else {
        setLoading(false);
        manipuladorExcecoes.exib('Sem permissão de acesso.');
      }
    } else {
      navigation.navigate('TabNavigator');
    }
  }

  async function getLocalizacao() {
    session = await getSession();

    let context = new Context();
    session.context = base64.encode(JSON.stringify(context));
    await onSignIn(session).then();
  }

  async function concluirLogin() {
    session = await getSession();
    await onSignIn(session).then();
    await setAntSession(session).then();
    setLoading(false);
    navigation.navigate('TabNavigator');
  }

  useEffect(() => {
    async function getToken() {
      const logado = await estaLogado();
      if (logado) {
        navigation.navigate('TabNavigator');
      }
    }

    getToken().then();
  }, []);

  useEffect(() => {
    async function inicializar() {
      const antSession = await getAntSession();
      await getCidade();

      if (antSession && antSession.cidade && antSession.usuario.cpfCnpj) {
        setUsuario({...usuario, cidade: antSession.cidade, cpfCnpj: antSession.usuario.cpfCnpj});
      }      
    }

    inicializar();
  }, []);

  function cadastrar() {
    navigation.navigate('CriarConta');
  }

  function recuperarSenha() {
    if ((usuario.cidade) && (usuario.cpfCnpj)) {
      const params = new RequestParams();
      params.headers['codigoentidade'] = usuario.cidade.id;

      setLoading(true);
      api.post({endPoint: `${apiUrls.protocolo}/LoginRecuperaSenha`, api: 'protocolo'}, {cpfCnpj: usuario.cpfCnpj}, params).then(() => {
        setLoading(false);
        manipuladorExcecoes.exib('Sua nova senha foi enviado para seu e-mail de cadastro.');
      }).catch(reason => {
        setLoading(false);
        manipuladorExcecoes.req(reason);
      });
    } else {
      manipuladorExcecoes.exib('Para recuperar sua senha é necessário informar a Entidade e o CPF/CNPJ');
    }
  }

  return (
    <View style={styles.container}>    
      <ScrollView>
        <Text style={styles.titleLogin}>Digi Cidade</Text>

        <AutocompleteModalOC
          class={Cidade}
          service={new ServiceGenerico()}
          label={'Entidade'}
          validationDTO={getValidation('cidade')}
          value={usuario.cidade}
          onSelect={(object) => {
            handleChange(object, 'descricao')
            setUsuario({...usuario, cidade: object});
          }}
          onClose={() => {
            handleChange(null, 'descricao')
            setUsuario({...usuario, cidade: null});
          }}
          arrayColumns={[
            new Column('Entidade', 'descricao', true)
          ]}
        />

        <InputTextMaskCpfCnpjOC
          required={true}
          label={'Usuário(CPF/CNPJ)'}
          value={usuario.cpfCnpj}
          onChangeText={textChange => setUsuario({...usuario, cpfCnpj: textChange})}
        />
        <InputTextOC
          validationDTO={new ValidationDTO('', true)}
          type={'password'}
          label={'Senha'}
          value={usuario.senha}
          onChangeText={textChange => setUsuario({...usuario, senha: textChange})}
        />

        <ButtonOC
          text="Entrar"
          disabled={!usuario.cidade || !usuario.cpfCnpj || !usuario.senha || usuario.senha.length < 8 || usuario.cpfCnpj.length < 11}
          onPress={() => autenticar()}
        />

        <TouchableOpacity onPress={() => recuperarSenha()}>
          <Text style={styles.esqueceuSenha}>Esqueceu sua senha? <Text style={styles.link}>Clique aqui.</Text></Text>
        </TouchableOpacity>

        

        <LoadingOc visible={loading}/>
      </ScrollView>
      <ButtonOC style={styles.linkCadastrar}
                text="Criar usuário"
                onPress={() => cadastrar()}
      />
      
        <Card.Cover resizeMode=''
          size={100}
          source={{ uri: `http://protocolo.digifred.net.br:8080/assets/imagens/logo_digifred_preto.png` }}
          style={styles.containerStyle}
        />    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: hp('100%')
  },
  titleLogin: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: sizes.fontLarge
  },
  linkCadastrar: {
    bottom: 10
  },
  esqueceuSenha: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: sizes.fontMedium
  },
  link: {
    color: '#002bdb',
    textDecorationLine: 'underline',
    fontSize: sizes.fontMedium
  },
  containerStyle: {
    backgroundColor: '#fafafa',   
    height: hp('14%'),
  },  
});
