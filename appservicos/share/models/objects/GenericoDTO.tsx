export interface GenericoDTO<U extends GenericoDTO<U>> {
  id: number;
  dataCriacao: string;
  dataUltimaAlteracao: string;
}
