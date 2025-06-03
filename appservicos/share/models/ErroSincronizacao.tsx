import {PatchDTO} from './objects/PatchDTO';
import {GenericoDTO} from './objects/GenericoDTO';

export class ErroSincronizacao extends PatchDTO<ErroSincronizacao> implements GenericoDTO<ErroSincronizacao> {
    static className = 'ErroSincronizacao';

    idFicha: number;
    nomeFicha: string;
    errosEnvio: string;
    data: string;
    cadastroAlterado: boolean;
}
