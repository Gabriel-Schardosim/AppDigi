import React from 'react';
import {Switch, Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {componentsStyles} from '../../settings/GlobalStyle';
import {colors, sizes} from '../../settings/Settings';

function SwitchLabelOC(props: {
                         checked: boolean,
                         label: string,
                         onPress: ((flag: boolean) => void),

                         disabled?: boolean,
                         required?: boolean,
                         style?: any,
                         align?: 'left' | 'right',
                       }
) {

  return (
    <TouchableOpacity
      disabled={props.disabled}
      activeOpacity={.7}
      style={[props.style ? props.style : styles.container, componentsStyles.input, props.align && props.align === 'right' ? styles.right : false]}
      onPress={() => {
        props.onPress(!props.checked)
      }}
    >
      <Switch
        color={colors.primary}
        disabled={props.disabled}
        value={props.checked}
        onValueChange={() => props.onPress(!props.checked)}
      />
      <Text style={styles.text}>
        {props.label + (props.required ? ' *' : '')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    alignSelf: 'flex-start',
  },
  right: {
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: sizes.fontSmall,
    color: colors.icon,
    marginLeft: 5
  }
});


export {SwitchLabelOC};
