import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import HelperTextOC from '../helper-oc/HelperOC';
import {TextInputMask} from 'react-native-masked-text';
import {componentsStyles} from '../../settings/GlobalStyle';
import {RetornoDTO} from '../../models/objects/RetornoDTO';
import {Validator} from '../../services/Validator';
import {ValidationDTO} from "../form-oc/ValidationDTO";
import {StringUtilsService} from '../../services/StringUtilsService';

function InputTextMaskDateOC(props: {
                                 label: string,
                                 value: string,

                                 style?: any,
                                 disabled?: boolean,
                                 multiline?: boolean,
                                 focus?: boolean,
                                 error?: boolean,
                                 required?: boolean,
                                 numberLines?: number,
                                 limitCharacters?: number,
                                 placeholder?: string,
                                 helperText?: string,
                                 onChangeText?: ((textChange) => void),
                                 validateCustom?: ((object) => RetornoDTO)
                             }
) {

    const [error, setError] = useState(props.error);
    const [errorMessage, setErrorMessage] = useState(props.helperText);


    const refMask = useRef<any>(null);

    function onBlur() {
        validateRequired();
        validate();
    }

    function onFocus() {
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }

    function onChangeText(textChange) {
        if (props.onChangeText) {
            if (props.limitCharacters) {
                if (textChange.length <= props.limitCharacters) {
                    props.onChangeText(textChange);
                }
            } else {
                props.onChangeText(textChange);
            }
        }
    }


    function validateRequired() {
        if (props.required && (props.value == null || props.value === '')) {
            setError(true);
            setErrorMessage('Este campo é obrigatório.');
        }
    }

    function validate() {
        if (props.value !== '') {
            if (!refMask.current?.isValid() || props.value.length != 10) {
                setError(true);
                setErrorMessage('Formato de data inválido');
            } else if (new Date(props.value).getTime() < new Date('1700-01-01').getTime()) {
                setError(true);
                setErrorMessage('A data deve ser maior ou igual a 01/01/1700');
            } else {
                setError(false);
                setErrorMessage('');
            }
        }

        if (!error) {
            let retornoDTO = props.validateCustom ? props.validateCustom(props.value) : false;
            if (retornoDTO && retornoDTO.error) {
                setError(retornoDTO.error);
                setErrorMessage(retornoDTO.message);
            }
        }
    }

    return (
        <View style={props.style ? props.style : componentsStyles.container}>
            <TextInput
                disabled={props.disabled}
                error={error}
                label={props.label + (props.required ? ' *' : '')}
                mode='outlined'
                multiline={props.multiline}
                numberOfLines={props.numberLines}
                onBlur={() => onBlur()}
                onChangeText={(textChange) => onChangeText(textChange)}
                onFocus={() => onFocus()}
                placeholder={props.placeholder}
                render={props =>
                    <TextInputMask style={styles.mask}
                                   type={'datetime'}
                                   options={{
                                       format: 'DD/MM/YYYY'
                                   }}
                                   onBlur={() => onBlur()}
                                   onFocus={() => onFocus()}
                                   ref={refMask}
                                   value={props.value}
                                   onChangeText={(textChange) => onChangeText(textChange)}
                    />
                }
                value={props.value}
            />
            <HelperTextOC
                text={errorMessage}
                visible={error}
            />
        </View>
    );
}


