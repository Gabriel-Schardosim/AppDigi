import {PatchDTO} from './objects/PatchDTO';
import {GenericoDTO} from './objects/GenericoDTO';

export class Sistema extends PatchDTO<Sistema> implements GenericoDTO<Sistema> {
    static endPoint = `/accounts/permissoes/listar-sistemas-usuario`;
    static api = 'accounts';
    static className = 'Sistema';

    iSistema: number;
    chavePublica: string;
    nome: string;
}
