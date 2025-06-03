import Realm from 'realm';

import ServiceGenerico from './ServiceGenerico';
import {ErroSincronizacao} from '../models/ErroSincronizacao';
import UpdateMode = Realm.UpdateMode;

export class ErroSincronizacaoService extends ServiceGenerico<ErroSincronizacao> {

  async gravaErro(idFicha: number, nomeFicha: string, errosEnvio: string) {
    const erro = new ErroSincronizacao();
    erro.nomeFicha = nomeFicha;
    erro.idFicha = idFicha;
    erro.errosEnvio = errosEnvio;
    erro.data = new Date().toString();

    const id = await this.database.objects<ErroSincronizacao>(ErroSincronizacao.className).max('id') as number;
    erro.id = id > 0 ? id + 1 : 1;

    this.database.write(() => {
      this.database.create(ErroSincronizacao.className, erro, UpdateMode.Modified);
    });

  }

  async alteraStatus(id: number, className: string) {
    await this.get(ErroSincronizacao, '', 'idFicha = ' + id + ' AND cadastroAlterado = false AND nomeFicha = "' + className + '"', '', '', 0, 500).then(retorno => {
      if (retorno?.conteudo?.length > 0) {
        retorno.conteudo.forEach(erro => {
          erro.cadastroAlterado = true;
          this.database.write(() => {
            this.database.create(ErroSincronizacao.className, erro, UpdateMode.Modified);
          });

        })
      }
    });
  }

  async possuiErro(id: number, className: string): Promise<boolean> {
    if (id > 0 && className) {
      const retorno = await this.get(ErroSincronizacao, '',
        'idFicha = ' + id + ' AND cadastroAlterado = false AND nomeFicha = "' + className + '"',
        '', '', 0, 1);
      return new Promise(resolve => resolve(retorno?.conteudo?.length > 0));
    } else {
      return new Promise(resolve => resolve(false));
    }
  }

}
