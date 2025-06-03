import {PatchDTO} from '@/share/models/objects/PatchDTO';
import {GenericoDTO} from '@/share/models/objects/GenericoDTO';
import {apiUrls} from '@/share/settings/Settings';

export class Parecer extends PatchDTO<Parecer> implements GenericoDTO<Parecer> {
    static endPoint = `${apiUrls.protocolo}/parecer`;
    static api = apiUrls.protocolo;
    static className = 'Parecer';

    iParecer: number;
    descricao: string;
}
