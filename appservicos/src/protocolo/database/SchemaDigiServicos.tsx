import {columnsDefault, schemaGlobal} from '@/share/database/SchemaGlobal';
import {ErroSincronizacao} from '@/share/models/ErroSincronizacao';
import { Protocolo } from '../models/Protocolo';
import { Assunto } from '../models/Assunto';
import { Setor } from '../models/Setor';
import { Parecer } from '../models/Parecer';
import { Tramitacao } from '../models/Tramitacao';
import { Cidade } from '../models/Cidade';

export const schemaDigiServicos: Realm.ObjectSchema[] = [
    ...schemaGlobal,
    {
        name: Protocolo.className,
        primaryKey: 'id',
        properties: {
            iProtocolo: 'int?',
            ano: 'int?',
            codigo: 'int?',
            codigoContribuinte: 'int?',
            cpfContribuinte: 'string?',
            descricao: 'string?',
            tramitacoes: {type: 'list', objectType: Tramitacao.className},
            assunto: {type: Assunto.className, optional: true},
            foto: 'string?',
            foto2: 'string?',
            dataProtocolo: 'date?',
            setor: {type: Setor.className, optional: true},
            dadosDaWeb: 'string?',
            statusSincronizacao: 'string?',        
            ...columnsDefault
        }
    },
    {
        name: Tramitacao.className,
        primaryKey: 'id',
        properties: {
            iTramitacao: {type: 'int', optional: true, indexed: true},
            dataTramitacao: 'date?',
            observacao: 'string?',
            setor: {type: Setor.className, optional: true},
            parecer: {type: Parecer.className, optional: true},
            ...columnsDefault
        }
    },
    {
        name: Assunto.className,
        primaryKey: 'id',
        properties: {
            iAssunto: 'int?',
            descricao: 'string',
            ...columnsDefault
        }
    },
    {
        name: Setor.className,
        primaryKey: 'id',
        properties: {
            iSetor: 'int?',
            descricao: 'string',
            ...columnsDefault
        }
    },
    {
        name: Parecer.className,
        primaryKey: 'id',
        properties: {
            iParecer: 'int?',
            descricao: 'string',
            ...columnsDefault
        }
    },
    {
        name: Cidade.className,
        primaryKey: 'id',
        properties: {
            iCidade: 'int?',
            descricao: 'string',
            ...columnsDefault
        }
    },    
    {
        name: ErroSincronizacao.className,
        primaryKey: 'id',
        properties: {
            idFicha: 'int?',
            nomeFicha: 'string?',
            errosEnvio: 'string?',
            data: 'date?',
            cadastroAlterado: {type: 'bool', optional: true, default: false},
            ...columnsDefault
        }
    },
];
