import {PatchDTO} from '@/share/models/objects/PatchDTO';
import {GenericoDTO} from '@/share/models/objects/GenericoDTO';
import {apiUrls} from '@/share/settings/Settings';

export class Setor extends PatchDTO<Setor> implements GenericoDTO<Setor> {
    static endPoint = `${apiUrls.protocolo}/setor`;
    static api = apiUrls.protocolo;
    static className = 'Setor';

    iSetor: number;
    descricao: string;
}
