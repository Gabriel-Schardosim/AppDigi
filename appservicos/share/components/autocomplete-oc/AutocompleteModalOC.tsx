import React, {useEffect, useState} from 'react';
import {Dialog, Divider, Portal, TextInput} from 'react-native-paper';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HelperTextOC from '../helper-oc/HelperOC';
import {ObjetoUtilsService} from '../../services/ObjetoUtilsService';
import {DadosPaginados, TamanhoDaPagina} from '../../models/objects/DadosPaginados';
import {Column} from '../../models/objects/Column';
import {LoadingDialogOc} from '../loading-oc/LoadingOC';
import ServiceGenerico from '../../services/ServiceGenerico';
import {componentsStyles} from '../../settings/GlobalStyle';
import {colors, sizes} from '../../settings/Settings';
import DialogOC from '../dialog-oc/DialogOC';
import ChipOC from '../chip-oc/ChipOC';
import {InfiniteScrollOC} from '../infinite-scroll-oc/InfiniteScrollOC';
import {Order, SortDirection} from '../data-table-oc/Order';
import {ValidationDTO} from '../form-oc/ValidationDTO';
import manipuladorExcecoes from '../../services/ManipuladorExcecoes';
import {StringUtilsService} from '../../services/StringUtilsService';

const MINIMO_CARACTER_PESQUISA = 3;
const CARACTER_SEPARADOR_PESQUISA = ',';

function AutocompleteModalOC(props: {
                               class: any,
                               arrayColumns: Array<Column>,
                               defaultOrder?: Order,
                               value: any,
                               service: ServiceGenerico<any>,
                               allowInactive?: boolean,
                               label: string,
                               onClose: (() => void),
                               onSelect: ((item) => void),

                               formataExibicao?: Function,
                               style?: any,
                               autocomplete?: boolean,
                               disabled?: boolean,
                               error?: boolean,
                               helperText?: string,
                               title?: string,
                               filter?: string,
                               validationDTO?: ValidationDTO,
                               usaFiltroConcatenado?: boolean,
                               sizePage?: TamanhoDaPagina,
                             },
) {

  const [error, setError] = useState(props.error);
  const [errorMessage, setErrorMessage] = useState(props.helperText);
  const [select, setSelect] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (props.value != null && JSON.stringify(props.value) !== '{}') {
      setSelect(true);
    } else {
      setSelect(false);
    }
  }, [props.value])

  useEffect(() => {
    if (props.disabled) {
      setVisible(false);
      setError(false);
      setErrorMessage('');
    }
  }, [props.disabled])

  function onClose() {
    setSelect(false);
    setVisible(false);
    props.onClose();
    validateRequired(true);
  }

  function onFocus() {
    if (error) {
      setError(false);
      setErrorMessage('');
    }
  }

  function onOpen() {
    if (!select) {
      setVisible(true);
    }
    onFocus();
  }

  function onSelect(item) {
    setSelect(true);
    setVisible(false);
    props.onSelect(item);
    onFocus();
  }

  function handleTitle(item): string {
    let title = '';
    props.arrayColumns.forEach((column) => {
      if (column.main) {
        let value = ObjetoUtilsService.percorreCaminhoObjeto(item, column.path);
        if (value != null) {
          title += (title !== '' ? ' - ' : '') + value.toUpperCase();
        }
      }
    });
    return title;
  }

  function validateRequired(select) {
    if (props.validationDTO?.required && select) {
      setError(true);
      setErrorMessage('Este campo é obrigatório');
    }
  }

  return (
    <View style={props.style ? props.style : componentsStyles.container}>
      <TouchableOpacity
        style={styles.container}
        onPress={props.disabled ? () => {
        } : select ? onClose : onOpen}
      >
        <TextInput
          editable={false}
          error={error}
          label={props.label + (props.validationDTO?.required ? ' *' : '')}
          mode='outlined'
          multiline={false}
          disabled={props.disabled}
          numberOfLines={1}
          style={[styles.textInput, componentsStyles.input]}
          value={select ? handleTitle(props.value) : ''}
        />
        {
          props.disabled == null || !props.disabled ?
            select ?
              <Icon
                name={'clear'}
                size={sizes.icon}
                onPress={onClose}
                color={colors.icon}
                style={styles.icon}
              /> :
              <Icon
                name={'search'}
                size={sizes.icon}
                color={colors.icon}
                style={styles.icon}
              />
            : false
        }
      </TouchableOpacity>

      <ModalAutocompleteOC
        visible={visible}
        autocomplete={props.autocomplete}
        class={props.class}
        service={props.service}
        allowInactive={props.allowInactive}
        label={props.label}
        title={props.title}
        filter={props.filter}
        formataExibicao={props.formataExibicao}
        onSelect={(item) => onSelect(item)}
        onClose={onClose}
        arrayColumns={props.arrayColumns}
        defaultOrder={props.defaultOrder}
        usaFiltroConcatenado={props.usaFiltroConcatenado}
        sizePage={props.sizePage}
      />

      <HelperTextOC
        text={errorMessage}
        visible={error}
      />
    </View>
  );
}

