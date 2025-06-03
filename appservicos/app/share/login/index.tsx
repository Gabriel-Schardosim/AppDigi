// import React, { useEffect, useState } from 'react';
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// import base64 from 'react-native-base64';
// // import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import { hp, wp } from '@/share/utils/responsive';

// import { InputTextOC } from '@/share/components/text-input-oc/InputTextOC';
// import manipuladorExcecoes from '@/share/services/ManipuladorExcecoes';
// import api from '@/share/services/Api';
// import { ButtonOC } from '@/share/components/button-oc/ButtonOC';
// import { Session } from '@/share/models/objects/Session';
// import { estaLogado, getAntSession, getSession, onSignIn, setAntSession } from '@/share/services/Auth';
// import { LoadingOc } from '@/share/components/loading-oc/LoadingOC';
// import { InputTextMaskCpfCnpjOC } from '@/share/components/text-input-oc/InputTextMaskOC';
// import { apiUrls, sizes } from '@/share/settings/Settings';
// import { ValidationDTO } from '@/share/components/form-oc/ValidationDTO';
// import { Context } from '@/share/models/Context';
// import configSistema from '@/share/services/ConfigSistema';
// import DialogOC, { ItemDialog } from '@/share/components/dialog-oc/DialogOC';
// import { Cidade } from '@/src/protocolo/models/Cidade';
// import { AutocompleteModalOC } from '@/share/components/autocomplete-oc/AutocompleteModalOC';
// import ServiceGenerico from '@/share/services/ServiceGenerico';
// import { Column } from '@/share/models/objects/Column';
// import useForm from '@/share/components/form-oc/Form';
// import { RequestParams } from '@/share/models/objects/RequestParams';
// import { Card, Avatar } from 'react-native-paper';
// import { useRouter } from 'expo-router';

// class DtoLogin {
//   static endPoint = `${apiUrls.protocolo}/login`;
//   static api = 'protocolo';
//   static className = 'Login';
//   cidade: Cidade = new Cidade();
//   cpfCnpj: any = '';
//   senha: any = '';
// }
// export default function Login() {

//   const [usuario, setUsuario] = useState<DtoLogin>(new DtoLogin());
//   const [loading, setLoading] = useState(false);
//   const [cidadesItemDialog, setCidadesItemDialog] = useState<ItemDialog[]>([]);
//   const [values, setValues, valid, setValidations, handleChange, handleSubmit, handleChangeArray, getValidation] = useForm(new Cidade());
//   const router = useRouter();
//   let session = new Session();

//   async function autenticar() {
//     setLoading(true);
//     if (usuario.cpfCnpj && usuario.senha && usuario.cpfCnpj !== '' && usuario.senha !== '') {
//       const params = new RequestParams();
//       // params.headers['codigoentidade'] = usuario.cidade.id;
//       (params.headers as any)['codigoentidade'] = values.cidade.id;

//       api.post(DtoLogin, usuario, params).then(async value => {
//         // Adjust the type assertion below to match the actual response structure if needed
//         const response: any = value;
//         session.usuario.nome = response?.usuario?.nome;
//         session.usuario.cpfCnpj = usuario.cpfCnpj;
//         session.cidade = usuario.cidade;

//         session.token = response?.token?.accessToken;

//         await onSignIn(session).then();

//         const antSession = await getAntSession();
//         if (antSession) {
//           await onSignIn(session).then();
//           await concluirLogin();
//         } else {
//           await getCidade();
//           getLocalizacao();
//           concluirLogin();
//         }
//       }).catch(reason => {
//         setLoading(false);
//         manipuladorExcecoes.req(reason);
//       });
//     }
//   }

//   async function getCidade() {
//     const config = await configSistema.getConfig();
//     if (config?.usaContext === 'sim') {
//       const cidades = await api.get<Cidade>({
//         api: 'protocolo',
//         endPoint: Cidade.endPoint,
//       }, 'id,ibge,descricao,siglaUf', '', '');

