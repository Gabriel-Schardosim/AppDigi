import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';

import KeepAwake from 'react-native-keep-awake';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import DeviceInfo from 'react-native-device-info';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import base64 from 'react-native-base64';
import Realm from 'realm';
import { Dialog, Portal } from 'react-native-paper';

import { ButtonOC } from '@/share/components/button-oc/ButtonOC';
import api from '@/share/services/Api';
import { DadosPaginados } from '@/share/models/objects/DadosPaginados';
import ProgressBarOC from '@/share/components/progress-bar-oc/ProgressBarOC';
import ServiceGenerico, { LocalPersistencia } from '@/share/services/ServiceGenerico';
import { DateUtils } from '@/share/services/DateUtils';
import { UltimaAtualizacaoModel } from '@/share/models/UltimaAtualizacaoModel';
import manipuladorExcecoes from '@/share/services/ManipuladorExcecoes';
import { GenericoDTO } from '@/share/models/objects/GenericoDTO';
import { RetornoDTO } from '@/share/models/objects/RetornoDTO';
import { colors, sizes } from '@/share/settings/Settings';
import { UltimaAtualizacaoModelService } from '@/share/services/UltimaAtualizacaoModelService';
import { CadastroProtocoloService } from '@/src/protocolo/services/CadastroProtocoloService';
import { ErroSincronizacaoService } from '@/share/services/ErroSincronizacaoService';
import DialogOC from '@/share/components/dialog-oc/DialogOC';
import { ObjetoUtilsService } from '@/share/services/ObjetoUtilsService';
import { Entidade } from '@/share/models/Entidade';
import { getSession, onSignOut } from '@/share/services/Auth';
import { Context } from '@/share/models/Context';
import UpdateMode = Realm.UpdateMode;
import { Protocolo } from '@/src/protocolo/models/Protocolo';
import { Assunto } from '@/src/protocolo/models/Assunto';
import { Setor } from '@/src/protocolo/models/Setor';
import { Parecer } from '@/src/protocolo/models/Parecer';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Battery from 'expo-battery';
import { hp } from '@/share/utils/responsive';


export class ItemSync {
  nome: string;
  classe: any;
  colunas: string;
  filtros: string;
  syncCustom: boolean;
  finish: boolean;
  ref: any;
  service: ServiceGenerico<any>;
  newObject?: any;
  filtrarMicroarea: boolean;
  dataUltimaAlteracao!: Date;
  atributoUltimaSincronizacao: string;

  constructor(nome: string, classe: any, colunas: string, filtros: string = '', syncCustom: boolean = false, finish: boolean = false,
    ref: any = null, service: any = new ServiceGenerico(), newObject?: any, filtrarMicroarea: boolean = false,
    atributoUltimaSincronizacao: string = 'dataUltimaAlteracao') {
    this.nome = nome;
    this.classe = classe;
    this.colunas = colunas;
    this.filtros = filtros;
    this.syncCustom = syncCustom;
    this.finish = finish;
    this.ref = ref;
    this.service = service;
    this.newObject = newObject;
    this.filtrarMicroarea = filtrarMicroarea;
    this.atributoUltimaSincronizacao = atributoUltimaSincronizacao;
  }
};

const listItensRec = [
  new ItemSync('Setor', Setor, 'iSetor, descricao, flagAtivo', '', true),
  new ItemSync('Parecer', Parecer, 'iParecer, descricao, flagAtivo', '', true),
  new ItemSync('Assunto', Assunto, 'iAssunto, descricao, flagAtivo', '', true),
  new ItemSync('Protocolo', Protocolo, 'iProtocolo,descricao,ano,codigo,codigoContribuinte,assunto.iAssunto,assunto.descricao,flagAtivo', '', true),
];

const listItensEnv = [
  new ItemSync('Protocolo', Protocolo, '', '', false, false, null, null, new Protocolo()),
];

export {
  listItensRec,
  listItensEnv
};

function getItensSyncEnv() {
  const itensSyncEnv = listItensEnv;

  itensSyncEnv.forEach(item => {
    if (Protocolo.className === item.classe.className) {
      item.service = new CadastroProtocoloService();
    }
  });

  return itensSyncEnv;
}

