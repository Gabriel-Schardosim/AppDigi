import Realm from 'realm';
// import {isObject} from 'lodash';
import isObject from 'lodash/isObject';


import {DadosPaginados} from '../models/objects/DadosPaginados';
import {RetornoDTO} from '../models/objects/RetornoDTO';
import {SortDirection} from '../components/data-table-oc/Order';
import api from './Api';
import {ObjetoUtilsService} from './ObjetoUtilsService';
import {GenericoDTO} from '../models/objects/GenericoDTO';
import {Dependent} from '../models/objects/Dependent';
import manipuladorExcecoes from "./ManipuladorExcecoes";
import configSistema from './ConfigSistema';
import {databaseConfig} from '../settings/Settings';
import {schemaDigiServicos} from '@/src/protocolo/database/SchemaDigiServicos';
import AtualizacaoDigiServicos from '@/src/protocolo/database/AtualizacaoDigiServicos';
import AtualizacaoGlobal from '../database/AtualizacaoGlobal';
import {StringUtilsService} from './StringUtilsService';
import UpdateMode = Realm.UpdateMode;

export enum LocalPersistencia {
  O = 'online',
  B = 'banco',
  P = 'padrao',
}

export default class ServiceGenerico<U extends GenericoDTO<U>> {
  // TODO colocar am algum lugar centralizado pois tem que compartilhar a conexão e não ficar conectando
  // com isso os metodos poderiam ser estáticos - pensar sobre
  public database!: Realm;

  constructor() {
    this.conectar();
  }

  conectar() {
    if (databaseConfig.sistema === 'digiCidade') {
      // TODO não pode apontar para o projeto
      databaseConfig.schema = schemaDigiServicos;
      if (databaseConfig.schema) {
        // TODO está sendi acionado várias vezes esse código, colocar um concole.log e verificar pois pode deixa o app lento
        this.database = new Realm({
          path: databaseConfig.path,
          schema: databaseConfig.schema,
          schemaVersion: 11,
          onMigration: (oldRealm: Realm, newRealm: Realm) => {
            AtualizacaoDigiServicos.atualizar(oldRealm, newRealm);
            AtualizacaoGlobal.atualizar(oldRealm, newRealm);
          }
        });
      } else {
        setInterval(() => {
          this.conectar();
        }, 30000);
      }
    }
  }

  fecharConexao() {
    if (this.database && !this.database?.isClosed) {
      this.database.close();
    }
  }

  async online(): Promise<boolean> {
    const config = await configSistema.getConfig();
    const online = config?.onlineOffline;
    //return online === 'online';
    return true;
  }

  async salvarOffline(localPersistencia: LocalPersistencia): Promise<boolean> {
    return localPersistencia === LocalPersistencia.B || (localPersistencia === LocalPersistencia.P && !(await this.online()))
  }

  async getById(model: any, classe: any, localPersistencia = LocalPersistencia.P): Promise<any> {
    if (await this.salvarOffline(localPersistencia)) {
      let u: any = {};

      return await new Promise<any>((resolve) => {
        if (model.id != null) {
          let registros = this.database.objectForPrimaryKey(classe.className, Number(model.id));
          if (registros) {
            u = JSON.parse(JSON.stringify(registros));
          }
        }

        resolve(u);
      })

    } else {
      return api.get<U>(classe, '', `i${classe.className} = ${model.id}`, `i${classe.className} asc`, 0, 1);
    }
  }

  async exist(classe: any, filtros: string = ''): Promise<boolean> {
    let exist: boolean = false;
    await this.get(classe, '', filtros).then(
      dadosPaginados => dadosPaginados?.conteudo.length > 0 ? exist = true : exist = false
    )
    return exist;
  }

  async autocomplete(classe: any, colunas: string = '', filtros: string = '',
                     ordem?: string, direcaoOrdem = 'asc',
                     pagina = 0, tamanhoPagina = 10, localPersistencia = LocalPersistencia.P): Promise<DadosPaginados<U>> {
    if (await this.salvarOffline(localPersistencia)) {
      return await this.get(classe, colunas, filtros, ordem, direcaoOrdem, pagina, tamanhoPagina, localPersistencia)
    } else {
      return api.get<U>(classe, colunas, filtros, ordem + ' ' + direcaoOrdem, pagina, tamanhoPagina);
    }
  }

