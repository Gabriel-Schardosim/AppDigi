import {cloneDeep, isObject, transform} from 'lodash';
import {Dependent} from '../models/objects/Dependent';

export class ValoresEnums {
  propriedade: string;
  value: any;

  constructor(propriedade: string, value: any) {
    this.propriedade = propriedade;
    this.value = value;
  }
}

export class ObjetoUtilsService {

  constructor() {
  }

  static copy<T>(object: T): T {
    return cloneDeep(object);
  }

  static isNumeric(str: string) {
    let er = /^\d+(?:\.\d+)?$/;
    return (er.test(str));
  }

  static removeCamposNulos(dados: any, removeNull = true): any {
    for (const i in dados) {
      if (dados.hasOwnProperty(i) && (((dados[i] === null) && (removeNull)) || (dados[i] === undefined) ||
        (Array.isArray(dados[i]) && (dados[i].length === 0)))) {
        delete dados[i];
      } else if (typeof dados[i] === 'object') {
        ObjetoUtilsService.removeCamposNulos(dados[i]);
      }
    }
    return dados;
  }

  static removeNullEntryFromArray(object: any): any {
    return transform(object, (result, value, key) => {
      if (Array.isArray(value)) {
        result[key] = (value as Array<any>).filter(item => item !== undefined && item !== null);
      } else {
        result[key] = isObject(value) ? ObjetoUtilsService.removeNullEntryFromArray(value) : value;
      }
    });
  }

  static removeObjetosVazios(object: any): any {
    return transform(object, (result, value, key) => {
      if (isObject(value)) {
        if (JSON.stringify(value) === '{}') {
          result[key] = null;
        } else {
          const resultado = ObjetoUtilsService.removeObjetosVazios(value);
          result[key] = JSON.stringify(resultado) === '{}' ? null : resultado;
        }
      } else if ('i' + result.constructor.name === key.toString() && !value) {
        result = null;
      } else {
        result[key] = value;
      }
    });
  }

  static converteEnumParaArray(definition: Record<string, string>) {
    return Object.keys(definition).map(key => ({title: definition[key], value: key}));
  }

  static retornaChaveEnum(descricao: string, tipoEnum: any): string {
    try {
      if (descricao) {
        const itemEnum = ObjetoUtilsService.converteEnumParaArray(tipoEnum).find(value => descricao === value.title);
        return itemEnum ? itemEnum.value : '';
      } else {
        return '';
      }
    } catch (e) {
      return '';
    }
  }

  static retornaValorEnum(valor: string, tipoEnum: any): string {
    try {
      if (valor) {
        const itemEnum = ObjetoUtilsService.converteEnumParaArray(tipoEnum).find(value => valor === value.value);
        return itemEnum ? itemEnum.title : '';
      } else {
        return '';
      }
    } catch (e) {
      return '';
    }
  }

  static enumToValoresEnum(valor: string, tipoEnum: any) {
    return new ValoresEnums(ObjetoUtilsService.retornaValorEnum(valor.toString(), tipoEnum), valor.toString());
  }

  static enumToArrayValoresEnum(tipoEnum: any) {
    let arrayValoresEnum: Array<ValoresEnums> = [];
    let arrayEnum = ObjetoUtilsService.converteEnumParaArray(tipoEnum);
    arrayEnum.forEach((enumTemp, index) =>
      arrayValoresEnum.push(new ValoresEnums(enumTemp.value.toString(), enumTemp.title.toString()))
    );
    return arrayValoresEnum;
  }

  static converteValoresEnums(obj: any, enums: Array<ValoresEnums>): any {
    enums.forEach((en) => {
      if (obj.hasOwnProperty(en.propriedade)) {
        obj[en.propriedade] = ObjetoUtilsService.retornaValorEnum(obj[en.propriedade], en.value);
      }
    });
  }

  static ehIDdeDependente(key: string, classe: any): boolean {
    if (classe.dependents) {
      return classe.dependents.findIndex((dependent: Dependent) => 'i' + dependent.classe.className === key) >= 0;
    } else {
      return false;
    }
  }