export async function getRegistrosParaEnviar() {
  const itensSyncEnv = getItensSyncEnv();
  let registrosEnviar: ItemSync[] = [];

  for (const item of itensSyncEnv) {
    const dataUltimaSinc = await new UltimaAtualizacaoModelService().getDataSincronizacao(item.classe, true);
    const dataUltimoEnvio = await new UltimaAtualizacaoModelService().getDataSincronizacao(item.classe, false);

    let filtros = item.filtros;

    if (filtros?.length > 0) {
      filtros += ' and ';
    }

    // TODO alterar futuramente para filtrar somente pelos enviados
    filtros += ` ( statusSincronizacao = 'F' or statusSincronizacao = 'E') `;

    if (dataUltimoEnvio?.length > 0) {
      filtros += ` and ( dataUltimaAlteracao > ${DateUtils.formatDateTimeToUs(dataUltimoEnvio, true)}  or i${item.classe.className} = null)  `;
    } else if (dataUltimaSinc?.length > 0) {
      filtros += ` and ( dataUltimaAlteracao > ${DateUtils.formatDateTimeToUs(dataUltimaSinc, true)} or i${item.classe.className} = null) `;
    } else {
      filtros += ` and i${item.classe.className} = null `;
    }

    const dadosPaginados = await item.service.get(item.classe, '', filtros, `dataUltimaAlteracao`, `asc`, 0, 500, LocalPersistencia.B);
    if (dadosPaginados?.conteudo?.length > 0) {
      dadosPaginados.conteudo.forEach(value => {
        const registro = ObjetoUtilsService.copy(item);
        registro.filtros = ` id = ${value['id']} `;
        registro.dataUltimaAlteracao = new Date(value.dataUltimaAlteracao);
        registrosEnviar.push(registro);
      });
    }
  }

  return registrosEnviar;
}

