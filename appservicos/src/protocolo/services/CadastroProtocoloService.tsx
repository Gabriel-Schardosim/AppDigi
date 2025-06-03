import ServiceGenerico, {LocalPersistencia} from '@/share/services/ServiceGenerico';
import {RetornoDTO} from '@/share/models/objects/RetornoDTO';
import api from '@/share/services/Api';
import {StatusSincronizacao} from '../models/enums/StatusSincronizacao';
import { Protocolo } from '../models/Protocolo';
import { getSession } from '@/share/services/Auth';

export class CadastroProtocoloService extends ServiceGenerico<Protocolo> {
    
    guardaVersaoAnterior(model: Protocolo): Protocolo {
        model.dadosDaWeb = '';
        model.dadosDaWeb = JSON.stringify(model);

        if (model.statusSincronizacao?.toString() != 'E') {
            model.statusSincronizacao = 'S' as StatusSincronizacao;
        }

        return model;
    }

    async save(Protocolo: Protocolo, classe: any, localPersistencia = LocalPersistencia.P): Promise<RetornoDTO> {        
        let retornoDTO = new RetornoDTO();
        Protocolo = await this.inicializa(Protocolo);

        const session = await getSession();
        Protocolo.cpfContribuinte = session.usuario.cpfCnpj;

        await this.valid(Protocolo).then(retorno => {
            if (retorno.error) {
                retornoDTO = retorno;
            }
        });
        if (retornoDTO.error) {
            return retornoDTO;
        }
        return super.save(Protocolo, classe, localPersistencia);
    }

    async valid(Protocolo: Protocolo): Promise<RetornoDTO> {
        let retornoDTO = new RetornoDTO();

        /*
        await this.validQuestionario(Protocolo.questionarios, Protocolo).then(retorno => {
            if (retorno.error) {
                retornoDTO = retorno;
            }
        });
        */

        if (retornoDTO.error) {
            return retornoDTO;
        }

        return retornoDTO
    }

    inicializa(Protocolo: Protocolo): Protocolo {
        return Protocolo
    }