//       if (cidades?.conteudo?.length > 1) {
//         const itens: ItemDialog[] = [];
//         cidades.conteudo.forEach(cidade => {
//           const item = new ItemDialog();
//           item.chave = cidade.descricao;
//           item.descricao = cidade.descricao;
//           itens.push(item);
//         });
//         setCidadesItemDialog(itens);
//       } else if (cidades?.conteudo?.length === 1) {
//         usuario.cidade = cidades.conteudo[0];
//         getLocalizacao();
//       } else {
//         setLoading(false);
//         manipuladorExcecoes.exib('Sem permissão de acesso.');
//       }
//     } else {
//       // navigation.navigate('TabNavigator');
//       router.push('/TabNavigator' as any);
//     }
//   }

//   async function getLocalizacao() {
//     session = await getSession();

//     let context = new Context();
//     session.context = base64.encode(JSON.stringify(context));
//     await onSignIn(session).then();
//   }

//   async function concluirLogin() {
//     session = await getSession();
//     await onSignIn(session).then();
//     await setAntSession(session).then();
//     setLoading(false);
//     // navigation.navigate('TabNavigator');
//     router.push('/TabNavigator' as any);
//   }

//   useEffect(() => {
//     async function getToken() {
//       const logado = await estaLogado();
//       if (logado) {
//         // navigation.navigate('TabNavigator');
//         // router.push('/TabNavigator' as any);
//       }
//     }

//     getToken().then();
//   }, []);

//   useEffect(() => {
//     async function inicializar() {
//       const antSession = await getAntSession();
//       await getCidade();

//       if (antSession && antSession.cidade && antSession.usuario.cpfCnpj) {
//         setUsuario({ ...usuario, cidade: antSession.cidade, cpfCnpj: antSession.usuario.cpfCnpj });
//       }
//     }

//     inicializar();
//   }, []);

//   function cadastrar() {
//     // navigation.navigate('CriarConta');
//     router.push('/CriarConta' as any);
//   }

//   function recuperarSenha() {
//     if ((usuario.cidade) && (usuario.cpfCnpj)) {
//       const params = new RequestParams();
//       // params.headers['codigoentidade'] = usuario.cidade.id;
//       (params.headers as any)['codigoentidade'] = values.cidade.id;

//       setLoading(true);
//       api.post({ endPoint: `${apiUrls.protocolo}/LoginRecuperaSenha`, api: 'protocolo' }, { cpfCnpj: usuario.cpfCnpj }, params).then(() => {
//         setLoading(false);
//         manipuladorExcecoes.exib('Sua nova senha foi enviado para seu e-mail de cadastro.');
//       }).catch(reason => {
//         setLoading(false);
//         manipuladorExcecoes.req(reason);
//       });
//     } else {
//       manipuladorExcecoes.exib('Para recuperar sua senha é necessário informar a Entidade e o CPF/CNPJ');
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <Text style={styles.titleLogin}>Digi Cidade</Text>

//         <AutocompleteModalOC
//           class={Cidade}
//           service={new ServiceGenerico()}
//           label={'Entidade'}
//           validationDTO={getValidation('cidade')}
//           value={usuario.cidade}
//           onSelect={(object) => {
//             handleChange(object, 'descricao')
//             setUsuario({ ...usuario, cidade: object });
//           }}
//           onClose={() => {
//             handleChange(null, 'descricao')
//             setUsuario({ ...usuario, cidade: new Cidade() });
//           }}
//           arrayColumns={[
//             new Column('Entidade', 'descricao', true)
//           ]}
//         />

//         <InputTextMaskCpfCnpjOC
//           required={true}
//           label={'Usuário(CPF/CNPJ)'}
//           value={usuario.cpfCnpj}
//           onChangeText={textChange => setUsuario({ ...usuario, cpfCnpj: textChange })}
//         />
//         <InputTextOC
//           validationDTO={new ValidationDTO('', true)}
//           type={'password'}
//           label={'Senha'}
//           value={usuario.senha}
//           onChangeText={textChange => setUsuario({ ...usuario, senha: textChange })}
//         />

