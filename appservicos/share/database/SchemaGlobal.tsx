import Realm from 'realm';

import {Contato} from '../models/Contato';
import {Edicao} from '../models/Edicao';
import {UltimaAtualizacaoModel} from '../models/UltimaAtualizacaoModel';
import {Entidade} from '../models/Entidade';

export const columnsDefault = {
    id: 'int',
    dataCriacao: 'date?',
    dataUltimaAlteracao: 'date?',
    // criadoPor: 'string?',
    // alteradoPor: 'string?',
    flagAtivo: {type: 'bool', optional: true, default: true},
    motivoInatividade: 'string?',
};

export const schemaGlobal: Realm.ObjectSchema[] = [
    {
        name: UltimaAtualizacaoModel.className,
        primaryKey: 'id',
        properties: {
            dataRecebimento: 'date?',
            dataEnvio: 'date?',
            className: 'string',
            ...columnsDefault
        }
    },
    {
        name: Edicao.className,
        primaryKey: 'id',
        properties: {
            steep: 'string?',
            finalizado: {type: 'bool', optional: true, default: false},
            ...columnsDefault
        }
    },    
    {
        name: Contato.className,
        primaryKey: 'id',
        properties: {
            iContato: {type: 'int', optional: true, indexed: true},
            tipoContato: 'string',
            contato: 'string',
            ...columnsDefault
        }
    },
    {
        name: Entidade.className,
        primaryKey: 'id',
        properties: {
            iEntidade: {type: 'int', optional: true, indexed: true},
            cnpj: 'string?',
            nome: 'string?',
            chavePublica: 'string?',
            ...columnsDefault
        }
    }
];
