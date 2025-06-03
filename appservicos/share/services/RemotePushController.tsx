import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from 'react-native-firebase';

import {emiteNotificacao} from './LocalNotification';

export const TOKEN_CLOUD_MESSAGE = 'TOKEN_CLOUD_MESSAGE';

// TODO testar no ios https://github.com/react-native-community/push-notification-ios

const RemotePushController = () => {
  useEffect(() => {

    PushNotification.configure({
      onRegister: function(token: { token: string }) {
        AsyncStorage.setItem(TOKEN_CLOUD_MESSAGE, token.token);
        console.warn('token android', token);
      },

      onNotification: function(notification: any) {
        emiteNotificacao(notification.title, notification.message);
        console.warn('LOG android', notification.title);
      },

      //senderID: '256218572662',
      senderID: '0',
      popInitialNotification: true,
      requestPermissions: true
    });

   if (Platform.OS === 'ios') {
      // TODO testar se fuciona no android também, dáo pode ser deixado o mesmo código

      firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          firebase.messaging().getToken().then(token => {
            AsyncStorage.setItem(TOKEN_CLOUD_MESSAGE, token);
          })
          // user has permissions
        } else {
          firebase.messaging().requestPermission()
            .then(() => {
              alert("User Now Has Permission")
            })
            .catch(error => {
              // User has rejected permissions
            });
        }
      });

      firebase.messaging().getToken().then(token => {
        AsyncStorage.setItem(TOKEN_CLOUD_MESSAGE, token);

        console.warn('token ios', token);
      });

      firebase.notifications().onNotification((notification) => {
        const {
          body,
          data,
          notificationId,
          sound,
          subtitle,
          title
        } = notification;

        console.warn("LOG ios ", title, body, JSON.stringify(data))
        emiteNotificacao(title, body);
      });
    }
  }, [])
  return null
}
export default RemotePushController
