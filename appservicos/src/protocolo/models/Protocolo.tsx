import {PatchDTO} from '@/share/models/objects/PatchDTO';
import {GenericoDTO} from '@/share/models/objects/GenericoDTO';
import {Dependent} from '@/share/models/objects/Dependent';
import {apiUrls} from '@/share/settings/Settings';
import {StatusSincronizacao} from './enums/StatusSincronizacao';
import { Assunto } from './Assunto';
import { Tramitacao } from './Tramitacao';
import { Setor } from './Setor';

export class Protocolo extends PatchDTO<Protocolo> implements GenericoDTO<Protocolo> {
    static endPoint = `${apiUrls.protocolo}/protocolo`;
    static api = apiUrls.protocolo;
    static className = 'Protocolo';    
    static dependents = [
        new Dependent(Assunto),
    ];

    iProtocolo: number;
    ano: number;
    codigo: number;
    codigoContribuinte: number;
    cpfContribuinte: string;
    descricao: string;
    assunto: Assunto;
    tramitacoes = new Array<Tramitacao>();
    foto: string;
    foto2: string;
    dataProtocolo: string;
    setor = new Setor();
    dadosDaWeb: string;
    statusSincronizacao: StatusSincronizacao;
}
