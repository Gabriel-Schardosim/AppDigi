export class Column {
  text: string;
  path: string;
  filter: string; // To use when we need to filter with a diferent attribute
  getValue?: Function;
  main: boolean;
  type: '' | 'cpf' | 'date' | 'datetime' | 'cns' | 'cep' | 'email' | 'celular' | 'telefone' | 'cpf-cnpj' | 'number' | 'custom' | 'custom-numeric' | 'image' | 'boolean';
  outCard: boolean;


  constructor(text: string, path: string, main?: boolean,
              type?: '' | 'cpf' | 'date' | 'datetime' | 'cns' | 'cep' | 'email' | 'celular' | 'telefone' | 'cpf-cnpj' | 'number' | 'custom' | 'custom-numeric' | 'image' | 'boolean',
              outCard?: boolean, getValue?: Function, filter?: string) {
    this.text = text;
    this.path = path;
    this.filter = filter ? filter : path;
    this.main = main ? main : false;
    this.type = type ? type : '';
    this.outCard = outCard ? outCard : false;
    this.getValue = getValue;
  }
}
