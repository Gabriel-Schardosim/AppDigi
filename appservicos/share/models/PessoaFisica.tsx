export class PessoaFisica {
    cpf: string;
    dataNascimento?: string;
  
    constructor(cpf: string, dataNascimento?: string) {
      this.cpf = cpf;
      this.dataNascimento = dataNascimento;
    }
  
    static fromJson(json: any): PessoaFisica {
      return new PessoaFisica(json.cpf, json.dataNascimento);
    }
  
    toJson(): any {
      return {
        cpf: this.cpf,
        dataNascimento: this.dataNascimento,
      };
    }
  }
  