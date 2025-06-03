import { Cidade } from '@/src/protocolo/models/Cidade';
import {Usuario} from './Usuario';

export class Session {
  token: string = '';
  context: string = '';
  cidade: Cidade = new Cidade();
  usuario: Usuario = new Usuario();
}
