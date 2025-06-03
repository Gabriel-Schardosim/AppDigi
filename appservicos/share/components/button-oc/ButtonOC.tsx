import React from 'react';
import {Button} from 'react-native-paper';
import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {componentsStyles} from '../../settings/GlobalStyle';
import {colors, sizes} from '../../settings/Settings';
import {hp} from '../../utils/responsive';

function ButtonOC(props: {
                    style?: any,
                    styleIcon?: any,
                    disabled?: boolean,
                    icon?: string,
                    text?: string,
                    mode?: 'text' | 'outlined' | 'contained',
                    onPress?: (() => void)
                  }
) {

  return (
    <TouchableOpacity
      onPress={props.disabled ? () => {
      } : props.onPress}
    >
      <Button
        disabled={props.disabled}
        mode={props.mode ? props.mode : 'contained'}
        style={[(props.mode === 'outlined' ? styles.buttonOutlined : styles.buttonContained), Platform.OS === 'ios' ? styles.buttonIOS : componentsStyles.button, props.style]}
      >
        <Text style={styles.text}>{props.text}</Text>
        {
          props.icon ? <IconCommunity
            name={props.icon}
            size={hp('2.3%')}
            style={props?.styleIcon ? props.styleIcon : styles.icon}
          /> : false
        }

      </Button>
    </TouchableOpacity>
  );
}

export {ButtonOC};

const styles = StyleSheet.create({
  buttonIOS: {
    height: hp('8%'),
  },
  buttonContained: {
    padding: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonOutlined: {
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: sizes.fontSmall,
  },
  icon: {
    marginLeft: 10
  }
});
