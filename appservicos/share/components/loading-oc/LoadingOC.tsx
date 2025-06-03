import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Dialog, Portal} from 'react-native-paper';
import {hp} from '../../utils/responsive';
import {colors, sizes} from '../../settings/Settings';

function LoadingOc(props: {
                     visible: boolean,

                     style?: any
                     color?: string,
                     size?: 'small' | 'large'
                   }
) {
  return (
    <View>
      {props.visible ?
        <ActivityIndicator
          animating={props.visible}
          color={props.color ? props.color : colors.primary}
          hidesWhenStopped={props.visible}
          size={props.size ? props.size : hp('6%')}
          style={props.style ? props.style : styles.loading}
        />
        : false
      }
    </View>
  );
}

function LoadingDialogOc(props: {
                           visible: boolean,

                           style?: any
                           color?: string,
                           size?: 'small' | 'large'
                         }
) {
  return (
    <Portal>
      <Dialog
        dismissable={false}
        visible={props.visible}
      >
        <Dialog.Title style={styles.title}>
          Carregando
        </Dialog.Title>

        <Dialog.Content>
          <ActivityIndicator
            animating={true}
            color={props.color ? props.color : colors.primary}
            hidesWhenStopped={props.visible}
            size={props.size ? props.size : hp('6%')}
            style={props.style ? props.style : styles.loadingDialog}
          />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}


export {LoadingOc, LoadingDialogOc}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  loadingDialog: {
    margin: 10
  },
  title: {
    fontSize: sizes.fontMedium,
    textAlign: "center"
  }
});


