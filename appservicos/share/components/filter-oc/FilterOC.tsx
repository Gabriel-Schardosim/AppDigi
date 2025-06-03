import React, {useEffect, useState} from 'react';
import {Button, Chip, Dialog, Portal} from 'react-native-paper';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {componentsStyles} from '../../settings/GlobalStyle';
import {InputTextMaskOC} from '../text-input-oc/InputTextOC';
import {Column} from '../../models/objects/Column';
import {ValidationDTO} from '../form-oc/ValidationDTO';
import {RetornoDTO} from '../../models/objects/RetornoDTO';
import {InputTextDateOC, InputTextDateTimeOC} from '../text-input-date-oc/InputTextDateOC';


function FilterOC(props: {
  text: string,
  onPress: (() => void)
  onClose?: (() => void)

  style?: any,
  disabled?: boolean,
  selected?: boolean,
  focus?: boolean,
  multiple?: boolean,
  limitText?: number
  icon?: string,
  mode?: 'flat' | 'outlined',
}) {

  return (
    <TouchableOpacity
      onPress={props.onPress}
    >
      <Chip
        disabled={props.disabled}
        hasTVPreferredFocus={props.focus}
        mode={props.mode}
        selected={props.selected}
        style={[props.style ? props.style : componentsStyles.container, styles.chipFlex]}
      >
        {props.text}
      </Chip>
    </TouchableOpacity>
  );
}


function FilterDialogOc(props: {
  text: string,
  visible: boolean,
  column: Column,
  onDismiss: (() => void)
  onClean: (() => void)
  onFilter: ((text) => void),

  style?: any
  dismissable?: boolean,
  description?: string,
  titleButtonCancel?: string,
  titleButtonConfirm?: string,
}) {

  const [value, setValue] = useState(props.text);
  const [validationDTO, setValidationDTO] = useState(new ValidationDTO(''));

  useEffect(() => {
    setValidationDTO(new ValidationDTO(props.column.path, false, props.column.type, () => {
      return new RetornoDTO();
    }));
  }, []);

  return (
    <Portal>
      <Dialog
        onDismiss={props.onDismiss}
        style={props.style}
        visible={props.visible}
        dismissable={props.dismissable}
      >
        <Dialog.Title>Filtro</Dialog.Title>

        <Dialog.Content>
          {props.column.type === 'date' ?
            <InputTextDateOC
              value={value}
              label={props.column.text}
              validationDTO={validationDTO}
              onChangeText={(date) => {
                setValue(date);
              }}
            />
            :
            (props.column.type === 'datetime' ?
                <InputTextDateTimeOC
                  value={value}
                  label={props.column.text}
                  validationDTO={validationDTO}
                  onChangeText={(date) => {
                    setValue(date);
                  }}
                /> :
                <InputTextMaskOC
                  value={value}
                  label={props.column.text}
                  validationDTO={validationDTO}
                  onChangeText={(text) => {
                    setValue(text);
                  }}
                />
            )
          }
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={props.onDismiss}>Cancelar</Button>
          <Button onPress={props.onClean}>Limpar</Button>
          <Button onPress={() => props.onFilter(value)}>Filtrar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export {FilterDialogOc, FilterOC};

const styles = StyleSheet.create({
  chipFlex: {
    alignSelf: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5,
  }
});


