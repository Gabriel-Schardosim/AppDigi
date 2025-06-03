import {apiUrls} from '../settings/Settings';
import {PatchDTO} from './objects/PatchDTO';
import {GenericoDTO} from './objects/GenericoDTO';

export class ClienteCloudMessage extends PatchDTO<ClienteCloudMessage> implements GenericoDTO<ClienteCloudMessage> {
    static endPoint = '/global/clientes-cloud-message';
    static api = apiUrls.api;
    static className = 'ClienteCloudMessage';

    iClienteCloudMessage: number;
    chave: string;
    cpfCnpj: string;
    nomeAplicativo: string;
}
