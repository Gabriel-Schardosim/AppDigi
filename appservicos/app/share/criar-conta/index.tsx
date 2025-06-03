import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3'

import { InputTextMaskOC, InputTextOC } from '@/share/components/text-input-oc/InputTextOC';
import manipuladorExcecoes from '@/share/services/ManipuladorExcecoes';
import api from '@/share/services/Api';
import { ButtonOC } from '@/share/components/button-oc/ButtonOC';
import { LoadingOc } from '@/share/components/loading-oc/LoadingOC';
import { apiUrls, appConfig, sizes } from '@/share/settings/Settings';
import { ValidationDTO } from '@/share/components/form-oc/ValidationDTO';
import { Usuario } from '@/share/models/objects/Usuario';
import useForm from '@/share/components/form-oc/Form';
import { Validator } from '@/share/services/Validator';
import { RequestParams } from '@/share/models/objects/RequestParams';
import { RetornoDTO } from '@/share/models/objects/RetornoDTO';
import { InputTextDateOC } from '@/share/components/text-input-date-oc/InputTextDateOC';
import { Cidade } from '@/src/protocolo/models/Cidade';
import { AutocompleteModalOC } from '@/share/components/autocomplete-oc/AutocompleteModalOC';
import ServiceGenerico from '@/share/services/ServiceGenerico';
import { Column } from '@/share/models/objects/Column';
import { useRouter } from 'expo-router';
// import Routes from '@/src/protocolo/settings/Routes';

import Login from '../login';

export default function CriarConta() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [captchaSiteKey, setCaptchaSiteKey] = useState(appConfig.captchaSiteKey);
  const [token, setToken] = useState('');
  const [captchaRef, setCaptchaRef] = useState<ReCaptchaV3 | null>(null);
  const [values, setValues, valid, setValidations, handleChange, handleSubmit, handleChangeArray, getValidation] = useForm(new Usuario());

  useEffect(() => {
    setValidations([
      new ValidationDTO('cidade', true),
      new ValidationDTO('nome', true),
      new ValidationDTO('cpfCnpj', true, 'cpf'),
      new ValidationDTO('senha', true, '', (text) => Validator.validaSenha(text)),
      new ValidationDTO('novaSenha', true, '', (text) => {
        if (text !== values.senha) {
          return new RetornoDTO().construtorComErro('As senhas devem ser iguais.');
        }
        return new RetornoDTO();
      }),
      new ValidationDTO('eMail', true, 'email'),
      new ValidationDTO('celular', true, 'celular'),
      new ValidationDTO('dataNascimento', true, 'date', (date) => Validator.validaDataPassadoOuPresente(date)),

    ])
  }, [values, valid]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      router.push('/login' as any);
      return true;
    });
  }, []);

  function cancelar() {
    // navigation.navigate('Login');
    // Routes.navigate('Login');
    router.push('Login' as any);
  }

  async function salvar(tentativa = 0) {
    captchaRef?.refreshToken();
    setLoading(true);
    const params = new RequestParams();
    // params.headers['codigoentidade'] = values.cidade.id;
    (params.headers as any)['codigoentidade'] = values.cidade.id;

    handleChange(false, 'flagNovidades')
    let usuario: Usuario = values;
    delete (usuario.novaSenha);
    setValues(usuario);

    await api.post({
      api: 'protocolo',
      endPoint: `${apiUrls.protocolo}/LoginCadastro`
    }, [values], params).then(() => {
      setLoading(false);
      manipuladorExcecoes.exib('Usuário cadastrado com sucesso, efetue o login para continuar.');
      // navigation.navigate('Login');
      router.push('/Login' as any);
    }).catch(reason => {
      if (reason.message === 'Captcha suspeito!' || reason.message === 'Captcha incorreto!') {
        if (tentativa <= 3) {
          salvar(tentativa++);
        } else {
          setLoading(false);
          manipuladorExcecoes.exib('Não foi possível criar a conta neste momento, tente novamente em alguns instantes');
        }
      } else {
        setLoading(false);
        manipuladorExcecoes.req(reason);
      }
    });
  }

  return (
    <View>
      <ReCaptchaV3
        ref={(ref: ReCaptchaV3) => setCaptchaRef(ref)}
        captchaDomain={'https://digifred.com'}
        siteKey={captchaSiteKey}
        onReceiveToken={(token: string) => setToken(token)} action={''}/>
      <ScrollView style={styles.container}>
        <Text style={styles.titleLogin}>Cadastro</Text>

        <AutocompleteModalOC
          class={Cidade}
          service={new ServiceGenerico()}
          label={'Entidade'}
          validationDTO={getValidation('cidade')}
          value={values.cidade}
          onSelect={(object) => {
            handleChange(object, 'cidade')
          }}
          onClose={() => {
            handleChange(null, 'cidade')
          }}
          arrayColumns={[
            new Column('Entidade', 'descricao', true)
          ]}
        />

        <InputTextOC
          validationDTO={getValidation('nome')}
          value={values.nome}
          label={'Nome'}
          limitCharacters={255}
          onChangeText={(text) => {
            handleChange(text, 'nome')
          }}
        />

        <InputTextMaskOC
          validationDTO={getValidation('cpfCnpj')}
          value={values.cpfCnpj}
          label={'CPF'}
          limitCharacters={11}
          onChangeText={(text) => {
            handleChange(text, 'cpfCnpj')
          }}
        />

        <InputTextMaskOC
          validationDTO={getValidation('eMail')}
          value={values.eMail}
          label={'Email'}
          limitCharacters={100}
          onChangeText={(text) => {
            handleChange(text, 'eMail');
          }}
        />

        <InputTextMaskOC
          validationDTO={getValidation('celular')}
          value={values.celular}
          label={'Celular'}
          limitCharacters={11}
          onChangeText={(text) => {
            handleChange(text, 'celular');
          }}
        />

        <InputTextDateOC
          validationDTO={getValidation('dataNascimento')}
          value={values.dataNascimento}
          label='Data de Nascimento'
          onChangeText={(date) => {
            handleChange(date, 'dataNascimento')
          }}
        />

        <InputTextOC
          validationDTO={getValidation('senha')}
          value={values.senha}
          label={'Senha'}
          type={'password'}
          limitCharacters={40}
          onChangeText={(text) => {
            handleChange(text, 'senha')
          }}
        />

        <InputTextOC
          validationDTO={getValidation('novaSenha')}
          value={values.novaSenha}
          label={'Confirmação de senha'}
          type={'password'}
          limitCharacters={40}
          onChangeText={(text) => {
            handleChange(text, 'novaSenha')
          }}
        />

        <ButtonOC
          text='Salvar'
          disabled={!valid}
          onPress={() => salvar()}
        />
        <ButtonOC
          text="Cancelar"
          disabled={loading}
          onPress={() => cancelar()}
        />

        <LoadingOc visible={loading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  titleLogin: {
    textAlign: 'center',
    fontSize: sizes.fontLarge
  },
});
