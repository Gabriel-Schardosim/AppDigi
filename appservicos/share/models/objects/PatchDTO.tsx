import {UsuarioAudit} from './UsuarioAudit';

export class PatchDTO<U> {
  id: number;
  dataCriacao: string;
  dataUltimaAlteracao: string;
  criadoPor: UsuarioAudit;
  alteradoPor: UsuarioAudit;
  keys: Array<string>;
  erros: Array<string>;
  excluir: boolean;
  alterado: boolean;
  flagAtivo: boolean;
  motivoInatividade: string;
}