  async get(classe: any, colunas: string = '', filtros: string = '',
            ordem?: string, direcaoOrdem = 'asc',
            pagina = 0, tamanhoPagina = 500, localPersistencia = LocalPersistencia.P, valoresFiltro: any[] = []): Promise<DadosPaginados<U>> {
    if (await this.salvarOffline(localPersistencia)) {
      const dadosPaginados = new DadosPaginados<U>();
      
      return await new Promise<DadosPaginados<U>>((resolve) => {
        let registros = this.database.objects<U>(classe.className);
        if (filtros !== '') {
          registros = registros.filtered(filtros, ...valoresFiltro);
        }

        if (ordem && ordem !== '' && direcaoOrdem) {
          registros = registros.sorted(ordem, direcaoOrdem === SortDirection.Desc);
        }

        const inicio = pagina * tamanhoPagina;
        const fim = inicio + tamanhoPagina;

        dadosPaginados.conteudo = JSON.parse(JSON.stringify(registros.slice(inicio, fim)));
        dadosPaginados.tamanhoDaPagina = tamanhoPagina;
        dadosPaginados.quantidadeDeRegistros = registros.length;
        dadosPaginados.quantidadeDePaginas = registros.length <= tamanhoPagina ? 1 : Math.ceil(registros.length / tamanhoPagina);
        dadosPaginados.numeroDaPagina = pagina;
        dadosPaginados.ultimaPagina = dadosPaginados.quantidadeDePaginas < (dadosPaginados.numeroDaPagina + 1);

        resolve(dadosPaginados);
      })
    } else {
      return api.get<U>(classe, colunas, filtros, ordem + ' ' + direcaoOrdem, pagina, tamanhoPagina);
    }
  }

  async save(model: U, classe: any, localPersistencia = LocalPersistencia.P): Promise<RetornoDTO> {
    let retorno = new RetornoDTO();
    if (await this.salvarOffline(localPersistencia)) {
      model = ObjetoUtilsService.removeObjetosVazios(model);

      await this.preSave(model, classe, classe.dependents).then(ret => {
        model = ret;
      });
      retorno.idGravado = model.id;

      const erro = this.saveWithArray(model, classe, classe.dependents, true);
      if (erro.error) {
        retorno = erro;
      }
    } else {
      return api.post(classe, [model]);
    }
    return retorno;
  }

  async preSave(model: any, classe: any, dependents: Array<Dependent> = [], idSum = 1, injetaId = false): Promise<any> {
    const objectKeys = Object.keys(model);
    if (dependents) {
      for (let key of objectKeys) {
        try {
          if (isObject(model[key]) && model[key].constructor.name !== 'Date') {
            let dependent: Dependent = dependents.filter(dep =>
              dep.attributeName ? dep.attributeName.toLowerCase() === key.toLowerCase() : dep.classe.className.toLowerCase() === key.toLowerCase()
            )[0]
            if (JSON.stringify(model[key]) !== '{}' && JSON.stringify(model[key]) !== '[]' && dependent != null) {
              if (ObjetoUtilsService.isArray(model[key])) {
                let array = new Array<any>();
                for (let index in (model as any)[key]) {
                  await this.preSave((model as any)[key][index], dependent.classe, dependents, (parseInt(index) + 1), injetaId).then(ret => {
                    array.push(ret);
                  });
                }
                model[key] = array;
              } else {
                await this.preSave(model[key], dependent.classe, dependents, idSum, injetaId).then(ret => {
                  model[key] = ret;
                });
              }
            } else if (JSON.stringify(model[key]) !== '{}' && JSON.stringify(model[key]) !== '[]') {
              if (injetaId) {
                model[key] = Object.keys(model[key]).reduce((object: { [key: string]: any }, k) => {
                  if (k.startsWith('i')) {
                    object['id'] = model[key][k]
                  }
                  return object
                }, {} as { [key: string]: any })
              } else {
                model[key] = Object.keys(model[key]).reduce((object: { [key: string]: any }, k) => {
                  if (k === 'id') {
                    object[k] = model[key][k]
                  }
                  return object
                }, {} as { [key: string]: any })
              }
            }
          }
        } catch (e) {
        }
      }
    }

    if (objectKeys.length > 0 && model.id == null) {
      if (model['i' + classe.className] != null) {
        await this.get(classe, '', 'i' + classe.className + '=' + model['i' + classe.className]).then(ret => {
          if (ret.conteudo && ret.conteudo[0]?.id != null) {
            model.id = ret.conteudo[0].id;
          }
        }).catch(e => {
          console.warn(e)
        });

        if (model.id == null) {
          let id;
          try {
            id = await this.database.objects<U>(classe.className).max("id") as number;
          } catch (e) {
          }
          id = (id ? id : 0) + idSum;
          model.id = id;
          model.dataCriacao = new Date().toString();
          model.dataUltimaAlteracao = model.dataCriacao;
        }
      } else {
        let id;
        try {
          id = await this.database.objects<U>(classe.className).max("id") as number;
        } catch (e) {
        }
        id = (id ? id : 0) + idSum;
        model.id = id;
        model.dataCriacao = new Date().toString();
        model.dataUltimaAlteracao = model.dataCriacao;
      }
    } else {
      model.dataUltimaAlteracao = new Date().toString();
    }

    return model;
  }

