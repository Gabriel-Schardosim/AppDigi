import {PatchDTO} from './objects/PatchDTO';
import {GenericoDTO} from './objects/GenericoDTO';

export class Modulo extends PatchDTO<Modulo> implements GenericoDTO<Modulo> {
    static endPoint = `/accounts/permissoes/listar-modulos-usuario`;
    static api = 'accounts';
    static className = 'Modulo';

    iModulo: number;
    chavePublica: string;
    nome: string;
}
