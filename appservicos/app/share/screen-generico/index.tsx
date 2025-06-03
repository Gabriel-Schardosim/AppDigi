import React from 'react';

import ServiceGenerico, {LocalPersistencia} from '@/share/services/ServiceGenerico';
import {RetornoDTO} from '@/share/models/objects/RetornoDTO';
import {GenericoDTO} from '@/share/models/objects/GenericoDTO';
import {ObjetoUtilsService} from '@/share/services/ObjetoUtilsService';
import {Edicao} from '@/share/models/Edicao';
import {ErroSincronizacaoService} from '@/share/services/ErroSincronizacaoService';

export class ScreenGenerico<U extends GenericoDTO<U>> {

  title: string;
  route: string;
  classe: any;
  service: ServiceGenerico<any>;
  onCancel?: (() => void);
  onRegister?: (() => void);
  onDelete?: (() => void);
  steepList?: Array<ScreenGenerico<U>>;
  screenDependent?: ScreenGenerico<U>;

  constructor(title: string, route: string, classe?: any, service?: ServiceGenerico<any>, onCancel?: (() => void),
              onRegister?: (() => void), onDelete?: (() => void), steepList?: Array<ScreenGenerico<U>>, screenDependent?: ScreenGenerico<U>) {
    this.title = title;
    this.route = route;
    this.classe = classe;
    this.service = service ? service : new ServiceGenerico();
    this.onCancel = onCancel;
    this.onRegister = onRegister;
    this.onDelete = onDelete;
    this.steepList = steepList;
    this.screenDependent = screenDependent;
  }

  async nextDependent(model: U, classe: any, id: number, path: string, modelDependent: U, screenGeneric: ScreenGenerico<U>): Promise<RetornoDTO> {
    model.id = id;
    model = await ObjetoUtilsService.converteObjeto(await this.service.getById(model, classe), model);
    let array = await ObjetoUtilsService.percorreCaminhoObjeto(model, path)
    if (array == null || JSON.stringify(array) === '{}') {
      array = [];
    } else if (modelDependent.id != null) {
      array = array.filter((ar: any) => ar.id !== modelDependent.id);
    }
    array.push(modelDependent);
    model = await ObjetoUtilsService.percorreCaminhoObjetoSetValue(model, path, array);
    return await this.next(model, screenGeneric);
  }

  async next(model: U, screenGeneric: ScreenGenerico<U> = this): Promise<RetornoDTO> {
    await this.saveEdition(model, screenGeneric).then(ret =>
      model = ret
    );
    const retornoDTO: RetornoDTO = await this.service.save(model, screenGeneric.classe);
    return retornoDTO;
  }

  async initializyGet(id: number): Promise<U> {
    let model: any = {id: id};
    await this.service.getById(model, this.classe).then(r => model = r);
    return model;
  }

  async delete(id: number, classe: any = this.classe): Promise<RetornoDTO> {
    let model: any = {id: id};

    if (model.id != null) {
      //await new ErroSincronizacaoService().alteraStatus(model.id, this.classe.className);
    }
    return await this.service.delete(model, classe, LocalPersistencia.O, true).then(r => model = r);
  }

  // TODO uremover futuramente pois não está sendo
  async saveEdition(model: U, screenGenerico: ScreenGenerico<U>, importado = false): Promise<U> {
    let edicaoDependent = screenGenerico?.classe?.dependents?.filter((dep: any) => dep.classe.className === Edicao.className)[0];
    if (edicaoDependent != null) {
      let edicoes = ObjetoUtilsService.percorreCaminhoObjeto(model, edicaoDependent.attributeName);
      if (edicoes?.length > 0) {
        let newEdicoes = new Array<Edicao>();
        edicoes.forEach((ed: Edicao) => {
          if (!ed.finalizado) {
            let edicao = new Edicao();
            edicao.id = ed.id;
            edicao.steep = ed.steep;
            if (this.screenDependent) {
              edicao.finalizado = ed.steep === this.route || ed.steep === this.screenDependent.route;
            } else {
              edicao.finalizado = ed.steep === this.route;
            }
            newEdicoes.push(edicao)
          } else {
            newEdicoes.push(ed)
          }
        });
        model = ObjetoUtilsService.percorreCaminhoObjetoSetValue(model, edicaoDependent.attributeName, newEdicoes);
      } else {
        edicoes = new Array<Edicao>()
        screenGenerico.steepList?.forEach(steep => {
          if (steep?.route != null) {
            let edicao = new Edicao();
            edicao.steep = steep.route;
            if (importado) {
              edicao.finalizado = true;
            } else {
              edicao.finalizado = steep.route === this.route;
            }
            edicoes.push(edicao);
          }
        });
        model = ObjetoUtilsService.percorreCaminhoObjetoSetValue(model, edicaoDependent.attributeName, edicoes);
      }
    }

    if (model.id != null) {
      await new ErroSincronizacaoService().alteraStatus(model.id, this.classe.className);
    }

    return model;
  }
}
