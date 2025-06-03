import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ScreenGenerico } from '@/app/share/screen-generico';
import { screenStyles } from '@/share/settings/GlobalStyle';
import { Validator } from '@/share/services/Validator';
import { ObjetoUtilsService } from '@/share/services/ObjetoUtilsService';
import { InputTextOC } from '@/share/components/text-input-oc/InputTextOC';
import { ButtonOC } from '@/share/components/button-oc/ButtonOC';
import useForm from '@/share/components/form-oc/Form';
import { ValidationDTO } from '@/share/components/form-oc/ValidationDTO';
import { RetornoDTO } from '@/share/models/objects/RetornoDTO';
import FormUtilsOC from '@/share/components/form-oc/FormUtilsOC';

import { AvatarAroundImageOC } from '@/share/components/avatar-around-oc/ImagemAroundOC';
import SteepProtocolo, { listSteepProtocolo } from './SteepProtocolo';
import { Protocolo } from '@/src/protocolo/models/Protocolo';
import { CadastroProtocoloService } from '@/src/protocolo/services/CadastroProtocoloService';
import { ListaProtocoloGenerico } from '../lista-protocolo';
import { AutocompleteModalOC } from '@/share/components/autocomplete-oc/AutocompleteModalOC';
import { Assunto } from '@/src/protocolo/models/Assunto';
import ServiceGenerico from '@/share/services/ServiceGenerico';
import { Column } from '@/share/models/objects/Column';

const CadastroProtocoloSteep1Generico = new ScreenGenerico(
  'Cadastro de Serviço',
  'CadastroProtocoloSteep1',
  Protocolo,
  new CadastroProtocoloService(),
  () => {},
  () => {},
  () => {},
  listSteepProtocolo
);
export { CadastroProtocoloSteep1Generico };

export default function CadastroProtocoloSteep1() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const idParam = params?.id as string | undefined;
  const isFixingError = params?.isFixingError === 'true';

  const [cancel, setCancel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exclude, setExclude] = useState(false);
  const [retornoDTO, setRetornoDTO] = useState<RetornoDTO>(new RetornoDTO());
  const [formRoute, setFormRoute] = useState<string>(ListaProtocoloGenerico.route);
  const [values, setValues, valid, setValidations, handleChange, handleSubmit, handleChangeArray, getValidation] = useForm(new Protocolo());

  useEffect(() => {
    setFormRoute(isFixingError ? 'Erro' : ListaProtocoloGenerico.route);

    const loadData = async () => {
      if (idParam && loading) {
        const retorno = await CadastroProtocoloSteep1Generico.initializyGet(Number(idParam));
        const modelo = retorno
          ? ObjetoUtilsService.converteObjeto(ObjetoUtilsService.removeCamposNulos(retorno), new Protocolo())
          : new Protocolo();
        setValues(await initializeModel(modelo));
        setLoading(false);
      } else if (loading) {
        setValues(await initializeModel(new Protocolo()));
        setLoading(false);
      }
    };

    loadData();
  }, [idParam, loading]);

  useEffect(() => {
    CadastroProtocoloSteep1Generico.onCancel = () => setCancel(true);
    CadastroProtocoloSteep1Generico.onDelete = () => setExclude(false);

    setValidations([
      new ValidationDTO('assunto.iAssunto', true),
      new ValidationDTO('descricao', true, '', (value) => Validator.validaMinimo(value, 3)),
    ]);
  }, [values]);

  async function initializeModel(protocolo: Protocolo): Promise<Protocolo> {
    return protocolo;
  }

  function onSubmit(route: string) {
    save(ListaProtocoloGenerico.route);
  }

  function save(route: string) {
    values.statusSincronizacao = 'E';
    values.alterado = true;

    CadastroProtocoloSteep1Generico.next(values, CadastroProtocoloSteep1Generico).then(retorno => {
      if (retorno.error) {
        setRetornoDTO(retorno);
      } else {
        const id = retorno.idGravado;
        handleChange(id, 'id');
        router.push({ pathname: route as any, params: { id, isFixingError: isFixingError ? 'true' : 'false' } });
      }
    });
  }

  return (
    <View>
      <FormUtilsOC
        navigation={router}
        cadastroOnline={values.iProtocolo > 0}
        cancel={cancel}
        onCancel={setCancel}
        exclude={exclude}
        onExclude={setExclude}
        onRetornoDTO={setRetornoDTO}
        loading={loading}
        route={formRoute}
        retornoDTO={retornoDTO}
      />

      <ScrollView style={screenStyles.scroll}>
        <SteepProtocolo
          Protocolo={values}
          onPress={(item) => handleSubmit(onSubmit, item.route)}
          steepKey={'CadastroProtocoloSteep1'}
          disabled={!valid}
        />

        <AutocompleteModalOC
          class={Assunto}
          service={new ServiceGenerico()}
          label={'Assunto'}
          validationDTO={getValidation('assunto')}
          value={values.assunto}
          onSelect={(object) => handleChange(object, 'assunto')}
          onClose={() => handleChange(null, 'assunto')}
          arrayColumns={[new Column('Descrição', 'descricao', true)]}
        />

        <InputTextOC
          value={values?.descricao}
          label={'Descrição'}
          limitCharacters={4939}
          onChangeText={(text) => handleChange(text, 'descricao')}
        />

        <View style={styles.container}>
          <View style={styles.avatar}>
            <AvatarAroundImageOC
              selectImage={true}
              onLoading={setLoading}
              imageBase64={values?.foto}
              onChange={(base64) => handleChange(base64, 'foto')}
            />
          </View>

          <View style={styles.avatar}>
            <AvatarAroundImageOC
              selectImage={true}
              onLoading={setLoading}
              imageBase64={values?.foto2}
              onChange={(base64) => handleChange(base64, 'foto2')}
            />
          </View>
        </View>

        <ButtonOC
          text='Cadastrar'
          disabled={!valid}
          onPress={() => handleSubmit(onSubmit)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  avatar: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 4,
    margin: 3,
    width: '48%'
  }
});
