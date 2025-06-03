import React from 'react';
import {View} from 'react-native';
import DialogOC from '../dialog-oc/DialogOC';
import {RetornoDTO} from '../../models/objects/RetornoDTO';
import {LoadingDialogOc} from '../loading-oc/LoadingOC';

export default function FormUtilsOC(props: {
                                      navigation: any,
                                      cancel: boolean,
                                      exclude: boolean,
                                      loading: boolean,
                                      route: string,
                                      retornoDTO: RetornoDTO,
                                      onCancel: ((flag: boolean) => void),
                                      onExclude: ((flag: boolean) => void),
                                      onRetornoDTO: ((retorno: RetornoDTO) => void),

                                      cadastroOnline?: boolean,
                                      requiredDescription?: string,
                                      requiredOnBack?: (() => void),
                                      requiredOnGo?: (() => void),
                                    }
) {

  return (
    <View>
      <DialogOC
        visible={props.exclude}
        title='Confirmação'
        description={props.cadastroOnline ? 'Não é possível excluir um cadastro que já foi sincronizado' : 'Deseja realmente excluir o cadastro?'}
        titleButtonCancel={props.cadastroOnline ? '' : 'Não'}
        titleButtonConfirm={props.cadastroOnline ? 'Ok' : 'Sim'}
        onDismiss={() => props.onExclude(false)}
        onPress={() => {
          props.onExclude(!props.cadastroOnline);
          if (!props.cadastroOnline) {
            props.navigation.navigate(props.route);
          }
        }}
      />
      <DialogOC
        visible={props.cancel}
        title='Confirmação'
        description='Deseja realmente descartar alterações?'
        titleButtonCancel={'Não'}
        titleButtonConfirm={'Sim'}
        onDismiss={() => props.onCancel(false)}
        onPress={() => {
          props.onCancel(false);
          props.navigation.navigate(props.route);
        }}
      />
      <DialogOC
        visible={!!(props.requiredDescription && props.requiredDescription !== '')}
        title='Obrgatório'
        dismissable={false}
        description={props.requiredDescription}
        titleButtonCancel={'Voltar'}
        titleButtonConfirm={'Ir preencher'}
        onDismiss={() => props.requiredOnBack ? props.requiredOnBack() : false}
        onPress={() => props.requiredOnGo ? props.requiredOnGo() : false}
      />
      <DialogOC
        visible={props.retornoDTO.error}
        title='Erro'
        description={props.retornoDTO.message}
        onDismiss={() => props.onRetornoDTO(new RetornoDTO())}
      />
      <LoadingDialogOc
        visible={props.loading}
      />
    </View>
  );
}
