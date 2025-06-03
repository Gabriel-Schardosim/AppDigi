import {PessoaFisica} from './PessoaFisica';
import {GenericoDTO} from './objects/GenericoDTO';

export class Pessoa implements GenericoDTO<Pessoa> {
    id: number; // <-- obrigatório, sem "| undefined"
    nome: string;
    pessoaFisica: PessoaFisica;
  
    dataCriacao: string;
    dataUltimaAlteracao: string;
  
    constructor() {
      this.id = 0;
      this.nome = '';
      this.pessoaFisica = new PessoaFisica('000.000.000-00'); // Replace with a valid CPF
      this.dataCriacao = new Date().toISOString();
      this.dataUltimaAlteracao = new Date().toISOString();
    }
  }