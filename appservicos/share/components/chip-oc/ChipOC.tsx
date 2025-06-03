import React from 'react';
import {Chip} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {componentsStyles} from '../../settings/GlobalStyle';


export default function ChipOC(props: {
                                 text: string,

                                 style?: any,
                                 disabled?: boolean,
                                 selected?: boolean,
                                 focus?: boolean,
                                 multiple?: boolean,
                                 limitText?: number
                                 icon?: string,
                                 avatar?: string,
                                 mode?: 'flat' | 'outlined',
                                 onPress?: (() => void)
                                 onClose?: (() => void)
                               }
) {

  function handleText() {
    if (props.limitText && props.text?.length > props.limitText) {
        return props.text.substr(0, props.limitText) + '...';
    } else {
        return props.text;
    }
  }

  return (
    <Chip
        avatar={props.avatar}
        disabled={props.disabled}
        hasTVPreferredFocus={props.focus}
        mode={props.mode}
        onPress={props.onPress}
        onClose={props.onClose}
        selected={props.selected}
        style={[props.style ? props.style : componentsStyles.container, (props.multiple ? styles.chipFlex : false)]}
    >
      {handleText()}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chipFlex: {
    alignSelf: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5,
  }
});


