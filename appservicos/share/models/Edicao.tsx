import {PatchDTO} from './objects/PatchDTO';
import {GenericoDTO} from './objects/GenericoDTO';

export class Edicao extends PatchDTO<Edicao> implements GenericoDTO<Edicao> {
    static className = 'Edicao';

    steep: string;
    finalizado: boolean;
}
