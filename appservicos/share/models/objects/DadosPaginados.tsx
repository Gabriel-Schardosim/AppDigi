export class DadosPaginados<U> {
    conteudo: Array<U>;
    numeroDaPagina: number;
    quantidadeDePaginas: number;
    quantidadeDeRegistros: number;
    tamanhoDaPagina: number;
    ultimaPagina: boolean;
}

export enum TamanhoDaPagina {
  t10 = '10',
  t25 = '25',
  t50 = '50',
  t100 = '100'
}
