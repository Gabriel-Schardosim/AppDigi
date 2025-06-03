import AsyncStorage from '@react-native-async-storage/async-storage';

import base64 from 'react-native-base64';

import {Session} from '../models/objects/Session';
import configSistema from './ConfigSistema';
import {Context} from '../models/Context';

export const AUTH_KEY = 'session';
export const ANT_AUTH_KEY = 'ant_session';

export const onSignIn = async (session: Session) => await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));

export const onSignOut = async () => await AsyncStorage.removeItem(AUTH_KEY);

export async function estaLogado(): Promise<boolean> {
  const session = await AsyncStorage.getItem(AUTH_KEY);
  const config = await configSistema.getConfig();
  if (session != null) {
    let sessao: Session = JSON.parse(String(session));
    let context = new Context();
    if (sessao.context) {
      context = JSON.parse(base64.decode(sessao.context));
    }
    //return !(config?.usaContext === 'sim'/* && (!context?.localizacao || context?.localizacao?.length <= 0)*/);
    return true;
  } else {
    return false;
  }
}

export async function getSession(): Promise<Session> {
  const session = await AsyncStorage.getItem(AUTH_KEY);
  return JSON.parse(String(session));
}

export async function setAntSession(session: Session): Promise<any> {
  return await AsyncStorage.setItem(ANT_AUTH_KEY, JSON.stringify(session));
}

export async function getAntSession(): Promise<Session> {
  const session = await AsyncStorage.getItem(ANT_AUTH_KEY);
  return JSON.parse(String(session));
}