  static removeValoresIguais(classe: any, objeto: any, comparacao: any, atributosParaRemover: string[] = []): any {
    const objectKeys = Object.keys(objeto);
    for (let key of objectKeys) {
      try {
        // TODO problema com os arrays
        if (objeto[key]?.constructor?.name == 'Array') {
          console.log('666', key, objeto[key], comparacao[key])


          // Percorre o array anterior verificando se algum item foi excluído, nesse caso adiciona no novo com excluir = true
          if (comparacao && comparacao[key]?.length > 0) {
            comparacao[key].forEach((objAnt: any, index: number) => {
              if (objeto[key].findIndex((objNovo: any) => objNovo.id === objAnt.id) < 0) {
                let obj: { [key: string]: any } = {};
                let dependent: any;

                if (classe.dependents) {
                  dependent = classe.dependents.find((dependent: Dependent) => 'i' + dependent.classe.className === key || dependent.attributeName === key);
                }

                console.log('dependent', key, dependent)
                if (dependent?.classe?.className) {
                  obj['i' + dependent.classe.className] = objAnt['i' + dependent.classe.className]
                } else {
                  obj = ObjetoUtilsService.removeValoresIguais(classe, objAnt, {}, atributosParaRemover)
                }

                obj['excluir'] = true;
                objeto[key].push(obj);
                console.log('EXCLUIDO', obj)
              }
            });
          }

          // TODO remover logs

          // Percorre ambos arrays mantendo somente o que foi alterado(recursivamente)
          if (objeto[key].length > 0 && comparacao && comparacao[key]?.length > 0) {
            objeto[key].forEach((obj: any, index: number) => {
              if (!obj.excluir) {
                console.log('ALTERADO', obj)
                const itemComparacao = comparacao[key].find((objNovo: any) => objNovo.id === obj.id)
                const ret = ObjetoUtilsService.removeValoresIguais(classe, obj, itemComparacao, atributosParaRemover)
                if (JSON.stringify(ret) !== '{}') {
                  console.log('ALTERADO RET', JSON.stringify(ret))
                  objeto[key][index] = ret;
                } else {
                  console.log('APAGA', key);
                  delete objeto[key][index];
                }
              }
            });
          }

          if (objeto[key].length === 0) {
            delete objeto[key];
          }
          // Caso o valor atual seja igual ao anterior ou o atributo em questão deva ser removido
        } else if (isObject(objeto[key]) && comparacao && comparacao[key]) {
          if (JSON.stringify(objeto[key]) !== '{}') {
            const ret = ObjetoUtilsService.removeValoresIguais(classe, objeto[key], comparacao[key], atributosParaRemover);
            if (ret && JSON.stringify(objeto[key]) !== '{}') {
              objeto[key] = ret;
            } else {
              delete objeto[key];
            }
          }
          // TODO se for dependente não remover o id
        } else if (((comparacao && objeto[key] == comparacao[key]) ||
          (atributosParaRemover && atributosParaRemover.findIndex(value => value == key) >= 0)) &&
          !ObjetoUtilsService.ehIDdeDependente(key, classe)) {
          delete objeto[key];
        }
      } catch (e) {
        console.warn(key + e)
      }
    }
    return objeto;
  }

  static preparaObjetoParaPatch(classe: any, anterior: any, atual: any, atributosParaRemover: string[] = []) {
    console.log('1', JSON.stringify(atual));

    const retorno = ObjetoUtilsService.removeNullEntryFromArray(ObjetoUtilsService.removeValoresIguais(classe, atual, anterior, atributosParaRemover));
    retorno['i' + classe.className] = anterior['i' + classe.className];
    retorno['flagAtivo'] = anterior['flagAtivo'];
    retorno['motivoInatividade'] = anterior['motivoInatividade'];

    // console.log('2', JSON.stringify(retorno));
    return retorno;
  }


  static mantemSomenteCampo(object: any, campos: Array<string>): any {
    if (object === undefined) {
      return undefined;
    } else if (object === null) {
      return null;
    } else {
      return transform(object, (result, value, key) => {
        if (campos.indexOf(key.toString()) >= 0) {
          result[key] = value;
        }
      });
    }
  }

  static percorreCaminhoObjeto(obj: any, path: string): any {
    let current = obj;
    if (obj && path) {
      const pathArray = path.split('.');
      while (pathArray.length) {
        if (typeof current !== 'object') {
          return undefined;
        }

        if (current) {
          current = current[pathArray.shift()!];
        } else {
          pathArray.shift();
        }
      }
    }
    return current;
  }

