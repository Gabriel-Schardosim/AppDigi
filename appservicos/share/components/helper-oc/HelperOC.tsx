import React from 'react';
import {HelperText} from 'react-native-paper';

export default function HelperTextOC(props: {
                                       style?: any,
                                       visible?: boolean
                                       type?: string,
                                       text?: string,
                                     }
) {
  return (
    <HelperText
      style={props.style ? props.style : false}
      type={props.type ? props.type : 'error'}
      visible={props.visible}
    >
      {props.text}
    </HelperText>
  );
}