  private saveWithArray(model: { [key: string]: any }, classe: any, dependents: Array<Dependent>, save: boolean): RetornoDTO {
    const objectKeys = Object.keys(model);
    for (let key of objectKeys) {
      // if (isObject(model[key]) && model[key].constructor.name !== 'Date' && dependents) {
      if (isObject((model as any)[key]) && (model as any)[key].constructor.name !== 'Date' && dependents) {
        let dependent: Dependent = dependents.filter(dep =>
          dep.attributeName ? dep.attributeName.toLowerCase() === key.toLowerCase() : dep.classe.className.toLowerCase() === key.toLowerCase()
        )[0]
        if (JSON.stringify(model[key]) !== '{}' && JSON.stringify(model[key]) !== '[]' && dependent) {
          if (ObjetoUtilsService.isArray(model[key])) {
            for (let index in model[key]) {
              this.saveWithArray(model[key][index], dependent.classe, dependents, true);
            }
          } else {
            this.saveWithArray(model[key], dependent.classe, dependents, false);
          }
        }
      }
    }

    if (objectKeys.length > 0 && save && model.id != null) {
      try {
        this.database.write(() => {
          // this.database.create<U>(classe.className, model, UpdateMode.Modified);
          this.database.create<U>(classe.className, model as Partial<U>, UpdateMode.Modified);
        });
      } catch (e) {
        return new RetornoDTO().construtorComErro('Erro ao salvar: ' + e);
      }
    }

    return new RetornoDTO();
  }

  async preSaveSync(model: any, classe: any, dependents: Array<Dependent> = []): Promise<any> {
    dependents?.forEach(dependent => {
      if (dependent.path) {
        let object = ObjetoUtilsService.percorreCaminhoObjeto(model, dependent.path);
        if (ObjetoUtilsService.isArray(object)) {
          let array = new Array<any>();
          const subDependents = dependents.filter(value => dependent?.path && value?.path && value.path.indexOf(dependent?.path) >= 0 && value.path !== dependent.path);
          for (let index in object) {
            let item = ObjetoUtilsService.percorreCaminhoObjetoSetValue(object[index], 'id', object[index]['i' + dependent.classe.className]);
            item.dataCriacao = new Date().toString();
            item.dataUltimaAlteracao = item.dataCriacao;

            subDependents?.forEach(subDependent => {
              let subPath = subDependent.path?.split('.');
              subPath?.shift();
              item = ObjetoUtilsService.percorreCaminhoObjetoSetValue(item, subPath?.join('.') + '.id', ObjetoUtilsService.percorreCaminhoObjeto(item, subPath?.join('.') + '.i' + subDependent.classe.className));
              item = ObjetoUtilsService.percorreCaminhoObjetoSetValue(item, subPath?.join('.') + '.dataCriacao', new Date().toString());
              item = ObjetoUtilsService.percorreCaminhoObjetoSetValue(item, subPath?.join('.') + '.dataUltimaAlteracao', new Date().toString());
            });

            array.push(item);
          }
          model = ObjetoUtilsService.percorreCaminhoObjetoSetValue(model, dependent.path, array)
        } else {
          model = ObjetoUtilsService.percorreCaminhoObjetoSetValue(model, dependent.path + '.id', ObjetoUtilsService.percorreCaminhoObjeto(model, dependent.path + '.i' + dependent.classe.className));
          model = ObjetoUtilsService.percorreCaminhoObjetoSetValue(model, dependent.path + '.dataCriacao', new Date().toString());
          model = ObjetoUtilsService.percorreCaminhoObjetoSetValue(model, dependent.path + '.dataUltimaAlteracao', new Date().toString());
        }
      }
    });    
    if (model.id == null) {
      model.id = model['i' + classe.className];
      model.dataCriacao = new Date().toString();
      model.dataUltimaAlteracao = model.dataCriacao;
    } else {
      model.dataUltimaAlteracao = new Date().toString();
    }
    return model;
  }

