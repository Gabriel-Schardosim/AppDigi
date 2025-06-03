import {PatchDTO} from '@/share/models/objects/PatchDTO';
import {GenericoDTO} from '@/share/models/objects/GenericoDTO';
import {apiUrls} from '@/share/settings/Settings';
import { Setor } from './Setor';
import { Parecer } from './Parecer';

export class Tramitacao extends PatchDTO<Tramitacao> implements GenericoDTO<Tramitacao> {
    static endPoint = '';
    static api = apiUrls.protocolo;
    static className = 'Tramitacao';

    iTramitacao: number;
    dataTramitacao: string;
    observacao: string;
    setor = new Setor();
    parecer = new Parecer();
}
