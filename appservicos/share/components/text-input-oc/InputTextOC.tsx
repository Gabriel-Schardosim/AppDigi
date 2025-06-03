import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {TextInputMask} from 'react-native-masked-text';

import HelperTextOC from '../helper-oc/HelperOC';
import {componentsStyles} from '../../settings/GlobalStyle';
import {Validator} from '../../services/Validator';
import {ValidationDTO} from '../form-oc/ValidationDTO';
import {StringUtilsService} from '../../services/StringUtilsService';

function InputTextOC(props: {
                       label: string,
                       value: string,
                       style?: any,
                       disabled?: boolean,
                       multiline?: boolean,
                       focus?: boolean,
                       error?: boolean,
                       numberLines?: number,
                       limitCharacters?: number,
                       placeholder?: string,
                       helperText?: string,
                       type?: 'password',
                       onChangeText?: ((textChange: string) => void),
                       onBlur?: (() => void),
                       onField?: ((able: any) => void),
                       validationDTO?: ValidationDTO,
                       refresh?: boolean,
                     }
) {

  const [error, setError] = useState(props.error);
  const [errorMessage, setErrorMessage] = useState(props.helperText);

  useEffect(() => {
    if (props.validationDTO) {
      validateRequired();
    }
  }, [props.refresh])

  function onBlur() {
    validateRequired();
    if (props.onBlur) {
      props.onBlur();
    }
  }

  function onFocus() {
    if (error) {
      setError(false);
      setErrorMessage('');
    }
  }

  function onChangeText(textChange: string) {
    if (props.onChangeText) {
      textChange = textChange ? textChange : '';
      if (props.limitCharacters) {
        if (!textChange || textChange.length <= props.limitCharacters) {
          props.onChangeText(textChange);
        }
      } else {
        props.onChangeText(textChange);
      }
    }
  }


  function validateRequired() {
    if (props.validationDTO?.required && (props.value == null || props.value.trim() === '')) {
      setError(true);
      setErrorMessage('Este campo é obrigatório');
    } else if (props.value != null && props.validationDTO?.validateCustom) {
      let retornoDTO = props.validationDTO.validateCustom(props.value);
      if (retornoDTO && retornoDTO.error) {
        setError(retornoDTO.error);
        setErrorMessage(retornoDTO.message);
      }
    }
  }

  return (
    <View style={props.style ? props.style : componentsStyles.container}>
      <TextInput
        error={error}
        disabled={props.disabled}
        label={props.label + (props.validationDTO?.required ? ' *' : '')}
        mode='outlined'
        multiline={props.multiline}
        numberOfLines={props.numberLines}
        placeholder={props.placeholder}
        onBlur={() => onBlur()}
        onChangeText={(textChange) => onChangeText(textChange)}
        onFocus={() => onFocus()}
        secureTextEntry={props.type === 'password'}
        style={[componentsStyles.input, props.multiline ? styles.multiline : false]}
        value={props.value?.toString()}
      />
      <HelperTextOC
        text={errorMessage}
        visible={error}
      />
    </View>
  );
}