function InputTextMaskDateTimeOC(props: {
                                     label: string,
                                     value: string,

                                     style?: any,
                                     disabled?: boolean,
                                     multiline?: boolean,
                                     focus?: boolean,
                                     error?: boolean,
                                     required?: boolean,
                                     numberLines?: number,
                                     limitCharacters?: number,
                                     placeholder?: string,
                                     helperText?: string,
                                     onChangeText?: ((textChange) => void),
                                 }
) {

    const [error, setError] = useState(props.error);
    const [errorMessage, setErrorMessage] = useState(props.helperText);

    const refMask = useRef<any>(null);

    function onBlur() {
        validateRequired();
        valid();
    }


    function onFocus() {
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }

    function onChangeText(textChange) {
        if (props.onChangeText) {
            if (props.limitCharacters) {
                if (textChange.length <= props.limitCharacters) {
                    props.onChangeText(textChange);
                }
            } else {
                props.onChangeText(textChange);
            }
        }
    }


    function validateRequired() {
        if (props.required && (props.value == null || props.value === '')) {
            setError(true);
            setErrorMessage('Este campo é obrigatório.');
        }
    }


    function valid() {
        if (props.value !== '') {
            if (!refMask.current?.isValid() || props.value.length != 16) {
                setError(true);
                setErrorMessage('Formato de data inválido');
            } else if (new Date(props.value).getTime() < new Date('1700-01-01').getTime()) {
                setError(true);
                setErrorMessage('A data deve ser maior ou igual a 01/01/1700');
            } else {
                setError(false);
                setErrorMessage('');
            }
        }
    }

    return (
        <View style={props.style ? props.style : componentsStyles.container}>
            <TextInput disabled={props.disabled}
                       error={error}
                       label={props.label + (props.required ? ' *' : '')}
                       mode='outlined'
                       multiline={props.multiline}
                       numberOfLines={props.numberLines}
                       onBlur={() => onBlur()}
                       onChangeText={(textChange) => onChangeText(textChange)}
                       onFocus={() => onFocus()}
                       placeholder={props.placeholder}
                       render={props =>
                           <TextInputMask style={styles.mask}
                                          type={'datetime'}
                                          options={{
                                              format: 'DD/MM/YYYY HH:mm'
                                          }}
                                          onBlur={() => onBlur()}
                                          onFocus={() => onFocus()}
                                          ref={refMask}
                                          value={props.value?.toString()}
                                          onChangeText={(textChange) => onChangeText(textChange)}
                           />
                       }
                       value={props.value}

            />
            <HelperTextOC
                text={errorMessage}
                visible={error}
            />
        </View>
    );
}

