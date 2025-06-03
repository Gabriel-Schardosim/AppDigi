import React from 'react';
import {Snackbar} from 'react-native-paper';
import {StyleSheet} from 'react-native';

export default function SnackbarOC(props: {
                                     visible: boolean
                                     onDismiss: (() => void)
                                     text: string,

                                     style?: any
                                     duration?: number,
                                     type?: string,
                                     labelButton?: string,
                                     onPress?: (() => void)
                                   }
) {

  return (
    <Snackbar
      action={{
        label: props.labelButton ? props.labelButton : 'Ok',
        onPress: () => {
          (props.onPress ? props.onPress : props.onDismiss);
        },
      }}
      duration={props.duration}
      onDismiss={props.onDismiss}
      style={props.style ? props.style : styles.container}
      visible={props.visible}
    >
      {props.text}
    </Snackbar>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: '#2e302e',
  },
});