function InputTextMaskOC(props: {
                           label: string,
                           value: string,
                           validationDTO: ValidationDTO,

                           style?: any,
                           disabled?: boolean,
                           multiline?: boolean,
                           focus?: boolean,
                           error?: boolean,
                           numberLines?: number,
                           minCharacters?: number,
                           limitCharacters?: number,
                           placeholder?: string,
                           helperText?: string,
                           onChangeText?: ((textChange: string) => void),
                           onBlur?: (() => void),
                           refresh?: boolean,
                         }
) {

  const [error, setError] = useState(props.error);
  const [errorMessage, setErrorMessage] = useState(props.helperText);
  const refMask = useRef<any>(null);

  useEffect(() => {
    if (props.validationDTO) {
      validate();
    }
  }, [props.refresh])

  function onBlur() {
    validate();
    if (props.onBlur) {
      props.onBlur();
    }
  }

  function onFocus() {
    if (error) {
      setError(false);
      setErrorMessage('');
    }
  }

  function onChangeText(textChange: string) {
    let text = textChange;
    switch (props.validationDTO?.type) {
      case "cpf":
        text = StringUtilsService.removeMascaraCpfCnpj(textChange);
        break;
      case "celular":
        text = StringUtilsService.removeMascaraTelefone(textChange);
        break;
      case "telefone":
        text = StringUtilsService.removeMascaraTelefone(textChange);
        break;
      case "cep":
        text = textChange ? textChange.replace('-', '') : '';
        break;
      case "email":
        text = textChange ? textChange.replace(' ', '') : '';
        break;
      default:
        break;
    }
    if (props.onChangeText) {
      text = text ? text : '';
      if (props.validationDTO?.type === "telefone") {
        if (!text || text.length <= 10) {
          props.onChangeText(text);
        }
      } else if (props.limitCharacters) {
        if (!text || text.length <= props.limitCharacters) {
          props.onChangeText(
            props.validationDTO?.type === "number"
              ? (Number(text) > 0 ? String(Number(text)) : '')
              : text
          );
        }
      } else {
        // props.onChangeText(props.validationDTO?.type === "number" ? (Number(text) > 0 ? Number(text) : null) : text);
        props.onChangeText(
          props.validationDTO?.type === "number"
            ? (Number(text) > 0 ? String(Number(text)) : '')
            : text
        );
      }
    }
  }

  function validate() {
    setError(false);
    setErrorMessage('');

    if (props.validationDTO.required && (props.value == null || props.value === '')) {
      setError(true);
      setErrorMessage('Este campo é obrigatório.');
    } else if (props.value != null) {
      if (props.validationDTO?.validateCustom) {
        let retornoDTO = props.validationDTO.validateCustom(props.value);
        if (retornoDTO && retornoDTO.error) {
          setError(retornoDTO.error);
          setErrorMessage(retornoDTO.message);
        }
      }
      if (props.validationDTO?.type != null) {
        let retornoDTO;
        switch (props.validationDTO.type) {
          case "cpf":
            retornoDTO = Validator.validaCpf(props.value);
            if (retornoDTO && retornoDTO.error) {
              setError(retornoDTO.error);
              setErrorMessage(retornoDTO.message);
            }
            break;
          case "cns":
            retornoDTO = Validator.validaCns(props.value);
            if (retornoDTO && retornoDTO.error) {
              setError(retornoDTO.error);
              setErrorMessage(retornoDTO.message);
            }
            break;
          case "cep":
            retornoDTO = Validator.validaCep(props.value);
            if (retornoDTO && retornoDTO.error) {
              setError(retornoDTO.error);
              setErrorMessage(retornoDTO.message);
            }
            break;
          case "email":
            retornoDTO = Validator.validaEmail(props.value);
            if (retornoDTO && retornoDTO.error) {
              setError(retornoDTO.error);
              setErrorMessage(retornoDTO.message);
            }
            break;
          case "celular":
            retornoDTO = Validator.validaCelular(StringUtilsService.removeMascaraTelefone(props.value));
            if (retornoDTO && retornoDTO.error) {
              setError(retornoDTO.error);
              setErrorMessage(retornoDTO.message);
            }
            break;
          case "telefone":
            retornoDTO = Validator.validaTelefone(StringUtilsService.removeMascaraTelefone(props.value));
            if (retornoDTO && retornoDTO.error) {
              setError(retornoDTO.error);
              setErrorMessage(retornoDTO.message);
            }
            break;
          default:
            break;
        }
      }
    }
  }

  return (
    <View style={props.style ? props.style : componentsStyles.container}>
      {
        props.validationDTO?.type === '' || props.validationDTO?.type === 'email' ?
          <TextInput
            mode='outlined'
            error={error}
            disabled={props.disabled}
            multiline={props.multiline}
            label={props.label + (props.validationDTO?.required ? ' *' : '')}
            numberOfLines={props.numberLines}
            placeholder={props.placeholder}
            onChangeText={(textChange) => onChangeText(textChange)}
            onBlur={() => onBlur()}
            onFocus={() => onFocus()}
            style={componentsStyles.input}
            value={props.value}
          />
          :
          <TextInput
            mode='outlined'
            error={error}
            disabled={props.disabled}
            multiline={props.multiline}
            label={props.label + (props.validationDTO?.required ? ' *' : '')}
            numberOfLines={props.numberLines}
            placeholder={props.placeholder}
            onChangeText={(textChange) => onChangeText(textChange)}
            onBlur={() => onBlur()}
            onFocus={() => onFocus()}
            style={componentsStyles.input}
            render={p =>
              props.validationDTO?.type === 'cpf' ?
                <TextInputMask
                  editable={!props.disabled}
                  onBlur={() => onBlur()}
                  onFocus={() => onFocus()}
                  onChangeText={(textChange) => onChangeText(textChange)}
                  ref={refMask}
                  style={[styles.mask, componentsStyles.input]}
                  type={'cpf'}
                  value={props.value}
                />
                :
                props.validationDTO?.type === 'cns' ?
                  <TextInputMask
                    editable={!props.disabled}
                    onBlur={() => onBlur()}
                    onChangeText={(textChange) => onChangeText(textChange)}
                    onFocus={() => onFocus()}
                    options={{
                      mask: '999999999999999'
                    }}
                    ref={refMask}
                    keyboardType={'numeric'}
                    style={[styles.mask, componentsStyles.input]}
                    type={'custom'}
                    value={props.value}
                  /> :
                  props.validationDTO?.type === 'cep' ?
                    <TextInputMask
                      editable={!props.disabled}
                      onBlur={() => onBlur()}
                      onChangeText={(textChange) => onChangeText(textChange)}
                      onFocus={() => onFocus()}
                      options={{
                        mask: '99999-999'
                      }}
                      keyboardType={'numeric'}
                      ref={refMask}
                      style={styles.mask}
                      type={'custom'}
                      value={props.value ? props.value : ''}
                    /> :
                    props.validationDTO?.type === 'celular' || props.validationDTO?.type === 'telefone' ?
                      <TextInputMask
                        editable={!props.disabled}
                        onBlur={() => onBlur()}
                        onChangeText={(textChange) => onChangeText(textChange)}
                        onFocus={() => onFocus()}
                        options={{
                          maskType: 'BRL',
                          withDDD: true,
                          dddMask: '(99) '
                        }}
                        ref={refMask}
                        style={styles.mask}
                        type={'cel-phone'}
                        value={props.value ? props.value : ''}
                      />
                      :
                      props.validationDTO?.type === 'number' ?
                        <TextInputMask
                          editable={!props.disabled}
                          onBlur={() => onBlur()}
                          onChangeText={(textChange) => onChangeText(textChange)}
                          onFocus={() => onFocus()}
                          ref={refMask}
                          style={[styles.mask, componentsStyles.input]}
                          type={'only-numbers'}
                          value={props.value?.toString()}
                        />
                        : props.validationDTO?.type === 'custom' || props.validationDTO?.type === 'custom-numeric' ?
                        <TextInputMask
                          editable={!props.disabled}
                          onBlur={() => onBlur()}
                          onChangeText={(textChange) => onChangeText(textChange)}
                          onFocus={() => onFocus()}
                          ref={refMask}
                          keyboardType={props.validationDTO?.type === 'custom-numeric' ? 'numeric' : 'default'}
                          style={[styles.mask, componentsStyles.input]}
                          options={{
                            mask: props.validationDTO?.maskCustom
                          }}
                          type={'custom'}
                          value={props.value}
                        />
                        : false
            }
            value={props.value?.toString()}
          />

      }
      <HelperTextOC
        text={errorMessage}
        visible={error}
      />
    </View>
  );
}

export {InputTextOC, InputTextMaskOC};

const styles = StyleSheet.create({
  multiline: {
    height: 0
  },
  mask: {
    padding: 10,
    fontSize: 15
  }
});
