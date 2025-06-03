import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {hp} from '../../utils/responsive';

import {Column} from '../../models/objects/Column';
import {DadosPaginados, TamanhoDaPagina} from '../../models/objects/DadosPaginados';
import {ObjetoUtilsService} from '../../services/ObjetoUtilsService';
import {Order} from '../data-table-oc/Order';
import {screenStyles} from '../../settings/GlobalStyle';
import {CardAutocompleteOC, CardPersonAutocompleteOC} from '../card-oc/CardOC';
import {DateUtils} from '../../services/DateUtils';
import {colors} from '../../settings/Settings';
import {StringUtilsService} from '../../services/StringUtilsService';


function InfiniteScrollOC(props: {
                            arrayColumns: Array<Column>,
                            page: number,
                            class: any,
                            dadosPaginados: DadosPaginados<Object>,
                            order: Order,
                            sizePage: TamanhoDaPagina,
                            onPressSort: ((order: Order) => void),
                            onPageChange: ((page: number) => void),

                            style?: any,
                            initialStade?: boolean,
                            refreshing?: boolean,
                            onPressRow?: ((key: any) => void),
                            onPressSizePage?: ((sizePage: TamanhoDaPagina) => void),
                            onRefreshing?: ((refreshValue: boolean) => void),
                            cartType?: 'normal' | 'person',
                          }
) {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    props.onRefreshing ? props.onRefreshing(false) : false;
  }, [props.dadosPaginados]);

  function handleTitle(item: any): Array<any> {
    let titles = new Array<any>();
    props.arrayColumns.forEach((column) => {
      if (!column.outCard) {
        let value = '';
        if (column.path) {
          value = ObjetoUtilsService.percorreCaminhoObjeto(item, column.path);
        } else if (column.getValue) {
          value = column.getValue(item);
        }
        if (value) {
          if (column.type === 'date') {
            value = DateUtils.formatDateTimeToBr(value);
          } else if (column.type === 'cpf') {
            value = StringUtilsService.formataCpfCnpj(value);
          } else if (column.type === 'boolean') {
            value = ObjetoUtilsService.converteFlag(value);
          }
        } else if (column.type === 'boolean') {
          value = 'Não';
        }
        titles.push({
          title: column.text,
          value: value ? value : '',
          main: column.main,
          type: column.type
        })
      }
    });
    return titles;
  }

  return (
    <View
      style={props.style ? props.style : screenStyles.scroll}
    >
      <FlatList
        onEndReached={({distanceFromEnd}) => {
          if (props.dadosPaginados.conteudo /*&& props.dadosPaginados.conteudo.length >= parseInt(props.sizePage)*/
            && !props.dadosPaginados.ultimaPagina && distanceFromEnd > 1) {
            props.onPageChange(props.page + 1)
            setLoading(true);
          } else {
            setLoading(false);
          }
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{paddingBottom: hp('30%')}}
        data={props.dadosPaginados.conteudo}
        refreshing={props.refreshing}
        onRefresh={() => {
          props.onRefreshing ? props.onRefreshing(true) : false
        }}
        renderItem={({item, index}: any) => (
          <View>
            {
              props.cartType === 'person' ?
                <CardPersonAutocompleteOC
                  style={{cardText: !item.flagAtivo ? styles.cardText : null }}
                  key={String(item.id)}
                  titles={handleTitle(item)}
                  onPress={() => {
                    props.onPressRow ? props.onPressRow(item.id) : false;
                  }}
                />
                :
                <CardAutocompleteOC
                  style={{cardText: !item.flagAtivo ? styles.cardText : null }}
                  key={String(item.id)}
                  titles={handleTitle(item)}
                  onPress={() => {
                    props.onPressRow ? props.onPressRow(item.id) : false;
                  }}
                />
            }
            {
              index + 1 === props.dadosPaginados?.conteudo?.length && loading ?
                <ActivityIndicator
                  animating={loading}
                  color={colors.primary}
                  hidesWhenStopped={loading}
                  size={hp('6%')}
                  style={styles.loading}
                />
                : false
            }
          </View>
        )}
        keyExtractor={(item: any) => String(item.id)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  loading: {
    alignItems: 'center',
    padding: 20,
  },
  cardText: {
    color: '#c4c4c4',
  },
});

export {InfiniteScrollOC};
