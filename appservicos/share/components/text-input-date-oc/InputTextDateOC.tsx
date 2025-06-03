import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import {hp} from '../../utils/responsive';
import {IconButton, TextInput} from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextInputMask} from 'react-native-masked-text';

import {DateUtils} from '../../services/DateUtils';
import {colors, sizes} from '../../settings/Settings';
import {componentsStyles} from '../../settings/GlobalStyle';
import HelperTextOC from '../helper-oc/HelperOC';
import {ValidationDTO} from '../form-oc/ValidationDTO';

function InputTextDateOC(props: {
                           label: string,
                           value: string,
                           onChangeText: ((textChange: string | null) => void)

                           style?: any,
                           placeholder?: string,
                           focus?: boolean,
                           error?: boolean,
                           disabled?: boolean,
                           helperText?: string,
                           validationDTO?: ValidationDTO,
                         }
) {

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [error, setError] = useState(props.error);
  const [errorMessage, setErrorMessage] = useState(props.helperText);
  const [modify, setModify] = useState(false);
  const [value, setValue] = useState<string | null>(props.value);
  const [valueFormatted, setValueFormatted] = useState('');

  const refMask = useRef<any>(null);

  useEffect(() => {
    setModify(true);
    if (value) {
      props.onChangeText(DateUtils.converteParaISOSomaTimezone(new Date(value)));
    } else {
      props.onChangeText(null);
    }
  }, [value]);

  useEffect(() => {
    async function dateForm(date: string) {
      if (!datePickerVisible && !modify) {
        await setModify(false)
        await setValueFormatted(DateUtils.formatDateToBr(date));
      }
    }

    dateForm(props.value).then()
  }, [props.value, value]);

  function onBlur() {
    validate(DateUtils.formatDateToUs(props.value));
    if ((props.value != null && props.value !== '') && !error && !refMask.current?.isValid()) {
      setError(true);
      setErrorMessage('Formato de data inválido');
    }
  }

  function onFocus() {
    if (error) {
      setError(false);
      setErrorMessage('');
    }
  }

  function handleOpen() {
    onFocus();
    setDatePickerVisible(true);
  }

  function handleClose() {
    setDatePickerVisible(false);
    setValue(null);
    validateRequired(null);
    validate('');
  }

  function handleConfirm(date: Date) {
    setDatePickerVisible(false);
    setValue(DateUtils.formatDateToUs(date));
    refMask?.current?._inputElement.focus();
  }

  function validateRequired(date: Date | string | null) {
    if (props.validationDTO?.required && (date === null || date === '')) {
      setError(true);
      setErrorMessage('Este campo é obrigatório.');
    }
  }

  function validate(date: Date | string) {
    if (props.validationDTO?.required && (date == null || date === '')) {
      setError(true);
      setErrorMessage('Este campo é obrigatório.');
    } else {
      if (date !== '') {
        if (new Date(date).getTime() < new Date('1700-01-01').getTime()) {
          setError(true);
          setErrorMessage('A data deve ser maior ou igual a 01/01/1700');
        } else {
          setError(false);
          setErrorMessage('');
        }
      }
      if (!error && date && props.validationDTO?.validateCustom) {
        let retornoDTO = props.validationDTO.validateCustom(props.value);
        if (retornoDTO && retornoDTO.error) {
          setError(retornoDTO.error);
          setErrorMessage(retornoDTO.message);
        }
      }
    }
  }

  return (
    <View style={props.style ? props.style : [styles.container, componentsStyles.container]}>
      <TouchableOpacity style={styles.textInput} onPress={handleOpen}>
        <View pointerEvents="none">
          <TextInput
            disabled={props.disabled}
            error={error}
            label={props.label + (props.validationDTO?.required ? ' *' : '')}
            mode='outlined'
            multiline={false}
            numberOfLines={1}
            onBlur={() => onBlur()}
            style={componentsStyles.input}
            placeholder={props.placeholder}
            value={modify ? props.value : props.value ? valueFormatted : ''}
            render={props =>
              <TextInputMask style={[styles.mask, componentsStyles.input]}
                             type={'datetime'}
                             options={{
                               format: 'DD/MM/YYYY'
                             }}
                             onBlur={() => onBlur()}
                             onFocus={() => Keyboard.dismiss()}
                             ref={refMask}
                             value={modify ? props.value : props.value ? valueFormatted : ''}
              />
            }
          />
          <HelperTextOC
            text={errorMessage}
            visible={error}
          />
        </View>
      </TouchableOpacity>
      <IconButton
        style={{margin: 15}}
        iconColor={colors.icon}
        icon="calendar"
        onPress={handleOpen}
        size={sizes.icon}
      />
      <DateTimePicker
        style={{width: hp('80%')}}
        locale={'pt-BR'}
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={handleClose}
      />
    </View>
  );
}


