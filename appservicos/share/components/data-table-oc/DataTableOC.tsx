import React, {useEffect, useState} from 'react';
import {DataTable} from 'react-native-paper';
import {Column} from '../../models/objects/Column';
import {DadosPaginados, TamanhoDaPagina} from '../../models/objects/DadosPaginados';
import {ObjetoUtilsService, ValoresEnums} from '../../services/ObjetoUtilsService';
import {RefreshControl, ScrollView, StyleSheet, Text} from 'react-native';
import {Order, SortDirection} from './Order';
import {SelectDialogOC} from '../select-oc/SelectOC';
import {LoadingOc} from '../loading-oc/LoadingOC';
import {screenStyles} from '../../settings/GlobalStyle';
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {StringUtilsService} from '../../services/StringUtilsService';


function DataTableOC(props: {
    arrayColumns: Array<Column>,
                         page: number,
                         className: string,
                         dadosPaginados: DadosPaginados<Object>,
                         order: Order,
                         sizePage: TamanhoDaPagina,
                         onPressSort: ((order: Order) => void),

                         style?: any
                         initialStade?: boolean
                         refreshing?: boolean
                         onPageChange?: ((page: number) => void),
                         onPressRow?: ((key) => void),
                         onPressSizePage?: ((sizePage) => void),
                         onRefreshing?: ((refreshValue: boolean) => void),
                     }
) {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(props.initialStade ? props.initialStade : false);
        props.onRefreshing ? props.onRefreshing(false) : false;
    }, [props.dadosPaginados]);


    function handlePageChange(page) {
        setLoading(true);
        props.onPageChange ? props.onPageChange(page) : false;
    }

    function handleSort(order: Order) {
        setLoading(true);
        props.onPressSort(order);
    }

    function handleSizePage(size) {
        setLoading(true);
        props.onPressSizePage ? props.onPressSizePage(TamanhoDaPagina[size.propriedade]) : false;
    }

    function handleRefresh() {
        props.onRefreshing ? props.onRefreshing(true) : false;
    }

    function handleCell(item, path) {
        return ObjetoUtilsService.percorreCaminhoObjeto(item, path);
    }

    function handleCurrentPage() {
        return (props.dadosPaginados.tamanhoDaPagina * (props.dadosPaginados.numeroDaPagina)) + 1;
    }

    function handleCurrentSizePage() {
        return props.dadosPaginados.quantidadeDeRegistros < (props.dadosPaginados.numeroDaPagina + 1) * props.dadosPaginados.tamanhoDaPagina ? props.dadosPaginados.quantidadeDeRegistros : (props.dadosPaginados.numeroDaPagina + 1) * props.dadosPaginados.tamanhoDaPagina;
    }


    return (
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => handleRefresh()}
              refreshing={props.refreshing ? props.refreshing : false}
            />
          }
          style={props.style ? props.style : screenStyles.scroll}
        >
            <LoadingOc
                visible={loading}
            />
            <DataTable style={styles.container}>
                <DataTable.Header>
                    {
                        props.arrayColumns.map((column) => (
                            props.order.column.path === column.path ?
                                <DataTable.Title
                                    key={column.text}
                                    numeric={ObjetoUtilsService.isNumeric(column)}
                                    onPress={() => handleSort(new Order((props.order.sortDirection === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc), column))}
                                    sortDirection={props.order.sortDirection === SortDirection.Asc ? 'ascending' : 'descending'}
                                >
                                    <Text style={styles.title}>
                                        {column.text}
                                    </Text>
                                </DataTable.Title>
                                :
                                <DataTable.Title
                                    key={column.text}
                                    numeric={ObjetoUtilsService.isNumeric(column)}
                                    onPress={() => handleSort(new Order(SortDirection.Desc, column))}
                                    sortDirection={'ascending'}
                                >
                                    <Text style={styles.title}>
                                        {column.text}
                                    </Text>
                                </DataTable.Title>
                        ))
                    }
                </DataTable.Header>
                {
                    props.dadosPaginados?.conteudo ?
                        props.dadosPaginados.conteudo.map((item) => {
                                return (
                                    <DataTable.Row
                                        key={StringUtilsService.uuidv4()}
                                        onPress={() => {
                                            props.onPressRow ? props.onPressRow(String(handleCell(item, 'id'))) : false;
                                        }}
                                    >
                                        {
                                            props.arrayColumns.map((column) => {
                                                return (
                                                    <DataTable.Cell
                                                        key={column.path}
                                                    >
                                                        <Text
                                                            style={styles.cell}>{String(handleCell(item, column.path))}</Text>
                                                    </DataTable.Cell>
                                                );
                                            })
                                        }
                                    </DataTable.Row>
                                );
                            }
                        ) : false

                }

                <SelectDialogOC
                    label={'Itens por página'}
                    typeEnum={TamanhoDaPagina}
                    onSelect={(size: ValoresEnums) => {
                        handleSizePage(size);
                    }}
                    style={styles.select}
                    value={ObjetoUtilsService.retornaChaveEnum(props.sizePage, TamanhoDaPagina)}
                />
                {
                    props.dadosPaginados.quantidadeDePaginas ?
                        <DataTable.Pagination
                            label={`${handleCurrentPage()} - ${handleCurrentSizePage()} de ${props.dadosPaginados.quantidadeDeRegistros}`}
                            numberOfPages={props.dadosPaginados.quantidadeDePaginas}
                            onPageChange={(page) => handlePageChange(page)}
                            page={props.page}
                        />
                        : false
                }
            </DataTable>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    select: {
        marginTop: 20
    },
    title: {
        fontSize: hp('1.8%'),
        fontWeight: 'bold'
    },
    cell: {
        fontSize: hp('1.8%'),
    },
});

export {DataTableOC};
