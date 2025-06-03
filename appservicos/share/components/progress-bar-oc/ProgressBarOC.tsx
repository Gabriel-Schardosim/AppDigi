import React from 'react';
import {ProgressBar} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {colors} from '../../settings/Settings';



export default function ProgressBarOC(props: {
                                        style?: any
                                        visible?: boolean,
                                        indeterminate?: boolean,
                                        progress?: number,
                                        color?: string
                                      }
) {
  return (
    <ProgressBar
      color={props.color ? props.color : colors.primary}
      indeterminate={props.indeterminate}
      progress={props.progress ? props.progress : 1}
      style={props.style ? props.style : styles.loading}
      visible={props.visible}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});


