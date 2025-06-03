import {PatchDTO} from './objects/PatchDTO';
import {GenericoDTO} from './objects/GenericoDTO';

export class Contato extends PatchDTO<Contato> implements GenericoDTO<Contato> {
    static className = 'Contato';

    iContato: number;
    tipoContato: string;
    contato: string;

}