function InputTextMaskCpfOC(props: {
                                label: string,
                                value: string,

                                style?: any,
                                disabled?: boolean,
                                multiline?: boolean,
                                focus?: boolean,
                                error?: boolean,
                                required?: boolean,
                                numberLines?: number,
                                limitCharacters?: number,
                                placeholder?: string,
                                helperText?: string,
                                onChangeText?: ((textChange) => void),
                            }
) {

    const [error, setError] = useState(props.error ? props.error : false);
    const [errorMessage, setErrorMessage] = useState(props.helperText);

    const refMask = useRef<any>(null);

    function onBlur() {
        validate();
    }

    function onFocus() {
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }

    function onChangeText(textChange) {
        if (props.onChangeText) {
            if (props.limitCharacters) {
                if (textChange.length <= props.limitCharacters) {
                    props.onChangeText(StringUtilsService.removeMascaraCpfCnpj(textChange));
                }
            } else {
                props.onChangeText(StringUtilsService.removeMascaraCpfCnpj(textChange));
            }
        }
    }


    function validate() {
        setError(false);
        setErrorMessage('');

        let retornoDTO = Validator.validaCpf(props.value);
        if (props.required && (props.value == null || props.value === '')) {
            setError(true);
            setErrorMessage('Este campo é obrigatório.');
        } else if (retornoDTO && retornoDTO.error) {
            setError(retornoDTO.error);
            setErrorMessage(retornoDTO.message);
        }
    }

    return (
        <View style={props.style ? props.style : componentsStyles.container}>
            <TextInput
                mode='outlined'
                error={error}
                disabled={props.disabled}
                multiline={props.multiline}
                label={props.label + (props.required ? ' *' : '')}
                numberOfLines={props.numberLines}
                placeholder={props.placeholder}
                onChangeText={(textChange) => onChangeText(textChange)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                style={componentsStyles.input}
                render={props =>
                    <TextInputMask
                        onBlur={() => onBlur()}
                        onFocus={() => onFocus()}
                        onChangeText={(textChange) => onChangeText(textChange)}
                        ref={refMask}
                        style={[styles.mask, componentsStyles.input]}
                        type={'cpf'}
                        value={props.value}
                    />
                }
                value={props.value}

            />
            <HelperTextOC
                text={errorMessage}
                visible={error}
            />
        </View>
    );
}

function InputTextMaskCpfCnpjOC(props: {
                                    label: string,
                                    value: string,

                                    style?: any,
                                    disabled?: boolean,
                                    multiline?: boolean,
                                    focus?: boolean,
                                    error?: boolean,
                                    required?: boolean,
                                    numberLines?: number,
                                    limitCharacters?: number,
                                    placeholder?: string,
                                    helperText?: string,
                                    onChangeText?: ((textChange) => void),
                                }
) {

    const [error, setError] = useState(props.error);
    const [errorMessage, setErrorMessage] = useState(props.helperText);
    const [initial, setInitial] = useState(true);
    const [type, setType] = useState<'cpf' | 'cnpj'>('cpf');

    const refMask = useRef<any>(null);

    useEffect(() => {
        if (initial && props.value && props.value !== '') {
            setInitial(false);
            onChangeText(props.value);
        }
    }, [props.value]);

    function onBlur() {
        validateRequired();
        validate();
    }

    function onFocus() {
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }

    function onChangeText(textChange) {
        if (props.onChangeText) {
            if (props.limitCharacters) {
                if (textChange.length <= props.limitCharacters) {
                    props.onChangeText(StringUtilsService.removeMascaraCpfCnpj(textChange));
                }
            } else {
                props.onChangeText(StringUtilsService.removeMascaraCpfCnpj(textChange));
            }
        }
    }


    function validateRequired() {
        if (props.required && (props.value == null || props.value === '')) {
            setError(true);
            setErrorMessage('Este campo é obrigatório.');
        }
    }

    function validate() {
        if (!refMask.current?.isValid()) {
            setError(true);
            setErrorMessage('O CPF/CNPJ informado é inválido.');
        }
    }

    async function alterType(type: 'cpf' | 'cnpj') {
        await setType(type);
    }

    return (
        <View style={props.style ? props.style : componentsStyles.container}>
            <TextInput
                mode='outlined'
                error={error}
                multiline={props.multiline}
                label={props.label + (props.required ? ' *' : '')}
                numberOfLines={props.numberLines}
                placeholder={props.placeholder}
                onChangeText={(textChange) => onChangeText(textChange)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                style={componentsStyles.input}
                render={p =>
                    <TextInputMask
                        editable={!props.disabled}
                        onBlur={() => onBlur()}
                        onChangeText={(textChange) => onChangeText(textChange)}
                        onFocus={() => onFocus()}
                        ref={refMask}
                        style={[styles.mask, componentsStyles.input]}
                        type={'custom'}
                        keyboardType={'numeric'}
                        options={{
                            mask: type === 'cpf' ? '999.999.999-999' : '99.999.999/9999-99'
                        }}
                        value={props.value}
                        checkText={
                            (previous, next) => {
                                if (next.length > 14) {
                                    alterType('cnpj');
                                } else {
                                    alterType('cpf');
                                }
                                return true;
                            }
                        }
                    />
                }
                value={props.value}

            />
            <HelperTextOC
                text={errorMessage}
                visible={error}
            />
        </View>
    );
}

function InputTextMaskCnsOC(props: {
                                label: string,
                                value: string,

                                style?: any,
                                disabled?: boolean,
                                multiline?: boolean,
                                focus?: boolean,
                                error?: boolean,
                                required?: boolean,
                                numberLines?: number,
                                limitCharacters?: number,
                                placeholder?: string,
                                helperText?: string,
                                onChangeText?: ((textChange) => void),
                            }
) {

    const [error, setError] = useState(props.error);
    const [errorMessage, setErrorMessage] = useState(props.helperText);

    const refMask = useRef<any>(null);

    function onBlur() {
        validate();
    }

    function onFocus() {
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }

    function onChangeText(textChange) {
        if (props.onChangeText) {
            if (props.limitCharacters) {
                if (textChange.length <= props.limitCharacters) {
                    props.onChangeText(textChange);
                }
            } else {
                props.onChangeText(textChange);
            }
        }
    }


    function validate() {
        setError(false);
        setErrorMessage('');

        let retornoDTO = Validator.validaCns(props.value);
        if (props.required && (props.value == null || props.value === '')) {
            setError(true);
            setErrorMessage('Este campo é obrigatório.');
        } else if ((props.value !== null && props.value !== '') && retornoDTO && retornoDTO.error) {
            setError(retornoDTO.error);
            setErrorMessage(retornoDTO.message);
        }
    }

    return (
        <View style={props.style ? props.style : componentsStyles.container}>
            <TextInput
                mode='outlined'
                error={error}
                disabled={props.disabled}
                multiline={props.multiline}
                label={props.label + (props.required ? ' *' : '')}
                numberOfLines={props.numberLines}
                placeholder={props.placeholder}
                onChangeText={(textChange) => onChangeText(textChange)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                style={componentsStyles.input}
                render={props =>
                    <TextInputMask
                        onBlur={() => onBlur()}
                        onChangeText={(textChange) => onChangeText(textChange)}
                        onFocus={() => onFocus()}
                        options={{
                            mask: '999999999999999'
                        }}
                        ref={refMask}
                        style={[styles.mask, componentsStyles.input]}
                        type={'custom'}
                        value={props.value}
                    />
                }
                value={props.value}

            />
            <HelperTextOC
                text={errorMessage}
                visible={error}
            />
        </View>
    );
}

function InputTextMaskCepOC(props: {
                                label: string,
                                value: string,

                                style?: any,
                                disabled?: boolean,
                                multiline?: boolean,
                                focus?: boolean,
                                error?: boolean,
                                required?: boolean,
                                numberLines?: number,
                                limitCharacters?: number,
                                placeholder?: string,
                                helperText?: string,
                                onChangeText?: ((textChange) => void),
                            }
) {

    const [error, setError] = useState(props.error ? props.error : false);
    const [errorMessage, setErrorMessage] = useState(props.helperText);

    const refMask = useRef<any>(null);

    function onBlur() {
        validate();
    }

    function onFocus() {
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }

    function onChangeText(textChange) {
        if (props.onChangeText) {
            if (props.limitCharacters) {
                if (textChange.length <= props.limitCharacters) {
                    props.onChangeText(textChange);
                }
            } else {
                props.onChangeText(textChange);
            }
        }
    }


    function validate() {
        setError(false);
        setErrorMessage('');

        let retornoDTO = Validator.validaCep(props.value);
        if (props.required && (props.value == null || props.value === '')) {
            setError(true);
            setErrorMessage('Este campo é obrigatório.');
        } else if ((props.value !== null && props.value !== '') && retornoDTO && retornoDTO.error) {
            setError(retornoDTO.error);
            setErrorMessage(retornoDTO.message);
        }
    }

    return (
        <View style={props.style ? props.style : componentsStyles.container}>
            <TextInput
                mode='outlined'
                error={error}
                disabled={props.disabled}
                multiline={props.multiline}
                label={props.label + (props.required ? ' *' : '')}
                numberOfLines={props.numberLines}
                placeholder={props.placeholder}
                onChangeText={(textChange) => onChangeText(textChange)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                render={props =>
                    <TextInputMask
                        onBlur={() => onBlur()}
                        onChangeText={(textChange) => onChangeText(textChange)}
                        onFocus={() => onFocus()}
                        options={{
                            mask: '99999-999'
                        }}
                        ref={refMask}
                        style={styles.mask}
                        type={'custom'}
                        value={props.value ? props.value : ''}
                    />
                }
                value={props.value ? props.value : ''}

            />
            <HelperTextOC
                text={errorMessage}
                visible={error}
            />
        </View>
    );
}

function InputTextMaskEmailOC(props: {
                                  label: string,
                                  value: string,

                                  style?: any,
                                  disabled?: boolean,
                                  multiline?: boolean,
                                  focus?: boolean,
                                  error?: boolean,
                                  required?: boolean,
                                  numberLines?: number,
                                  limitCharacters?: number,
                                  placeholder?: string,
                                  helperText?: string,
                                  onChangeText?: ((textChange) => void),
                              }
) {

    const [error, setError] = useState(props.error ? props.error : false);
    const [errorMessage, setErrorMessage] = useState(props.helperText);

    const refMask = useRef<any>(null);

    function onBlur() {
        validate();
    }

    function onFocus() {
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }

    function onChangeText(textChange) {
        if (props.onChangeText) {
            if (props.limitCharacters) {
                if (textChange.length <= props.limitCharacters) {
                    props.onChangeText(textChange);
                }
            } else {
                props.onChangeText(textChange);
            }
        }
    }


    function validate() {
        setError(false);
        setErrorMessage('');

        let retornoDTO = Validator.validaEmail(props.value);
        if (props.required && (props.value == null || props.value === '')) {
            setError(true);
            setErrorMessage('Este campo é obrigatório.');
        } else if ((props.value !== null && props.value !== '') && retornoDTO && retornoDTO.error) {
            setError(retornoDTO.error);
            setErrorMessage(retornoDTO.message);
        }
    }

    return (
        <View style={props.style ? props.style : componentsStyles.container}>
            <TextInput
                mode='outlined'
                error={error}
                disabled={props.disabled}
                multiline={props.multiline}
                label={props.label + (props.required ? ' *' : '')}
                numberOfLines={props.numberLines}
                placeholder={props.placeholder}
                onChangeText={(textChange) => onChangeText(textChange)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                value={props.value ? props.value : ''}
            />
            <HelperTextOC
                text={errorMessage}
                visible={error}
            />
        </View>
    );
}


function InputTextMaskCelularOC(props: {
                                    label: string,
                                    value: string,

                                    style?: any,
                                    disabled?: boolean,
                                    multiline?: boolean,
                                    focus?: boolean,
                                    error?: boolean,
                                    required?: boolean,
                                    numberLines?: number,
                                    limitCharacters?: number,
                                    placeholder?: string,
                                    helperText?: string,
                                    onChangeText?: ((textChange) => void),
                                }
) {

    const [error, setError] = useState(props.error ? props.error : false);
    const [errorMessage, setErrorMessage] = useState(props.helperText);

    const refMask = useRef<any>(null);

    function onBlur() {
        validate();
    }

    function onFocus() {
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }

    function onChangeText(textChange) {
        if (props.onChangeText) {
            if (props.limitCharacters) {
                if (textChange.length <= props.limitCharacters) {
                    props.onChangeText(StringUtilsService.removeMascaraTelefone(textChange));
                }
            } else {
                props.onChangeText(StringUtilsService.removeMascaraTelefone(textChange));
            }
        }
    }


    function validate() {
        setError(false);
        setErrorMessage('');

        let retornoDTO = Validator.validaCelular(StringUtilsService.removeMascaraTelefone(props.value));
        if (props.required && (props.value == null || props.value === '')) {
            setError(true);
            setErrorMessage('Este campo é obrigatório.');
        } else if ((props.value !== null && props.value !== '') && retornoDTO && retornoDTO.error) {
            setError(retornoDTO.error);
            setErrorMessage(retornoDTO.message);
        }
    }

    return (
        <View style={props.style ? props.style : componentsStyles.container}>
            <TextInput
                mode='outlined'
                error={error}
                keyboardType='numeric'
                disabled={props.disabled}
                multiline={props.multiline}
                label={props.label + (props.required ? ' *' : '')}
                numberOfLines={props.numberLines}
                placeholder={props.placeholder}
                onChangeText={(textChange) => onChangeText(textChange)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                render={props =>
                    <TextInputMask
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
                }
                value={props.value ? props.value : ''}

            />
            <HelperTextOC
                text={errorMessage}
                visible={error}
            />
        </View>
    );
}


function InputTextMaskNumberOC(props: {
                                   label: string,
                                   value: string,

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
                                   onChangeText?: ((textChange) => void),
                                   validationDTO: ValidationDTO,
                               }
) {

    const [error, setError] = useState(props.error);
    const [errorMessage, setErrorMessage] = useState(props.helperText);

    const refMask = useRef<any>(null);

    function onBlur() {
        validate();
    }

    function onFocus() {
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }

    function onChangeText(textChange) {
        if (props.onChangeText) {
            if (props.limitCharacters) {
                if (textChange.length <= props.limitCharacters) {
                    props.onChangeText(textChange);
                }
            } else {
                props.onChangeText(textChange);
            }
        }
    }


    function validate() {
        setError(false);
        setErrorMessage('');

        if (props.validationDTO.required && (props.value == null || props.value === '')) {
            setError(true);
            setErrorMessage('Este campo é obrigatório.');
        } else if (props.minCharacters && props.value != null && Validator.validaMinimo(props.value, props.minCharacters).error) {
            setError(true);
            setErrorMessage('O mínimo para este campo é de ' + props.minCharacters + ' caractere(s).');
        }
    }

    return (
        <View style={props.style ? props.style : componentsStyles.container}>
            <TextInput
                mode='outlined'
                error={error}
                disabled={props.disabled}
                multiline={props.multiline}
                label={props.label + (props.validationDTO.required ? ' *' : '')}
                numberOfLines={props.numberLines}
                placeholder={props.placeholder}
                onChangeText={(textChange) => onChangeText(textChange)}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                style={componentsStyles.input}
                render={p =>
                    <TextInputMask
                        onBlur={() => onBlur()}
                        onChangeText={(textChange) => onChangeText(textChange)}
                        onFocus={() => onFocus()}
                        ref={refMask}
                        style={[styles.mask, componentsStyles.input]}
                        type={'only-numbers'}
                        value={props.value}
                    />
                }
                value={props.value}

            />
            <HelperTextOC
                text={errorMessage}
                visible={error}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    mask: {
        padding: 13,
        fontSize: 15
    }
});
export {
    InputTextMaskDateOC,
    InputTextMaskDateTimeOC,
    InputTextMaskCpfOC,
    InputTextMaskCpfCnpjOC,
    InputTextMaskCnsOC,
    InputTextMaskCepOC,
    InputTextMaskEmailOC,
    InputTextMaskCelularOC,
    InputTextMaskNumberOC
};
