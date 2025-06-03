import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Dialog, Divider, IconButton, Portal, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HelperTextOC from '../helper-oc/HelperOC';
import manipuladorExcecoes from '../../services/ManipuladorExcecoes';
import {ObjetoUtilsService, ValoresEnums} from '../../services/ObjetoUtilsService';
import {componentsStyles} from '../../settings/GlobalStyle';
import {colors, sizes} from '../../settings/Settings';
import {ValidationDTO} from '../form-oc/ValidationDTO';
import {LoadingDialogOc} from '../loading-oc/LoadingOC';

function SelectDialogOC(props: {
                          typeEnum: any,
                          label: string,
                          value: string,
                          onSelect: ((item: ValoresEnums) => void),

                          items?: Array<ValoresEnums>
                          disabled?: boolean,
                          error?: boolean,
                          focus?: boolean,
                          validationDTO?: ValidationDTO,
                          helperText?: string,
                          style?: any
                        }
) {

  const [error, setError] = useState(props.error);
  const [errorMessage, setErrorMessage] = useState(props.helperText);
  const [icon, setIcon] = useState('arrow-down');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(props.items ? props.items : ObjetoUtilsService.enumToArrayValoresEnum(props.typeEnum));
  const [value, setValue] = useState(new ValoresEnums(props.value, ObjetoUtilsService.retornaValorEnum(props.value, props.typeEnum)));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setValue(new ValoresEnums(props.value, ObjetoUtilsService.retornaValorEnum(props.value, props.typeEnum)));

    if (items.length !== new Set(items).size) {
      manipuladorExcecoes.exib('Existem itens igual no select!');
    }
  }, [props.value]);

  function onBlur() {
    validateRequired();
  }

  function onFocus() {
    if (props.validationDTO?.required && (value == null || value.value === '') && error) {
      setError(false);
      setErrorMessage('');
    }
  }

  function handleOpen() {
    setVisible(!visible);
    setIcon(icon === 'arrow-down' ? 'arrow-up' : 'arrow-down');
    onFocus();
  }

  function handleClose() {
    setVisible(!visible);
    setIcon(icon === 'arrow-down' ? 'arrow-up' : 'arrow-down');
    validateRequired();
  }

  function handleSelect(item) {
    props.onSelect(item);
    setVisible(!visible);
    setIcon(icon === 'arrow-down' ? 'arrow-up' : 'arrow-down');
  }

  function validateRequired() {
    if (props.validationDTO?.required && (value.value == null || value.value === '')) {
      setError(true);
      setErrorMessage('Este campo é obrigatório');
    }
  }

  return (
    <View style={props.style ? props.style : componentsStyles.container}>
      <Portal>
        <Dialog
          style={styles.dialog}
          visible={visible}
          onDismiss={handleClose}>
          <View style={styles.viewTitle}>
            <Icon
              onPress={() => handleClose()}
              name={'arrow-back'}
              size={25}
            />
            <Text
              style={styles.title}
            >
              {props.label}
            </Text>
          </View>
          <LoadingDialogOc
            visible={loading}
          />
          <Divider style={styles.divider}/>
          <ScrollView>
            {
              items.map((item) => {
                return (
                  <TouchableOpacity
                    key={item.propriedade}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[value.propriedade === item.propriedade ? styles.itemSelect : styles.item, styles.titleStyle]}
                    >
                      {item.value}
                    </Text>
                    <Divider style={styles.divider}/>
                  </TouchableOpacity>
                );
              })
            }
          </ScrollView>
        </Dialog>
      </Portal>
      <TouchableOpacity
        style={styles.select}
        onPress={props.disabled ? () => {
        } : handleOpen}
        onFocus={() => onFocus()}
      >
        <TextInput
          editable={false}
          error={error}
          disabled={props.disabled}
          label={props.label + (props.validationDTO?.required ? ' *' : '')}
          multiline={false}
          mode='outlined'
          numberOfLines={1}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          style={[styles.textInput, componentsStyles.input]}
          value={value.value}
        />
        <IconButton
          icon={icon}
          color={colors.icon}
          size={sizes.icon}
          style={styles.iconButton}
        />
      </TouchableOpacity>
      <HelperTextOC
        text={errorMessage}
        visible={error}
      />
    </View>
  );
}

export {SelectDialogOC};

const styles = StyleSheet.create({
  dialog: {
    height: '100%',
    width: '100%',
    marginLeft: '0%',
    padding: 0
  },
  divider: {
    backgroundColor: '#e5e5e5',
    height: 1,
    margin: 2
  },
  iconButton: {
    paddingTop: 8,
    marginLeft: '-12%'
  },
  item: {
    backgroundColor: 'white'
  },
  itemSelect: {
    backgroundColor: '#f5f5f5'
  },
  titleStyle: {
    padding: 20,
    fontSize: sizes.fontSmall,
  },
  menu: {
    width: '90.5%',
    position: 'relative',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInput: {
    width: '100%',
  },
  viewTitle: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
  },
  title: {
    fontSize: sizes.fontMedium,
    marginLeft: 20,
    fontWeight: 'bold',
  },
});
