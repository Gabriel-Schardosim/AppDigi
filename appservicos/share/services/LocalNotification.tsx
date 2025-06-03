import React from 'react';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from './Api';
import {getSession} from './Auth';
import manipuladorExcecoes from './ManipuladorExcecoes';
import {ClienteCloudMessage} from '../models/ClienteCloudMessage';
import {TOKEN_CLOUD_MESSAGE} from './RemotePushController';

export const ID_CLIENTE_CLOUD_MESSAGE = 'ID_CLIENTE_CLOUD_MESSAGE';

// TODO testar no ios https://github.com/react-native-community/push-notification-ios

function emiteNotificacao(titulo: string, mensagemPequena: string, mensagemGrande = mensagemPequena, acoes = '["Ver"]') {
  PushNotification.configure({
    onNotification: function (notification: any) {
      console.log('LOCAL NOTIFICATION ==>', notification)
    },
    popInitialNotification: true,
    requestPermissions: true
  });

  PushNotification.localNotification({
    autoCancel: true,
    bigText: mensagemGrande,
    subText: mensagemPequena,
    title: titulo,
    message: 'Expandir para ver mais',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    actions: acoes
  })
}
function getBundleId(): string {
  // Se NÃO usar Expo, substitua por valores fixos
  return Platform.select({
    ios: 'com.seuapp.ios',
    android: 'com.seuapp.android',
    default: 'desconhecido'
  })!;
}

async function gravaClienteCloudMessage() {

  const id = await AsyncStorage.getItem(ID_CLIENTE_CLOUD_MESSAGE);
  const appID = await AsyncStorage.getItem(TOKEN_CLOUD_MESSAGE);
  const usuario = await getSession();

  if (!id && appID && usuario?.usuario?.cpfCnpj) {
    const clienteCloudMessage = new ClienteCloudMessage();
    // clienteCloudMessage.nomeAplicativo = DeviceInfo.getBundleId();
    clienteCloudMessage.nomeAplicativo = getBundleId();
    clienteCloudMessage.chave = appID;
    clienteCloudMessage.cpfCnpj = usuario.usuario.cpfCnpj;

    api.post(ClienteCloudMessage, [clienteCloudMessage]).then(value => {
      AsyncStorage.setItem(ID_CLIENTE_CLOUD_MESSAGE, value.idGravado.toString())
    }).catch(reason => {
      manipuladorExcecoes.req(reason);
    });
  }
}

export {emiteNotificacao, gravaClienteCloudMessage};
