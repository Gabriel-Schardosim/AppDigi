import {PatchDTO} from './objects/PatchDTO';
import {GenericoDTO} from './objects/GenericoDTO';

export class UltimaAtualizacaoModel extends PatchDTO<UltimaAtualizacaoModel> implements GenericoDTO<UltimaAtualizacaoModel> {
    static className = 'UltimaAtualizacaoModel';

    dataRecebimento: string;
    dataEnvio: string;
    className: string
}