function InputTextDateTimeOC(props: {
                               label: string,
                               value: string,

                               style?: any,
                               disabled?: boolean,
                               focus?: boolean,
                               error?: boolean,
                               placeholder?: string,
                               helperText?: string,
                               onChangeText: ((textChange: string | null) => void),
                               validationDTO?: ValidationDTO,
                             }
) {

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [error, setError] = useState(props.error);
  const [errorMessage, setErrorMessage] = useState(props.helperText);
  const [modify, setModify] = useState(false);
  const [valueFormatted, setValueFormatted] = useState('');
  const [value, setValue] = useState<string | null>(props.value);

  const refMask = useRef<any>(null);

  useEffect(() => {
    setModify(true);
    if (value) {
      props.onChangeText(DateUtils.converteParaISOSomaTimezone(new Date(value)));
    } else {
      props.onChangeText(null);
    }
  }, [value]);

  useEffect(() => {
    async function dateForm(date: string) {
      if (!datePickerVisible && !modify) {
        await setModify(false)
        await setValueFormatted(DateUtils.formatDateTimeToBr(date));
      }
    }

    dateForm(props.value).then()
  }, [props.value, value]);


  function onBlur() {
    validateRequired(props.value);
    validate(DateUtils.formatDateToUs(props.value));
    if (!error && !refMask.current?.isValid()) {
      setError(true);
      setErrorMessage('Formato de data inválido');
    }
  }

  function handleOpen() {
    setDatePickerVisible(true);
  }

  function handleClose() {
    setDatePickerVisible(false);
    setValue(null);
    validateRequired(null);
    validate('');
  }

  function handleConfirm(date: Date) {
    setDatePickerVisible(false);
    setValue(DateUtils.formatDateTimeToUs(date.toISOString()));
    refMask?.current?._inputElement.focus();
  }

  function validateRequired(date: Date | string | null) {
    if (props.validationDTO?.required && (date === null || date === '')) {
      setError(true);
      setErrorMessage('Este campo é obrigatório.');
    }
  }

  function validate(date: Date | string) {
    if (date !== '') {
      if (new Date(date).getTime() < new Date('1700-01-01').getTime()) {
        setError(true);
        setErrorMessage('A data deve ser maior ou igual a 01/01/1700');
      } else {
        setError(false);
        setErrorMessage('');
      }
    }
    if (!error && date && props.validationDTO?.validateCustom) {
      let retornoDTO = props.validationDTO.validateCustom(props.value);
      if (retornoDTO && retornoDTO.error) {
        setError(retornoDTO.error);
        setErrorMessage(retornoDTO.message);
      }
    }
  }

  return (
    <View style={props.style ? props.style : [styles.container, componentsStyles.container]}>
      <TouchableOpacity style={styles.textInput} onPress={handleOpen}>
        <View pointerEvents="none">
          <TextInput
            disabled={props.disabled}
            error={error}
            label={props.label + (props.validationDTO?.required ? ' *' : '')}
            mode='outlined'
            multiline={true}
            numberOfLines={1}
            onBlur={() => onBlur()}
            placeholder={props.placeholder}
            value={modify ? props.value : props.value ? valueFormatted : ''}
            render={props =>
              <TextInputMask style={styles.mask}
                             type={'datetime'}
                             options={{format: 'DD/MM/YYYY HH:mm'}}
                             onBlur={() => onBlur()}
                             onFocus={() => Keyboard.dismiss()}
                             ref={refMask}
                             value={modify ? props.value : props.value ? valueFormatted : ''}
              />
            }
          />
          <HelperTextOC
            text={errorMessage}
            visible={error}
          />
        </View>
      </TouchableOpacity>
      <IconButton
        style={{margin: 15}}
        iconColor={colors.icon}
        icon="calendar"
        onPress={handleOpen}
        size={sizes.icon}
      />
      <DateTimePicker
        locale={'pt-BR'}
        isVisible={datePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={handleClose}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center'
  },
  mask: {
    padding: 13,
    fontSize: 15
  },
  textInput: {
    width: '85%',
  },
});

export {InputTextDateOC, InputTextDateTimeOC};
