export class Usuario {
  iUsuario: string;
  cpfCnpj: string;
  senha: string;
  nome: string = '';
  foto: string;
  eMail: string;
  dataNascimento: Date;
  telefone: string;
  celular: string;
  ramal: string;
  flagNovidades: boolean;
  novaSenha?: string;
}