  async delete(model: U, classe: any, localPersistencia = LocalPersistencia.P, cascade = true): Promise<RetornoDTO> {
    const retorno = new RetornoDTO();    
    if (await this.salvarOffline(localPersistencia)) {
      if (model.id != null) {
        try {
          retorno.idExcluido = model.id;

          let registros = await this.database.objectForPrimaryKey(classe.className, Number(model.id));

          if (classe?.dependents?.length > 0 && registros && cascade) {
            for (const dependente of classe.dependents) {
              const atributo = dependente?.attributeName ? dependente.attributeName : StringUtilsService.firstLetterLower(dependente.classe.className);
              let dependentes = registros[atributo];
              if (dependentes) {
                this.database.write(() => {
                  this.database.delete(dependentes);
                });
              }
            }
          }

          this.database.write(() => {
            this.database.delete(registros);
          });

        } catch (e) {
          return new RetornoDTO().construtorComErro('Erro ao excluir: ' + e);
        }
      }
    } else {
      return api.delete(classe, model.id);
    }
    return retorno;
  }

  async valid(model: U): Promise<RetornoDTO> {
    return new RetornoDTO();
  }

  async trataRecebimento(model: any): Promise<U> {

    return model;
  }

  /**
   * {@deprecated verificar a necessidade e se possível trocar por função mais simples}
   */
  async preparaEnvio(model: any, classe: any, dependents: Array<Dependent> = []): Promise<U> {
    if (dependents) {
      const objectKeys = Object.keys(model);
      for (let key of objectKeys) {
        try {
          if (key === 'edicoes') {
            model = ObjetoUtilsService.percorreCaminhoObjetoDelete(model, 'edicoes')
          } else if (isObject(model[key]) && model[key].constructor.name !== 'Date') {
            let dependent: Dependent = await dependents.filter(dep =>
              dep.attributeName ? dep.attributeName.toLowerCase() === key.toLowerCase() : dep.classe.className.toLowerCase() === key.toLowerCase()
            )[0]
            if (JSON.stringify(model[key]) !== '{}' && JSON.stringify(model[key]) !== '[]' && dependent != null) {
              if (ObjetoUtilsService.isArray(model[key])) {
                let array = new Array<any>();
                const modelRecord = model as Record<string, any>;
                for (let index in modelRecord[key]) {
                  await new ServiceGenerico().preparaEnvio(modelRecord[key][index], dependent.classe, dependents).then(ret => {
                    array.push(ret);
                  });
                }
                model[key] = array;
              } else {
                await new ServiceGenerico().preparaEnvio(model[key], dependent.classe, dependents).then(ret => {
                  model[key] = ret;
                });
              }
            } else if (JSON.stringify(model[key]) !== '{}' && JSON.stringify(model[key]) !== '[]') {
              model[key] = Object.keys(model[key]).reduce((object: Record<string, any>, k) => {
                if (k === 'i' + key.charAt(0).toUpperCase() + key.slice(1) && k !== 'id') {
                  object[k] = model[key][k]
                }
                return object
              }, {} as Record<string, any>)
            }
          }
        } catch (e) {
          manipuladorExcecoes.req(e);
        }
      }
    }

    return model;
  }

  async trataRetornoEnvio(model: U): Promise<U> {
    return model;
  }

  guardaVersaoAnterior(model: U): U {
    return model;
  }
}
