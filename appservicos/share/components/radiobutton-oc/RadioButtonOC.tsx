import React from 'react';
import {RadioButton, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {componentsStyles} from '../../settings/GlobalStyle';

function RadioButtonOC(props: {
                         checked: boolean,
                         value: string,
                         onPress: (() => void),

                         style?: any
                         disabled?: boolean,
                         color?: string,
                       }
) {

  return (
    <View style={props.style}>
      <RadioButton
        color={props.color}
        disabled={props.disabled}
        onPress={props.onPress}
        status={props.checked ? 'checked' : 'unchecked'}
        value={props.value}
      />
    </View>

  );
}

function RadioButtonLabelOC(props: {
                              checked: boolean,
                              value: string,
                              label: string,
                              onPress: (() => void),

                              style?: any,
                              disabled?: boolean,
                              color?: string,
                            }
) {

  return (
      <View style={props.style ? props.style : [styles.container, componentsStyles.container]}>
          <RadioButton
              color={props.color}
              disabled={props.disabled}
              onPress={props.onPress}
              status={props.checked ? 'checked' : 'unchecked'}
              value={props.value}
          />
          <Text style={styles.text}>
              {props.label}
          </Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
      marginRight: 5
  },
});

export {RadioButtonOC, RadioButtonLabelOC};