  static percorreCaminhoObjetoSetValue(objeto: any, path: string, value: any): any {
    if (objeto) {
      try {
        const atributos = path.split('.');
        if (atributos.length === 1) {
          objeto[atributos[0]] = value;
        } else {
          const pathRestante = atributos.slice(1, atributos.length).join('.');
          objeto[atributos[0]] = ObjetoUtilsService.percorreCaminhoObjetoSetValue(objeto[atributos[0]], pathRestante, value);
        }
      } catch (e) {
        console.warn(e)
      }
    }
    return objeto;
  }

  static percorreCaminhoArraySetValue(objeto: any, path: string, value: any): any {
    if (value !== null && objeto) {
      let atributos = path.split('.');
      if (atributos.filter(atr => atr.includes('[') && atr.includes(']')).length > 0) {
        objeto = objeto[atributos.filter(atr => atr.includes('[') && atr.includes(']'))[0].replace('[', '').replace(']', '')];
        atributos = atributos.filter(atr => !(atr.includes('[') && atr.includes(']')));
      }
      if (atributos.length === 1) {
        objeto[atributos[0]] = value;
      } else {
        const pathRestante = atributos.slice(1, atributos.length).join('.');
        objeto[atributos[0]] = ObjetoUtilsService.percorreCaminhoObjetoSetValue(objeto[atributos[0]], pathRestante, value);
      }
    }
    return objeto;
  }

  static percorreCaminhoObjetoDelete(objeto: any, path: string): any {
    if (objeto) {
      try {
        const atributos = path.split('.');
        if (atributos.length === 1) {
          delete objeto[atributos[0]];
        } else {
          const pathRestante = atributos.slice(1, atributos.length).join('.');
          objeto[atributos[0]] = ObjetoUtilsService.percorreCaminhoObjetoDelete(objeto[atributos[0]], pathRestante);
        }
      } catch (e) {
        console.warn(e)
      }
    }
    return objeto;
  }

  static criaObjeto(path: string, valor: any, objeto: { [key: string]: any } = {}): any {
    let atributos = path.split('.');
    atributos = atributos.reverse();
    atributos.forEach((atributo, index) => {
      if (index === 0) {
        objeto[atributo] = valor;
      } else {
        const objetoTemp = objeto;
        objeto = {};
        objeto[atributo] = ObjetoUtilsService.copy(objetoTemp);
      }
    });
    return objeto;
  }

  static moveElementoArray<T>(array: T[], elemento: T, posicao: number): T[] {
    const oldIndex = array.indexOf(elemento);
    if (oldIndex > -1) {
      let newIndex = (oldIndex + posicao);

      if (newIndex < 0) {
        newIndex = 0;
      } else if (newIndex >= array.length) {
        newIndex = array.length;
      }

      const arrayClone = array.slice();
      arrayClone.splice(oldIndex, 1);
      arrayClone.splice(newIndex, 0, elemento);

      return arrayClone;
    } else {
      return array;
    }
  }

  static converteFlag(flag: any): string {
    return flag === true ? 'Sim' : flag === false ? 'Não' : '';
  }

  static converteFlagAtivo(dados: Array<any>): Array<any> {
    dados.forEach((dado) => {
      dado.flagAtivo = ObjetoUtilsService.converteFlag(dado.flagAtivo);
    });
    return dados;
  }

  static converteObjeto(origem: { [key: string]: any }, destino: { [key: string]: any }): any {
    const objectKeys = Object.keys(origem);
    for (let key of objectKeys) {
      try {
        if (isObject(origem[key])) {
          if (JSON.stringify(origem[key]) !== '{}') {
            if (destino[key] === undefined) {
              destino[key] = {};
            }
            ObjetoUtilsService.converteObjeto(origem[key], destino[key]);
          } else if (JSON.stringify(origem[key]) === '{}' && destino[key] && destino[key].constructor.name == 'Array') {
            destino[key] = [];
          }
        } else {
          destino[key] = origem[key];
        }
      } catch (e) {
        console.warn(key + e)
      }
    }
    return destino;
  }

  static isArray(o: any): boolean {
    return (o != null && typeof (o.length) != "undefined");
  }

  static convertObjectToArrayRealm<U>(obj: any): U[] {
    const retorno: U[] = [];
    if (obj) {
      const itens: any[] = Object.keys(obj);
      if (itens?.length > 0) {
        itens.forEach(item => {
          retorno.push(obj[item]);
        });
      }
    }
    return retorno;
  }
}
