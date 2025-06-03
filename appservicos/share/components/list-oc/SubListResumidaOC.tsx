import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {LoadingOc} from "../loading-oc/LoadingOC";
import {DadosPaginados} from "../../models/objects/DadosPaginados";
import {Column} from "../../models/objects/Column";
import ServiceGenerico from "../../services/ServiceGenerico";
import {ObjetoUtilsService} from "../../services/ObjetoUtilsService";
// import {ButtonOC} from "../button-oc/ButtonOC";
// import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {Dependent} from "../../models/objects/Dependent";
import {DateUtils} from "../../services/DateUtils";
import {CardAutocompleteOC} from "../card-oc/CardOC";
import {StringUtilsService} from '../../services/StringUtilsService';

function SubListResumidaOC(props: {
                       class: any,
                       filter: string,
                       arrayColumns: Array<Column>,
                       service: ServiceGenerico<any>,
                       onPress: ((id) => void),
                       onNew: (() => void),
                       loading: boolean,
                       onDelete?: ((id) => void),
                       dependent?: Dependent,
                   }
) {

    const [dadosPaginados, setDadosPaginados] = useState<DadosPaginados<any>>(new DadosPaginados());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        get().then();
    }, []);

    useEffect(() => {
        if (props.loading) {
            get().then();
        }
    }, [props.loading]);

    async function get() {
        props.service.get(props.class, '', props.filter).then(dados => {
            if (props.dependent) {
                let conteudo = new Array<any>();
                for (let index in dados.conteudo) {
                    let array = ObjetoUtilsService.percorreCaminhoObjeto(dados.conteudo[index], props.dependent.attributeName);
                    for (let index2 in array) {
                        let object = array[index2];
                        object = ObjetoUtilsService.percorreCaminhoObjetoSetValue(object, StringUtilsService.firstLetterLower(props.class.className), dados.conteudo[index]);
                        conteudo.push(object);
                    }
                }
                dados.conteudo = conteudo;
                setDadosPaginados(dados);
                setLoading(false);
            } else {
                setDadosPaginados(dados);
                setLoading(false);
            }
        }).catch(reason => {
            setDadosPaginados(new DadosPaginados());
            setLoading(false);
        });
    }

    useEffect(() => {
        setLoading(false);
    }, [dadosPaginados]);

    function handleTitle(item): Array<any> {
        let titles = new Array<any>();
        props.arrayColumns.map((column) => {
            let value = ObjetoUtilsService.percorreCaminhoObjeto(item, column.path);
            if (value) {
                if (column.type === 'date') {
                    value = DateUtils.formatDateTimeToBr(value);
                } else if (column.type === 'cpf') {
                    value = StringUtilsService.formataCpfCnpj(value);
                }
            }
            titles.push({
                title: column.text,
                value: value ? value : '',
                main: column.main
            })
        });
        return titles;
    }

    function handleLine(item, path) {
        return ObjetoUtilsService.percorreCaminhoObjeto(item, path);
    }


    return (
        <View style={styles.container}>
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={loading ? styles.scrollViewLoading : false}
            >
                {
                    loading ?
                        <LoadingOc visible={true} style={styles.loading}/>
                        :
                        dadosPaginados.conteudo && dadosPaginados.conteudo.length > 0 ?
                            dadosPaginados.conteudo.map((item) => {
                                return (
                                    props.onDelete ?
                                        <CardAutocompleteOC
                                            onDelete={() => props.onDelete ? props.onDelete(item.id) : () => {
                                            }}
                                            key={String(handleLine(item, 'id'))}
                                            titles={handleTitle(item)}
                                            onPress={() => props.onPress(String(item.id))}
                                        /> :
                                        <CardAutocompleteOC
                                            key={String(handleLine(item, 'id'))}
                                            titles={handleTitle(item)}
                                            onPress={() => props.onPress(String(item.id))}
                                        />
                                );
                            })
                            : false
                }
            </ScrollView>
        </View>

    );
}

export {SubListResumidaOC};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    center: {
        marginBottom: 20,
        alignItems: 'center',
    },
    scrollViewLoading: {
        height: 80,
    },
    loading: {
        marginTop: 15
    },
});
