import ServiceGenerico from '@/share/services/ServiceGenerico';
import {RetornoDTO} from '@/share/models/objects/RetornoDTO';
import {Pessoa} from '@/share/models/Pessoa';

//import {PessoaFisicaService} from './PessoaFisicaService';
import {Validator} from '@/share/services/Validator';

export class PessoaService extends ServiceGenerico<Pessoa> {

  async valid(pessoa: Pessoa): Promise<RetornoDTO> {
    let retornoDTO: RetornoDTO;

    retornoDTO = await new PessoaFisicaService().valid(pessoa.pessoaFisica);
    if (retornoDTO.error) {
      return retornoDTO;
    }

    retornoDTO = await Validator.validaNome(pessoa.nome, 'nome');
    if (retornoDTO.error) {
      return retornoDTO;
    }

    return retornoDTO
  }

}
