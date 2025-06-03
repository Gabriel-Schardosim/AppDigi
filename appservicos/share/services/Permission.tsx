import {PermissionsAndroid, Platform} from 'react-native';
import firebase from 'react-native-firebase';

import manipuladorExcecoes from './ManipuladorExcecoes';

export default async function requestCameraAndAudioPermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted["android.permission.RECORD_AUDIO"] !==
        PermissionsAndroid.RESULTS.GRANTED ||
        granted["android.permission.CAMERA"] !==
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        manipuladorExcecoes.exib('É necessário acessar a câmera e microfone para utilizar este aplicativo!');
      }
    } else {
      firebase.messaging().requestPermission()
        .catch(() => {
          manipuladorExcecoes.exib('É necessário conceder permissão para utilizar este aplicativo!');
        });
    }
  } catch (err) {
    console.warn(err);
  }
}