// export default function SincronizarDados({navigation}) {
export default function SincronizarDados() {
  const [progressItem, setProgressItem] = useState<ItemSync>(new ItemSync('', null, ''));
  const [visibleRec, setVisibleRec] = useState(false);
  const [visibleEnv, setVisibleEnv] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [dialogBattery, setDialogBattery] = useState(false);
  const [dialogInternet, setDialogInternet] = useState(false);
  const [progress, setProgress] = useState(0.001);
  const [itensSyncRec, setItensSyncRec] = useState<Array<ItemSync>>(listItensRec);
  const [itensSyncEnv, setItensSyncEnv] = useState<Array<ItemSync>>(listItensEnv);

  const router = useRouter();
  const params = useLocalSearchParams();
  const shouldReceberDados = params?.receberDados === 'true';

  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryState, setBatteryState] = useState<Battery.BatteryState | null>(null);


  useEffect(() => {
    async function fetchBatteryInfo() {
      const level = await Battery.getBatteryLevelAsync();
      const state = await Battery.getBatteryStateAsync();
      setBatteryLevel(level);
      setBatteryState(state);
    }
    fetchBatteryInfo();
  }, []);

  useEffect(() => {
    async function useEffectAsync() {
      itensSyncRec.forEach(item => {
        if (Protocolo.className === item.classe.className) {
          item.service = new CadastroProtocoloService();
        }
      });

      setItensSyncRec(itensSyncRec);
      setItensSyncEnv(getItensSyncEnv());

      // Verifica bateria
      if (batteryLevel !== null && batteryState !== null) {
        if (batteryLevel < 0.15 && batteryState !== Battery.BatteryState.CHARGING) {
          setDialogBattery(true);
        }
      }

      await testaConexao();
      await removeItem();
      await adicionaFiltro();

      if (shouldReceberDados) {
        setVisibleRec(true);
      }
    }

    useEffectAsync();
  }, [batteryLevel, batteryState]);


  async function setarDataInicialListasParaAtualizar(): Promise<void> {

  }

  async function adicionaFiltro() {
    const session = await getSession();

    if (session?.context) {
      itensSyncRec.forEach(item => {
        const sessionContext: Context = JSON.parse(base64.decode(session.context));
        if (Entidade.className === item.classe.className) {
          item.filtros = 'chavePublica=\'' + sessionContext.entidade + '\'';
        }
      });
      setItensSyncRec(itensSyncRec);
    }
  }

  async function removeItem() {
    await new ServiceGenerico().get(Entidade).then(dadosPaginados => {
      if (dadosPaginados?.conteudo?.length > 0) {
        setItensSyncRec(itensSyncRec.filter(item => item.classe.className !== Entidade.className));
      }
    });
  }

  useEffect(() => {
    if (visibleRec) {
      BackHandler.addEventListener('hardwareBackPress', () => true);
      receber(shouldReceberDados).then();
    } else {
      BackHandler.addEventListener('hardwareBackPress', () => {
        router.back();
        return true;
      });
    }
  }, [visibleRec]);

  useEffect(() => {
    if (visibleEnv) {
      BackHandler.addEventListener('hardwareBackPress', () => true);
      enviar().then();
    } else {
      BackHandler.addEventListener('hardwareBackPress', () => {
        router.back();
        return true;
      });
    }
  }, [visibleEnv]);

  async function testaConexao(): Promise<boolean> {
    return true;
  }

  async function getDados(model: any, colunas: string, filtros = '', syncCustom = false,
    service = new ServiceGenerico(), atributoUltimaSincronizacao = 'dataUltimaAlteracao') {
    let dadosRetornadosDTO: any = [];
    let dadosPaginados: DadosPaginados<any>;
    let pagina = 0;

    setProgress(0.001);

    do {
      const session = await getSession();
      filtros = session.usuario.cpfCnpj;

      dadosPaginados = await api.get<any>(model, colunas, filtros, `i${model.className} asc`, pagina++);

      if (dadosPaginados?.conteudo?.length > 0) {
        dadosRetornadosDTO = dadosPaginados.conteudo;
        if (syncCustom) {
          for (let index in dadosRetornadosDTO) {
            if (dadosRetornadosDTO[index][`i${model.className}`] != null && Number(index) > 0) {
              await service.preSaveSync(dadosRetornadosDTO[index], model, model.dependents).then(ret => {
                service.database.write(() => {
                  service.database.create(model.className, ret, UpdateMode.Modified);
                });
              });
            }
          }
        } else {
          for (let index in dadosRetornadosDTO) {
            if (dadosRetornadosDTO[index][`i${model.className}`] != null) {
              let dado = {};
              await service.trataRecebimento(dadosRetornadosDTO[index]).then(ret => {
                dado = ret;
              });

              await service.preSave(dado, model, model.dependents, 1, true).then(ret => {
                ret = service.guardaVersaoAnterior(ret);
                service.database.write(() => {
                  service.database.create(model.className, ret, UpdateMode.Modified);
                });
              });
            }
          }
        }
        setProgress((dadosPaginados.numeroDaPagina + 1) / dadosPaginados.quantidadeDePaginas);
      }
    } while (dadosPaginados?.quantidadeDeRegistros > 0 && !dadosPaginados.ultimaPagina);

    await new UltimaAtualizacaoModelService().setDataSincronizacao(model, true);
  }

  /**
   * Envia as fichas por ordem de alteração agrupando todas,
   * assim as alterações que necessitam ser enviadas em sequencia serão respeitadas
   */
  async function enviarFichas<U extends GenericoDTO<U>>() {
    let registrosEnviar: ItemSync[] = [];
    let index = 0;

    setProgressItem(new ItemSync('', { className: 'Protocolo' }, ''));
    setProgress(0.001);
    registrosEnviar = await getRegistrosParaEnviar();
    registrosEnviar = registrosEnviar.sort((a, b) => a.dataUltimaAlteracao?.getTime() - b.dataUltimaAlteracao?.getTime());
    for (let registro of registrosEnviar) {
      const dadosPaginados = await registro.service.get(registro.classe, '', registro.filtros, `i${registro.classe.className}`, `asc`, 0, 1, LocalPersistencia.B);
      if (dadosPaginados?.conteudo?.length > 0) {
        //const possuiErro = await new ErroSincronizacaoService().possuiErro(dadosPaginados.conteudo[0]['id'], registro.classe.className);
        //if (!possuiErro) {
        const dadoRetornadoDTO = dadosPaginados.conteudo[0];
        // TODO caso futuramente não for necessário verificar as edições, apagar isso e toda a estrutura de tabela e service responsável por salvar as edições
        // let edicaoFinalizada = dadoRetornadoDTO.edicoes ?
        //   (Object.values(dadoRetornadoDTO.edicoes).filter((ed: any) => ed.finalizado).length === Object.values(dadoRetornadoDTO.edicoes).length)
        //   : false;
        // if (edicaoFinalizada) {
        let modelEnvio: any = dadosPaginados;
        await registro.service.preparaEnvio(dadoRetornadoDTO, registro.classe, registro.classe.dependents).then(retorno => {
          modelEnvio = retorno;
        });

        let retorno = new RetornoDTO();
        try {
          console.warn('ENVIO', JSON.stringify(modelEnvio));
          retorno = await new ServiceGenerico().save(modelEnvio, registro.classe, LocalPersistencia.O);
        } catch (e) {
          console.warn(e);
          await new ErroSincronizacaoService().gravaErro(
            dadoRetornadoDTO.id,
            registro.classe.className,
            (e instanceof Error ? e.message : JSON.stringify(e))
          );
        }

        if (retorno.idGravado > 0) {
          const modelUpdate: { [key: string]: any } = {};
          modelUpdate[`i${registro.classe.className}`] = retorno.idGravado;
          modelUpdate['id'] = dadoRetornadoDTO.id;

          registro.service.database.write(() => {
            registro.service.database.create(registro.classe.className, modelUpdate, UpdateMode.Modified);
          });

          try {
            let modelGet = await registro.service.getById(modelUpdate, registro.classe);
            if (registro.newObject) {
              modelGet = ObjetoUtilsService.converteObjeto(ObjetoUtilsService.removeCamposNulos(modelGet),
                ObjetoUtilsService.copy(registro.newObject));
            }
            const retornoEnvio = await registro.service.trataRetornoEnvio(modelGet);

            let retornoPreSave = await registro.service.preSave(retornoEnvio, registro.classe, registro.classe.dependents);

            registro.service.database.write(() => {
              retornoPreSave = registro.service.guardaVersaoAnterior(retornoPreSave);
              registro.service.database.create(registro.classe.className, retornoPreSave, UpdateMode.Modified);
            });

          } catch (e) {
            manipuladorExcecoes.req(e);
          }
        } else if (retorno.idComErro > 0) {
          await new ErroSincronizacaoService().gravaErro(dadoRetornadoDTO.id, registro.classe.className, retorno?.message);
        }

        await new UltimaAtualizacaoModelService().setDataSincronizacao(registro.classe, false);
        setProgress(index++ / registrosEnviar.length);
        // }
        //}
      }
    }
    itensSyncEnv[0].finish = true;
  }

  // Variable to control receiving all data
  let receberTodosDados = false;

  async function receberTodosDadosIniciais() {
    const service = new ServiceGenerico<UltimaAtualizacaoModel>();
    await service.get(UltimaAtualizacaoModel, '', 'dataRecebimento >= ' + DateUtils.formatDateTimeToUs('2000-01-01', true), 'id', 'asc', 0,
      200).then(dados => {
        if (dados.conteudo?.length > 0) {
          for (let index in dados.conteudo) {
            itensSyncRec.forEach(item => {
              if (dados.conteudo[index].className === item.classe.className) {
                item.finish = true;
              }
            });
          }
        } else {
          receberTodosDados = true;
        }
      });

    await receberDados().then();
    receberTodosDados = false;
  }

  async function receberDados() {
    setProcessando(true);
    try {
      for (const item of itensSyncRec) {
        if (!item.finish) {
          let filtroCustomizado = item.filtros;
          item.ref?.focus();
          setProgressItem(item);

          await getDados(item.classe, item.colunas, filtroCustomizado, item.syncCustom,
            item.service ? item.service : new ServiceGenerico(), item.atributoUltimaSincronizacao);
          item.finish = true;
          setProgressItem(new ItemSync('', null, ''));
        }
      }
    } catch (e) {
      setVisibleRec(false);
      setProcessando(false);
      console.warn(e);
      manipuladorExcecoes.req(e);
    }
    setProcessando(false);
  }

  async function confirmarStepEnvioDeDados() {
    setVisibleEnv(false);

    itensSyncEnv.forEach(item => {
      item.finish = false;
    });

    setVisibleRec(true);
  }

  async function enviar() {
    setProcessando(true);

    try {
      await enviarFichas();
    } catch (e) {
      manipuladorExcecoes.req(e);
    }

    setProcessando(false);

    setTimeout(confirmarStepEnvioDeDados, 3000);
  }

  async function sincronizar() {
    setProcessando(true);
    await testaConexao();
    setProcessando(true);
    setVisibleEnv(true);
  }

  async function receber(carregarTodosDadosIniciais: boolean) {
    await setarDataInicialListasParaAtualizar();

    if (carregarTodosDadosIniciais) {
      receberTodosDadosIniciais().then();
    } else {
      await new UltimaAtualizacaoModelService().get(UltimaAtualizacaoModel, '', 'dataRecebimento != null', '', '', 0, 200).then(dados => {
        if (listItensRec.length > dados?.conteudo?.length) {
          receberTodosDadosIniciais().then();
        } else {
          receberDados().then();
        }
      });
    }
  }

  return (
    <View>
      <DialogOC
        visible={dialogBattery}
        title='Bateria'
        description={'A bateria está abaixo de 15%, carregue o dispositivo!'}
        onDismiss={() => setDialogBattery(false)}
      />
      <DialogOC
        visible={dialogInternet}
        title='Não foi possível estabelecer conexão'
        description={'Para sincronizar é necessária uma conexão estável com a internet!'}
        onDismiss={() => {
          setDialogInternet(false);
          // navigation.goBack();
          router.back();
        }}
      />
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titleMsg}>Deseja enviar os dados?</Text>
        <Text style={styles.subtitle}>
          Clique no botão abaixo para salvar na nuvem os dados coletados.
        </Text>
        <ButtonOC
          disabled={processando}
          text="Sincronizar"
          onPress={() => {
            sincronizar();
          }}
        />
        <Portal>
          <Dialog
            style={styles.dialog}
            visible={visibleRec}
            dismissable={false}
          >
            <KeepAwake />
            <Dialog.Title> {processando ? 'Recebendo dados' : 'Dados Recebidos'}</Dialog.Title>
            <Dialog.Content>
              {
                !processando ?
                  <View style={styles.finalizado}>
                    <Text style={styles.titleFinalizado}>IMPORTAÇÃO FINALIZADA</Text>
                  </View>
                  : false
              }
              <ScrollView style={{ height: '75%' }}>
                {
                  itensSyncRec.map(item => {
                    return (
                      <View
                        key={item.classe.className}
                        style={styles.content}
                      >
                        <View
                          style={styles.line}
                        >
                          <Text style={styles.title}>{item.nome}</Text>
                          <View style={{ alignItems: 'center' }}>
                            {
                              item.nome === progressItem.nome ?
                                <ActivityIndicator
                                  animating={true}
                                  size={sizes.icon}
                                  color={colors.primary}
                                  hidesWhenStopped={true}
                                />
                                :
                                item.finish ?
                                  <Icon
                                    name={'check'}
                                    size={sizes.icon}
                                    color={colors.primary}
                                  /> :
                                  <Text style={styles.aguarde}>
                                    Aguardando
                                  </Text>

                            }
                          </View>
                        </View>
                        <ProgressBarOC
                          style={styles.progressBar}
                          visible={item.classe.className === progressItem.classe?.className}
                          progress={progress}
                          indeterminate={false}
                        />
                      </View>
                    );
                  })
                }
              </ScrollView>
              <ButtonOC
                disabled={processando}
                text={'OK'}
                onPress={() => {
                  setVisibleRec(false);
                  itensSyncRec.forEach(item => {
                    item.finish = false;
                  });
                  // navigation.navigate('Home');
                  router.push('/home' as any);
                  
                }}
              />
            </Dialog.Content>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog
            style={styles.dialog}
            visible={visibleEnv}
            dismissable={false}
          >
            <KeepAwake />
            <Dialog.Title>
              Enviando Dados
            </Dialog.Title>

            <Dialog.Content>
              {
                !processando ?
                  <View style={styles.finalizado}>
                    <Text style={styles.titleFinalizado}>EXPORTAÇÃO FINALIZADA</Text>
                  </View>
                  : false
              }
              <ScrollView
                style={{ height: '75%' }}
              >
                <View
                  key="Fichas"
                  style={styles.content}
                >
                  <View style={styles.line}>
                    <Text style={styles.title}>Protocolo</Text>
                    <View style={{ alignItems: 'center' }}>
                      {
                        //itensSyncEnv[0].finish ?
                        true ?
                          <Icon
                            name={'check'}
                            size={sizes.icon}
                            color={colors.primary}
                          /> :
                          <ActivityIndicator
                            animating={true}
                            size={sizes.icon}
                            color={colors.primary}
                            hidesWhenStopped={true}
                          />
                      }
                    </View>
                  </View>
                  <ProgressBarOC
                    style={styles.progressBar}
                    visible={true}
                    progress={progress}
                    indeterminate={false}
                  />
                </View>
              </ScrollView>

              <ButtonOC
                text={'OK'}
                disabled={processando}
                onPress={confirmarStepEnvioDeDados}
              />
            </Dialog.Content>
          </Dialog>
        </Portal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  line: {
    flexDirection: 'row',
  },
  title: {
    fontSize: sizes.fontSmall,
    width: '70%',
  },
  content: {
    marginTop: 8
  },
  progressBar: {
    width: '70%',
    marginTop: 5,
    marginBottom: 5,
  },
  dialog: {
    height: '80%'
  },
  aguarde: {
    fontSize: hp('1.6%'),
    color: colors.primary
  },
  finalizado: {
    alignItems: 'center',
  },
  titleFinalizado: {
    fontWeight: 'bold',
    fontSize: sizes.fontSmall,
    color: colors.primary
  },
  titleMsg: {
    fontSize: sizes.fontLarge,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: sizes.fontMedium,
    marginBottom: '10%',
  },
});
