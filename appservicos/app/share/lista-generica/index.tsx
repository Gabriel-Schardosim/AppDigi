import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Divider} from 'react-native-paper';

import {DadosPaginados, TamanhoDaPagina} from '@/share/models/objects/DadosPaginados';
import {Column} from '@/share/models/objects/Column';
import {Order, SortDirection} from '@/share/components/data-table-oc/Order';
import {Fab2OC} from '@/share/components/fab-oc/FabOC';
import ServiceGenerico from '@/share/services/ServiceGenerico';
import {InfiniteScrollOC} from '@/share/components/infinite-scroll-oc/InfiniteScrollOC';
import {FilterDialogOc, FilterOC} from '@/share/components/filter-oc/FilterOC';
import {sizes} from '@/share/settings/Settings';
import { useRouter } from 'expo-router';

export default function ListaGenerica(props: {
                                        class: any,
                                        arrayColumns: Array<Column>,
                                        arrayFilters: Array<Column>,
                                        navigation: any,
                                        defaultOrder?: Order,
                                        defaultPage?: number,
                                        defaultSizePage?: TamanhoDaPagina,
                                        service: ServiceGenerico<any>,
                                        onPressRow?: ((key: any) => void),
                                        onPressButttonAdd?: (() => void),
                                        cartType?: 'normal' | 'person',
                                      }
) {

   const router = useRouter();
  const [dadosPaginados, setDadosPaginados] = useState<DadosPaginados<any>>(new DadosPaginados());
  const [columns, setColumns] = useState(props.arrayColumns);
  const [columnsFilters, setColumnsFilters] = useState(String(columns.map(c => c.path).join(',')));
  const [orderFilter, setOrderFilter] = useState<Order>(props.defaultOrder ? props.defaultOrder : new Order(SortDirection.Asc, columns[0]));
  const [page, setPage] = useState(props.defaultPage ? props.defaultPage : 0);
  const [sizePage, setSizePage] = useState(props.defaultSizePage ? props.defaultSizePage : TamanhoDaPagina.t10);
  const [initialStade, setInitialStade] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('');
  const [dialogVisibleFilter, setDialogVisibleFilter] = useState(false);
  const [dialogColumnFilter, setDialogColumnFilter] = useState(new Column('', ''));

  useEffect(() => {
    props.navigation.addListener('willFocus', (payload: any) =>
      inFocus()
    );
  }, [props.navigation.isFocused()]);

  useEffect(() => {
    get().then();
    setInitialStade(false);
  }, [orderFilter, page, sizePage]);

  useEffect(() => {
    if (refreshing) {
      get().then();
    }
    setInitialStade(false);
  }, [refreshing]);

  function inFocus() {
    setDadosPaginados(new DadosPaginados());
    setPage(props.defaultPage ? props.defaultPage : 0);
    setRefreshing(true);
  }

  async function get() {
    let filterText = '';

    if (filter && filter !== '') {
      if (dialogColumnFilter.type === 'date') {
        const date = new Date(filter);
        const start = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}@0:0:0`;
        const end = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}@23:59:59`;

        filterText = `${dialogColumnFilter.path} >= ${start} AND ${dialogColumnFilter.path} <= ${end}`;
      } else {
        filterText = dialogColumnFilter.path + ' CONTAINS[c] "' + filter + '"';
      }
    }

    if (!dadosPaginados.ultimaPagina || refreshing) {
      const service = props.service ? props.service : new ServiceGenerico();
      let dados = await service.get(props.class, 'i' + props.class.className + ',' + columnsFilters,
        filterText, orderFilter.column.path, orderFilter.sortDirection, page, parseInt(sizePage.toString()));
      let newDados = dados;

      if (dadosPaginados.conteudo) {
        newDados.conteudo = [...dadosPaginados.conteudo, ...dados.conteudo];
      }
      setDadosPaginados(newDados);
    }
    setRefreshing(false);
  }

  return (
    <View>
      <View>
        <ScrollView
          horizontal={true}
          style={styles.scrollFilter}
        >
          {/*
          <View
            key={'filtros'}
            style={styles.viewFilter}
          >
            <Text style={styles.titleTitle}>Filtros: </Text>
          </View>
          */}
          {
            props.arrayFilters?.map((filterColumn) => {
              return (
                <View
                  key={filterColumn.path}
                  style={styles.viewFilter}
                >
                  <FilterOC
                    selected={filterColumn.path === dialogColumnFilter.path}
                    text={filterColumn.text}
                    onPress={() => {
                      if (filterColumn.path !== dialogColumnFilter.path) {
                        setFilter('');
                      }
                      setDialogColumnFilter(filterColumn);
                      setDialogVisibleFilter(true);
                    }}
                  />
                </View>
              );
            })
          }
        </ScrollView>
      </View>

      {
        props.arrayFilters ? <Divider style={styles.divider}/> : false
      }

      <InfiniteScrollOC
        class={props.class}
        arrayColumns={columns}
        dadosPaginados={dadosPaginados}
        order={orderFilter}
        page={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        onPressSort={(order) => {
          setOrderFilter(order);
        }}
        onPressRow={props.onPressRow}
        initialStade={initialStade}
        sizePage={sizePage}
        onPressSizePage={(sizePage) => {
          setSizePage(sizePage);
        }}
        onRefreshing={(refreshValue) => {
          if (refreshValue) {
            setPage(props.defaultPage ? props.defaultPage : 0);
            setDadosPaginados(new DadosPaginados());
          }
          setRefreshing(refreshValue);
        }}
        refreshing={refreshing}
        style={styles.container}
        cartType={props.cartType}
      />

      {
        dialogVisibleFilter ?
          <FilterDialogOc
            text={filter}
            visible={dialogVisibleFilter}
            column={dialogColumnFilter}
            onDismiss={() => {
              setDialogVisibleFilter(false);
            }}
            onClean={() => {
              setDialogColumnFilter(new Column('', ''));
              setFilter('');
              inFocus();
              setDialogVisibleFilter(false);
            }}
            onFilter={(text) => {
              setFilter(text);
              inFocus();
              setDialogVisibleFilter(false);
            }}
          />
          : false
      }
      {
        props.onPressButttonAdd ?
          <Fab2OC
            icon='plus'
            onPress={props.onPressButttonAdd}
          /> : false
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? '98%' : '100%'
  },
  divider: {
    backgroundColor: '#e5e5e5',
    height: 1,
    margin: 2
  },
  scrollFilter: {
    marginTop: Platform.OS === 'ios' ? 25 : 0
  },
  viewFilter: {
    margin: 8
  },
  titleTitle: {
    marginTop: 4,
    fontSize: sizes.fontMedium
  },
});