//         <ButtonOC
//           text="Entrar"
//           disabled={!usuario.cidade || !usuario.cpfCnpj || !usuario.senha || usuario.senha.length < 8 || usuario.cpfCnpj.length < 11}
//           onPress={() => autenticar()}
//         />

//         <TouchableOpacity onPress={() => recuperarSenha()}>
//           <Text style={styles.esqueceuSenha}>Esqueceu sua senha? <Text style={styles.link}>Clique aqui.</Text></Text>
//         </TouchableOpacity>



//         <LoadingOc visible={loading} />
//       </ScrollView>
//       <ButtonOC style={styles.linkCadastrar}
//         text="Criar usuário"
//         // onPress={() => cadastrar()}
//       />

//       <Card.Cover resizeMode='cover'
//         source={{ uri: `http://protocolo.digifred.net.br:8080/assets/imagens/logo_digifred_preto.png` }}
//         style={styles.containerStyle}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     height: hp('100%')
//   },
//   titleLogin: {
//     marginTop: 20,
//     marginBottom: 20,
//     textAlign: 'center',
//     fontSize: sizes.fontLarge
//   },
//   linkCadastrar: {
//     bottom: 10
//   },
//   esqueceuSenha: {
//     marginTop: 20,
//     textAlign: 'center',
//     fontSize: sizes.fontMedium
//   },
//   link: {
//     color: '#002bdb',
//     textDecorationLine: 'underline',
//     fontSize: sizes.fontMedium
//   },
//   containerStyle: {
//     backgroundColor: '#fafafa',
//     height: hp('14%'),
//   },
// });
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import base64 from 'react-native-base64';
import { hp } from '@/share/utils/responsive';

import { InputTextOC } from '@/share/components/text-input-oc/InputTextOC';
import manipuladorExcecoes from '@/share/services/ManipuladorExcecoes';
import api from '@/share/services/Api';
import { ButtonOC } from '@/share/components/button-oc/ButtonOC';
import { Session } from '@/share/models/objects/Session';
import { estaLogado, getAntSession, getSession, onSignIn, setAntSession } from '@/share/services/Auth';
import { LoadingOc } from '@/share/components/loading-oc/LoadingOC';
import { InputTextMaskCpfCnpjOC } from '@/share/components/text-input-oc/InputTextMaskOC';
import { apiUrls, sizes } from '@/share/settings/Settings';
import { ValidationDTO } from '@/share/components/form-oc/ValidationDTO';
import { Context } from '@/share/models/Context';
import configSistema from '@/share/services/ConfigSistema';
import DialogOC, { ItemDialog } from '@/share/components/dialog-oc/DialogOC';
import { Cidade } from '../../../../appservicos/src/protocolo/models/Cidade';
import { AutocompleteModalOC } from '../../../share/components/autocomplete-oc/AutocompleteModalOC';
import ServiceGenerico from '../../../share/services/ServiceGenerico';
import { Column } from '../../../share/models/objects/Column';
import useForm from '@/share/components/form-oc/Form';
import { RequestParams } from '@/share/models/objects/RequestParams';
// import {Card, Avatar} from 'react-native-paper';
import { Image } from 'react-native';

import { Picker } from '@react-native-picker/picker';



class DtoLogin {
  static endPoint = `${apiUrls.protocolo}/login`;
  static api = 'protocolo';
  static className = 'Login';
  cidade: Cidade = new Cidade();
  cpfCnpj: string = '';
  senha: string = '';
}
import { NavigationProp } from '@react-navigation/native';

