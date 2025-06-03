import {PatchDTO} from '@/share/models/objects/PatchDTO';
import {GenericoDTO} from '@/share/models/objects/GenericoDTO';
import {apiUrls} from '@/share/settings/Settings';

export class Assunto extends PatchDTO<Assunto> implements GenericoDTO<Assunto> {
    static endPoint = `${apiUrls.protocolo}/assunto`;
    static api = apiUrls.protocolo;
    static className = 'Assunto';

    iAssunto: number;
    descricao: string;
}