function AutocompleteMultipleModalOC(props: {
                                       class: any,
                                       arrayColumns: Array<Column>,
                                       defaultOrder?: Order,
                                       value: Array<any>,
                                       service: ServiceGenerico<any>,
                                       label: string,
                                       onClose: ((item) => void),
                                       onSelect: ((item) => void),
                                       sizePage?: TamanhoDaPagina,

                                       formataExibicao?: Function,
                                       allowInactive?: boolean,
                                       style?: any,
                                       autocomplete?: boolean,
                                       error?: boolean,
                                       injetaPath?: boolean,
                                       disabled?: boolean,
                                       helperText?: string,
                                       title?: string,
                                       filter?: string,
                                       validationDTO?: ValidationDTO,
                                       usaFiltroConcatenado?: boolean,
                                     },
) {

  const [error, setError] = useState(props.error);
  const [errorMessage, setErrorMessage] = useState(props.helperText);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (props.disabled) {
      setVisible(false);
      setError(false);
      setErrorMessage('');
      props.value?.forEach(item => {
        props.onClose(item);
      })
    }
  }, [props.disabled])

  function onClose() {
    setVisible(false);
    validateRequired(props.value?.length);
    validate();
  }

  function onFocus() {
    if (error) {
      setError(false);
      setErrorMessage('');
    }
  }

  function onOpen() {
    let filtro = props.filter ? props.filter : '';
    if (props.value?.length > 0) {
      props.value?.forEach(value => {
        filtro += filtro ? ' and ' : '';
        filtro += 'id <> ' + value[StringUtilsService.firstLetterLower(props.class.className)].id;
      });
    }

    setFilter(filtro);
    setVisible(true);
    onFocus();
  }

  function onSelect(item) {
    setVisible(false);
    props.onSelect(item);
    onFocus();
  }

  function onCloseChip(item) {
    props.onClose(item);
    validateRequired(props.value?.length - 1);
    validate();
  }

  function handleTitle(item) {
    let column = props.arrayColumns.filter((column) => column.main)[0];
    let path = column.path;
    if (props.injetaPath) {
      path = StringUtilsService.firstLetterLower(props.class.className) + '.' + column.path;
    }
    return ObjetoUtilsService.percorreCaminhoObjeto(item, path);
  }

  function handleLine(item, path) {
    if (props.injetaPath) {
      path = StringUtilsService.firstLetterLower(props.class.className) + '.' + path;
    }
    return ObjetoUtilsService.percorreCaminhoObjeto(item, path);
  }

  function validateRequired(size) {
    if (props.validationDTO?.required && size <= 0) {
      setError(true);
      setErrorMessage('Este campo é obrigatório');
    }
  }

  function validate() {
    if (props.validationDTO?.required && (props.value == null || props.value.length === 0)) {
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
      <TouchableOpacity
        style={styles.container}
        onPress={onOpen}
      >
        <TextInput
          editable={false}
          error={error}
          label={props.label + (props.validationDTO?.required ? ' *' : '')}
          mode='outlined'
          disabled={props.disabled}
          multiline={false}
          numberOfLines={1}
          style={[styles.textInput, componentsStyles.input]}
          value={handleTitle(props.value) ? handleTitle(props.value) : ''}
        />
        <Icon
          name={'search'}
          size={25}
          color={colors.icon}
          style={styles.icon}
        />
      </TouchableOpacity>
      {
        props.value?.length > 0 ?
          <View style={styles.select}>
            {
              props.value.map((item) => {
                return (
                  <ChipOC
                    focus={true}
                    key={String(handleLine(item, 'id'))}
                    limitText={20}
                    multiple={true}
                    onClose={() => onCloseChip(item)}
                    style={styles.chipMultiple}
                    text={handleTitle(item)}
                  />
                );
              })
            }
          </View>
          : false
      }

      <ModalAutocompleteOC
        autocomplete={props.autocomplete}
        visible={visible}
        class={props.class}
        service={props.service}
        label={props.label}
        allowInactive={props.allowInactive}
        formataExibicao={props.formataExibicao}
        title={props.title}
        filter={filter}
        onSelect={(item) => onSelect(item)}
        onClose={onClose}
        arrayColumns={props.arrayColumns}
        sizePage={props.sizePage}
        value={props.value}
        defaultOrder={props.defaultOrder}
        usaFiltroConcatenado={props.usaFiltroConcatenado}
      />

      <HelperTextOC
        text={errorMessage}
        visible={error}
      />
    </View>
  );
}