export default function Login({ navigation }: { navigation: NavigationProp<any> }) {

  const [usuario, setUsuario] = useState<DtoLogin>(new DtoLogin());
  console.log(usuario);
  const [loading, setLoading] = useState(false);
  const [cidadesItemDialog, setCidadesItemDialog] = useState<ItemDialog[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]); //adicionado
  // const [values, setValues, valid, setValidations, handleChange, handleSubmit, handleChangeArray, getValidation] = useForm(new Cidade());
  const [
    values,              // 0
    setValues,           // 1
    valid,               // 2
    setValidations,      // 3
    handleChange,        // 4
    handleSubmit,        // 5
    handleChangeArray,   // 6
    getValidation
  ] = useForm(new Cidade());
  let session = new Session();

  async function autenticar() {
    setLoading(true);
    if (usuario.cpfCnpj && usuario.senha && usuario.cpfCnpj !== '' && usuario.senha !== '') {
      const params = new RequestParams();
      // params.headers['codigoentidade'] = usuario.cidade.id;
      (params.headers as any)['codigoentidade'] = values.cidade.id;

      api.post(DtoLogin, usuario, params).then(async value => {
        // Adjust the type assertion below to match the actual response structure if needed
        const response: any = value;
        session.usuario.nome = response?.usuario?.nome;
        session.usuario.cpfCnpj = usuario.cpfCnpj;
        session.cidade = usuario.cidade;

        session.token = response?.token?.accessToken;

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
    console.log("usaContext:", config?.usaContext);
    //  if (config?.usaContext === 'sim') {
    const cidades = await api.get<Cidade>({
      api: 'protocolo',
      endPoint: Cidade.endPoint,
    }, 'id,ibge,descricao,siglaUf', '', '');


    if (cidades?.conteudo?.length ?? 0 > 1) {
      const itens: ItemDialog[] = [];

      cidades?.conteudo?.forEach((cidade: Cidade) => {
        const item = new ItemDialog();
        item.chave = cidade.descricao ?? '';
        item.descricao = cidade.descricao ?? '';
        itens.push(item);
      });

      setCidadesItemDialog(itens);
      console.log(cidadesItemDialog)
    } else if (cidades?.conteudo?.length === 1) {
      usuario.cidade = cidades.conteudo[0];
      getLocalizacao();
    } else {
      setLoading(false);
      manipuladorExcecoes.exib('Sem permissão de acesso.');
    }
    // } else {
    //   navigation.navigate('Home');
    // }
  }
  useEffect(() => {
    async function carregarCidades() {
      const response = await api.get<Cidade>({
        api: 'protocolo',
        endPoint: Cidade.endPoint,
      }, 'id,descricao');

      const cidadesResp = response; // já é o objeto esperado, sem .json()

      if (cidadesResp?.conteudo && cidadesResp.conteudo.length > 0) {
        setCidades(cidadesResp.conteudo);

        if (cidadesResp.conteudo.length === 1) {
          setUsuario(u => ({ ...u, cidade: cidadesResp.conteudo![0] }));
        }
      }
    }

    carregarCidades();
  }, []);



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
    navigation.navigate('Home');
  }

  useEffect(() => {
    async function getToken() {
      const logado = await estaLogado();
      if (logado) {
        navigation.navigate('Home');
      }
    }

    getToken().then();
  }, []);

  useEffect(() => {
    async function inicializar() {
      const antSession = await getAntSession();
      await getCidade();

      if (antSession && antSession.cidade && antSession.usuario.cpfCnpj) {
        setUsuario({ ...usuario, cidade: antSession.cidade, cpfCnpj: antSession.usuario.cpfCnpj });
      }
    }

    inicializar();
  }, []);

  function cadastrar() {
    // navigation.navigate('CriarConta');
    navigation.navigate('CriarConta');  
  }

  function recuperarSenha() {
    if ((usuario.cidade) && (usuario.cpfCnpj)) {
      const params = new RequestParams();
      // params.headers['codigoentidade'] = usuario.cidade.id.toString();
      (params.headers as any)['codigoentidade'] = values.cidade.id;

      setLoading(true);
      api.post({ endPoint: `${apiUrls.protocolo}/LoginRecuperaSenha`, api: 'protocolo' }, { cpfCnpj: usuario.cpfCnpj }, params).then(() => {
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
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.titleLogin}>Digi Cidade</Text>
        {/* <AutocompleteModalOC
          class={Cidade}
          service={new ServiceGenerico()}
          label={'Entidade'}
          value={cidadesItemDialog[0]}
          validationDTO={getValidation('cidade')}
          // value={usuario.cidade}
          onSelect={(object: any) => {
            handleChange(object, 'descricao')
            setUsuario({ ...usuario, cidade: object });
          }}
          onClose={() => {
            handleChange(null, 'descricao')
            setUsuario({ ...usuario });
          }}
          arrayColumns={[
            new Column('Entidade', 'descricao', true)
          ]}
        /> */}
        {/* Picker para seleção da cidade */}


        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={usuario.cidade?.id ?? ''}
            onValueChange={(itemValue: string | number) => {
              const cidadeSelecionada = cidades.find(c => c.id === itemValue);
              if (cidadeSelecionada) {
                setUsuario(u => ({ ...u, cidade: cidadeSelecionada }));
              }
            }}
            style={styles.picker}
            dropdownIconColor="#333"
          >
            <Picker.Item label="Selecione a Cidade/Entidade..." value="" />
            {cidades.map(cidade => (
              <Picker.Item key={cidade.id} label={cidade.descricao} value={cidade.id} />
            ))}
          </Picker>
        </View>
        {/* <AutocompleteModalOC
          class={Cidade} // <- corrigido
          service={new ServiceGenerico()}
          label={'Entidade'}
          value={usuario.cidade}
          validationDTO={getValidation('cidade')}
          onSelect={(object: any) => {
            handleChange(object, 'descricao');
            setUsuario({ ...usuario, cidade: object });
          }}
          onClose={() => {
            handleChange(null, 'descricao');
            setUsuario({ ...usuario });
          }}
          arrayColumns={[
            new Column('Entidade', 'descricao', true)
          ]}
        /> */}


        {/* <InputTextMaskCpfCnpjOC
            required={true}
            label={'Usuário(CPF/CNPJ)'}
            value={usuario.cpfCnpj}
          
            onChangeText={textChange => setUsuario({ ...usuario, cpfCnpj: textChange })}
          /> */}
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          placeholderTextColor="#999"
          value={usuario.cpfCnpj}
          onChangeText={(text) => setUsuario(u => ({ ...u, cpfCnpj: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={usuario.senha}
          onChangeText={(text) => setUsuario(u => ({ ...u, senha: text }))}
        />
        {/* <InputTextOC
          validationDTO={new ValidationDTO('', true)}
          type={'password'}
          label={'Senha'}
          value={usuario.senha}
          onChangeText={textChange => setUsuario({ ...usuario, senha: textChange })}
        /> */}

        {/* <ButtonOC
          text="Entrar"
          disabled={!usuario.cidade || !usuario.cpfCnpj || !usuario.senha || usuario.senha.length < 8 || usuario.cpfCnpj.length < 11}
          onPress={() => autenticar()}
        /> */}
        <TouchableOpacity style={styles.loginButton} onPress={autenticar}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => recuperarSenha()}>
          <Text style={styles.esqueceuSenha}>Esqueceu sua senha? <Text style={styles.link}>Clique aqui.</Text></Text>
        </TouchableOpacity>



        <LoadingOc visible={loading} />
      </ScrollView>
      <ButtonOC style={styles.linkCadastrar}
        text="Criar usuário"
        onPress={() => cadastrar()}
      />

      <Image
        resizeMode="contain"

        source={{ uri: `http://protocolo.digifred.net.br:8080/assets/imagens/logo_digifred_preto.png` }}
        style={styles.containerStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    height: hp('100%'),
    backgroundColor: '#FF2441',
  },
  titleLogin: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  linkCadastrar: {
    backgroundColor: '#0066cc', // nova cor
  padding: 12,
  borderRadius: 8,
  marginTop: 20,
  alignItems: 'center',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
    justifyContent: 'flex-start',
  },
  esqueceuSenha: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: sizes.fontMedium,
    color: '#ffffff',
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
  label: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'white',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginButtonText: {
    color: '#FF4352',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
