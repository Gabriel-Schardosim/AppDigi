import {PatchDTO} from '@/share/models/objects/PatchDTO';
import {GenericoDTO} from '@/share/models/objects/GenericoDTO';
import {apiUrls} from '@/share/settings/Settings';

export class Cidade extends PatchDTO<Cidade> implements GenericoDTO<Cidade> {
    static endPoint = `${apiUrls.protocolo}/cidade`;
    static api = apiUrls.protocolo;
    static className = 'Cidade';

    iCidade: number;
    descricao: string;
}
