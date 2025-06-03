import Realm from 'realm';

import ServiceGenerico, {LocalPersistencia} from '@/share/services/ServiceGenerico';
import {UltimaAtualizacaoModel} from "../models/UltimaAtualizacaoModel";
import UpdateMode = Realm.UpdateMode;

export class UltimaAtualizacaoModelService extends ServiceGenerico<UltimaAtualizacaoModel> {

    static decrementaMargemSinc(data: string): string {
        let dataTemp = new Date(data);
        dataTemp.setTime(dataTemp.getTime() - 600000);
        return dataTemp.toISOString();
    }


    async getDataSincronizacao(model: any, recebimento: boolean): Promise<string> {
        const pagina = await new ServiceGenerico<UltimaAtualizacaoModel>()
            .get(UltimaAtualizacaoModel, '', `className='${model.className}'`, '', '', 0, 1, LocalPersistencia.B);
        if (recebimento) {
            return pagina?.conteudo[0]?.dataRecebimento;
        } else {
            return pagina?.conteudo[0]?.dataEnvio;
        }
    }

    async setDataSincronizacao(model: any, recebimento: boolean) {
        const pagina = await new ServiceGenerico<UltimaAtualizacaoModel>()
            .get(UltimaAtualizacaoModel, '', `className='${model.className}'`, '', '', 0, 1, LocalPersistencia.B);

        const service = new ServiceGenerico();

        let registro = new UltimaAtualizacaoModel();
        if (pagina?.conteudo?.length > 0) {
            registro = pagina.conteudo[0];
        } else {
            const id = await service.database.objects<UltimaAtualizacaoModel>(UltimaAtualizacaoModel.className).max('id') as number;
            registro.id = id > 0 ? id + 1 : 1;
        }
        if (recebimento) {
            registro.dataRecebimento = new Date().toString();
        } else {
            registro.dataEnvio = new Date().toString();
        }
        registro.className = model.className;

        service.database.write(() => {
            service.database.create(UltimaAtualizacaoModel.className, registro, UpdateMode.Modified);
        });

    }
}