    async trataRetornoEnvio(model: Protocolo): Promise<Protocolo> {
        if (model.iProtocolo) {
            //const session = await getSession();
            //string filtros = session.usuario.cpfCnpj;

            const dadosPaginados = await api.get<Protocolo>(Protocolo, `iProtocolo=${model.iProtocolo}`, `iProtocolo asc`, '', 0, 1);
            if (dadosPaginados.conteudo?.length > 0) {
                let ProtocoloOnline = dadosPaginados.conteudo[0];

                model.iProtocolo = ProtocoloOnline.iProtocolo;
                model.statusSincronizacao = 'S' as StatusSincronizacao;
                /*
                model.paciente.iPaciente = ProtocoloOnline.paciente.iPaciente;
                model.paciente.pessoa.iPessoa = ProtocoloOnline?.paciente?.pessoa?.iPessoa;
                model.paciente.pessoa.pessoaFisica.iPessoaFisica = ProtocoloOnline?.paciente?.pessoa?.pessoaFisica?.iPessoaFisica;
                if (ProtocoloOnline?.paciente?.pessoa?.pessoaEstrangeira?.iPessoaEstrangeira) {
                    model.paciente.pessoa.pessoaEstrangeira.iPessoaEstrangeira = ProtocoloOnline.paciente.pessoa.pessoaEstrangeira.iPessoaEstrangeira;
                }
                if (ProtocoloOnline?.paciente?.pessoa?.pessoaFisica?.deficienciaPessoaFisicas?.length > 0 && model.paciente.pessoa.pessoaFisica.deficienciaPessoaFisicas?.length > 0) {
                    ProtocoloOnline.paciente.pessoa.pessoaFisica.deficienciaPessoaFisicas.forEach(def => {
                        let deficienciaOnline = ProtocoloOnline.paciente.pessoa.pessoaFisica.deficienciaPessoaFisicas.filter(dpf => dpf.deficiencia.iDeficiencia == def.deficiencia.iDeficiencia)[0];
                        if (deficienciaOnline) {
                            def.iDeficienciaPessoaFisica = deficienciaOnline.iDeficienciaPessoaFisica;
                        }
                    })
                }

                if (ProtocoloOnline?.paciente?.pessoa?.contatos?.length > 0 && model?.paciente?.pessoa?.contatos?.length > 0) {
                    model.paciente.pessoa.contatos.forEach(cont => {
                        let contatoOnline = ProtocoloOnline.paciente.pessoa.contatos.filter(c => c.contato == cont.contato)[0];
                        if (contatoOnline) {
                            cont.iContato = contatoOnline.iContato;
                        }
                    })
                }
                if (ProtocoloOnline.questionarios?.length > 0 && model.questionarios?.length > 0) {
                    model.questionarios.forEach(que => {
                        let queOnline = ProtocoloOnline.questionarios.filter(q => q.uuid == que.uuid)[0];
                        if (queOnline) {
                            que.iQuestionario = queOnline.iQuestionario;


                            que.questionarioDoencas =
                                ObjetoUtilsService.convertObjectToArrayRealm<QuestionarioDoenca>(que.questionarioDoencas);

                            if (queOnline.questionarioDoencas?.length > 0 && que.questionarioDoencas?.length > 0) {
                                que.questionarioDoencas.forEach(doenca => {
                                    let doencaOnline = queOnline.questionarioDoencas.filter(qd => qd.doenca.iDoenca == doenca.doenca.iDoenca)[0];
                                    if (doencaOnline) {
                                        doenca.iQuestionarioDoenca = doencaOnline.iQuestionarioDoenca;
                                    }
                                })
                            }

                            if (que.situacaoDeRua && queOnline.situacaoDeRua) {
                                que.situacaoDeRua.iSituacaoDeRua = queOnline.situacaoDeRua.iSituacaoDeRua;

                                que.situacaoDeRua.situacaoDeRuaOrigemAlimentacoes =
                                    ObjetoUtilsService.convertObjectToArrayRealm<SituacaoDeRuaOrigemAlimentacao>(que.situacaoDeRua.situacaoDeRuaOrigemAlimentacoes);

                                if (queOnline.situacaoDeRua.situacaoDeRuaOrigemAlimentacoes?.length > 0 && que.situacaoDeRua.situacaoDeRuaOrigemAlimentacoes?.length > 0) {
                                    que.situacaoDeRua.situacaoDeRuaOrigemAlimentacoes.forEach(ori => {
                                        let origemOnline = queOnline.situacaoDeRua.situacaoDeRuaOrigemAlimentacoes.filter(so => so.origemAlimentacao.iOrigemAlimentacao == ori.origemAlimentacao.iOrigemAlimentacao)[0];
                                        if (origemOnline) {
                                            ori.iSituacaoDeRuaOrigemAlimentacao = origemOnline.iSituacaoDeRuaOrigemAlimentacao;
                                        }
                                    })
                                }

                                que.situacaoDeRua.situacaoDeRuaHigienePessoals =
                                    ObjetoUtilsService.convertObjectToArrayRealm<SituacaoDeRuaHigienePessoal>(que.situacaoDeRua.situacaoDeRuaHigienePessoals);

                                if (queOnline.situacaoDeRua.situacaoDeRuaHigienePessoals?.length > 0 && que.situacaoDeRua.situacaoDeRuaHigienePessoals?.length > 0) {
                                    que.situacaoDeRua.situacaoDeRuaHigienePessoals.forEach(hig => {
                                        let higieneOnline = queOnline.situacaoDeRua.situacaoDeRuaHigienePessoals.filter(sh => sh.higienePessoal.iHigienePessoal == hig.higienePessoal.iHigienePessoal)[0];
                                        if (higieneOnline) {
                                            hig.iSituacaoDeRuaHigienePessoal = higieneOnline.iSituacaoDeRuaHigienePessoal;
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
                */
            }
        }
        return model;
    }
}
