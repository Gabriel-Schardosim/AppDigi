import {PatchDTO} from './objects/PatchDTO';
import {GenericoDTO} from './objects/GenericoDTO';

export class Entidade extends PatchDTO<Entidade> implements GenericoDTO<Entidade> {
    static endPoint = `/accounts/entidades`;
    static api = 'accounts';
    static className = 'Entidade';

    iEntidade: number;
    cnpj: string;
    nome: string;
    chavePublica: string;
}
