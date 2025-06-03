import {PatchDTO} from './objects/PatchDTO';
import {GenericoDTO} from './objects/GenericoDTO';

export class EntidadeLocalizacao extends PatchDTO<EntidadeLocalizacao> implements GenericoDTO<EntidadeLocalizacao> {
    static endPoint = `/accounts/permissoes/listar-localizacoes-usuario`;
    static api = 'accounts';
    static className = 'EntidadeLocalizacao';

    iEntidadeLocalizacao: number;
    nome: string;
    chavePublica: string;
}