function ModalAutocompleteOC(props: {
                               class: any,
                               arrayColumns: Array<Column>,
                               defaultOrder?: Order,
                               visible: boolean,
                               service: ServiceGenerico<any>,
                               label: string,
                               onClose: (() => void),
                               onSelect: ((item) => void),
                               formataExibicao?: Function,
                               allowInactive?: boolean,
                               value?: Array<any>,
                               autocomplete?: boolean,
                               dialogConfirm?: boolean,
                               title?: string,
                               filter?: string,
                               usaFiltroConcatenado?: boolean,
                               cartType?: 'normal' | 'person',
                               sizePage?: TamanhoDaPagina,
                               onConfirm?: (() => void),
                               onCancel?: (() => void),
                             }
) {

  const [dadosPaginados, setDadosPaginados] = useState<DadosPaginados<any>>(new DadosPaginados());
  const [text, setText] = useState('');
  const [textAnt, setTextAnt] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<Order>(props.defaultOrder ? props.defaultOrder : new Order(SortDirection.Asc, props.arrayColumns.filter((column) => column.main)[0]));
  const [page, setPage] = useState(0);
  const [sizePage, setSizePage] = useState(props.sizePage ? props.sizePage : TamanhoDaPagina.t10);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (props.visible) {
      setText('');
      setPage(0);
      setDadosPaginados(new DadosPaginados());
      get(true).then();
    }
  }, [props.visible]);

  useEffect(() => {
    setLoading(false);
  }, [dadosPaginados]);

  useEffect(() => {
    if (refreshing) {
      setPage(0);
      setDadosPaginados(new DadosPaginados());
      get(true).then();
    }
  }, [refreshing]);

  useEffect(() => {
    if (!loading) {
      if (text?.length < MINIMO_CARACTER_PESQUISA && textAnt?.length >= MINIMO_CARACTER_PESQUISA) {
        setPage(0);
        setDadosPaginados(new DadosPaginados());
        get(true).then();
      } else if (text?.length >= MINIMO_CARACTER_PESQUISA) {
        setPage(0);
        setDadosPaginados(new DadosPaginados());
        get(true).then();
      }
    }
    setTextAnt(text);
  }, [text, orderFilter]);

  useEffect(() => {
    if (!loading) {
      setLoading(true)
      get(true).then();
    }
  }, [props.filter]);

  useEffect(() => {
    if (!loading) {
      get().then();
    }
  }, [page, sizePage]);

  async function get(refresh?: boolean) {
    let filtro: string = props.filter ? props.filter : '';

    const colunasFiltrar = props.arrayColumns.filter((column) => column.main);
    if (text.trim().length >= MINIMO_CARACTER_PESQUISA && colunasFiltrar.length > 0) {
      filtro += filtro ? ' and ' : '';
      filtro += ' ( ';

      if (props.usaFiltroConcatenado) {
        filtro += montaFiltroConcatenado(colunasFiltrar);
      } else {
        filtro += montaFiltroSimples(colunasFiltrar);
      }

      filtro += ' ) ';
    }

    if (props.autocomplete) {
      props.service.autocomplete(props.class, '', filtro).then(dados => {
        setDadosPaginados(dados);
        setLoading(false);
      }).catch(reason => {
        manipuladorExcecoes.exib('Erro', reason);
        setDadosPaginados(new DadosPaginados());
        setLoading(false);
      });
    } else {
      props.service.get(props.class, '', filtro, orderFilter.column.path, orderFilter.sortDirection, page, parseInt(sizePage.toString())).then(async dados => {
        if (props.formataExibicao) {
          dados.conteudo = await props.formataExibicao(dados.conteudo);
        }

        if (dadosPaginados.conteudo && !refresh) {
          dados.conteudo = [...dadosPaginados.conteudo, ...dados.conteudo]
        }
        setDadosPaginados(dados);
        setLoading(false);

      }).catch(reason => {
        manipuladorExcecoes.exib('Erro', reason);
        setDadosPaginados(new DadosPaginados());
        setLoading(false);
      });
    }
  }

  function montaFiltroSimples(colunasFiltrar: Column[]): string {
    let filtro = '';
    colunasFiltrar.forEach((coluna: Column, index: number) => {
      filtro += coluna.filter + ' CONTAINS[c] "' + text + '"';

      if (index < colunasFiltrar.length - 1) {
        filtro += ' OR ';
      }
    });
    return filtro;
  }

  function montaFiltroConcatenado(colunasFiltrar: Column[]): string {
    let filtro = '';
    if (text.trim().length > 0) {
      const texto = text.split(CARACTER_SEPARADOR_PESQUISA);
      colunasFiltrar.forEach((coluna: Column, index: number) => {
        const textoAtual = texto[index] ? texto[index].trim() : '';
        if (textoAtual.length > 0) {
          if (filtro.length > 0) {
            filtro += ' AND ';
          }

          filtro += coluna.path + ' CONTAINS[c] "' + textoAtual + '"';
        }
      });
    }
    return filtro;
  }

  function onClose() {
    setLoading(false);
    props.onClose();
  }

  function onChangeText(textChange) {
    if (textChange?.length < MINIMO_CARACTER_PESQUISA) {
      setError(true);
      setErrorMessage(`Deve-se digitar pelo menos ${MINIMO_CARACTER_PESQUISA} caracteres.`);
    } else {
      setError(false);
      setErrorMessage('');
    }
    setText(textChange);
  }

  function handleSelect(item) {
    if (props.allowInactive || item.flagAtivo) {
      props.onSelect(item);
    } else {
      manipuladorExcecoes.exib('Registro Inativo', 'Deve ser selecionado um registro ativo.');
    }
  }

  return (
    <Portal>
      {
        props.dialogConfirm && props.onCancel && props.onConfirm ?
          <DialogOC
            visible={props.dialogConfirm}
            title='Confirmação'
            description='Os dados atuais serão perdidos, deseja realmente importar o cadastro?'
            titleButtonCancel={'Não'}
            titleButtonConfirm={'Sim'}
            onDismiss={props.onCancel}
            onPress={props.onConfirm}
          />
          : false
      }
      <Dialog
        style={styles.dialog}
        visible={props.visible}
        onDismiss={onClose}>
        <View style={styles.viewTitle}>
          <Icon
            onPress={() => onClose()}
            name={'arrow-back'}
            size={25}
          />
          <Text
            style={styles.title}
          >
            {props.title}
          </Text>
        </View>
        <View>
          <TextInput
            style={[styles.input, componentsStyles.input]}
            editable={true}
            mode='outlined'
            multiline={false}
            numberOfLines={1}
            label={props.label}
            value={text}
            onChangeText={(textChange) => onChangeText(textChange)}
          />
          <HelperTextOC
            style={styles.helper}
            text={errorMessage}
            visible={error}
          />
        </View>
        <Divider/>
        <LoadingDialogOc
          visible={loading}
        />
        <InfiniteScrollOC
          class={props.class}
          arrayColumns={props.arrayColumns}
          dadosPaginados={dadosPaginados}
          order={orderFilter}
          page={page}
          onPageChange={(page) => {
            if (!dadosPaginados.ultimaPagina) {
              setPage(page);
            }
          }}
          onPressSort={(order) => {
            setOrderFilter(order);
          }}
          onPressRow={(id) => handleSelect(dadosPaginados.conteudo.filter(cont => cont.id === id)[0])}
          sizePage={sizePage}
          onPressSizePage={(sizePage) => {
            setSizePage(sizePage);
          }}
          onRefreshing={(refreshValue) => {
            if (!dadosPaginados.ultimaPagina || refreshValue) {
              if (refreshValue) {
                setPage(0);
                setDadosPaginados(new DadosPaginados());
              }
              setRefreshing(refreshValue);
            }
          }}
          refreshing={refreshing}
          style={styles.container}
          cartType={props.cartType}
        />
      </Dialog>
    </Portal>
  );
}

export {AutocompleteModalOC, AutocompleteMultipleModalOC};

const styles = StyleSheet.create({
  chipMultiple: {
    marginRight: 4,
    marginTop: 6
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
  },
  dialog: {
    height: '100%',
    width: '100%',
    marginLeft: '0%',
    padding: 0
  },
  icon: {
    paddingTop: 8,
    marginLeft: '-12%'
  },
  iconOptional: {
    paddingTop: 8,
    marginLeft: 20
  },
  input: {
    backgroundColor: '#fff',
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
  },
  helper: {
    backgroundColor: '#fff',
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  loading: {
    marginTop: 15
  },
  select: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollViewLoading: {
    height: 80,
  },
  textInput: {
    width: '100%',
  },
  textInputOptional: {
    width: '85%',
  },
  viewTitle: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
  },
});
