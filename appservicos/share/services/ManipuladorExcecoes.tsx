import {Alert} from 'react-native';

import {onSignOut} from './Auth';

class ManipuladorExcecoes {
  exib(mensagem = '', err: any = null) {
    console.warn(mensagem, err);
    Alert.alert(mensagem, err);
  }

  req(err: any) {
    if (err?.data?.status === 401) {
      onSignOut().then();
    }

    if (err?.data?.message) {
      this.exib(err.data.message, JSON.stringify(err));
    } else if (err?.message) {
      //this.exib(err.message, JSON.stringify(err));
      this.exib(err.message, null);
    } else {
      this.exib('Erro ao conectar ao servidor', err);
    }
  }
}

const manipuladorExcecoes = new ManipuladorExcecoes();
export default manipuladorExcecoes;
