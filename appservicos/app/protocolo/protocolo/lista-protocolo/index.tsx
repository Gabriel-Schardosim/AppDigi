import React from 'react';
import { useRouter } from 'expo-router';

// import ListaGenerica from '../../share/lista-generica/index';
import ListaGenerica from '@/app/share/lista-generica';
import { Column } from '@/share/models/objects/Column';
import { Protocolo } from '@/src/protocolo/models/Protocolo';
// import { ScreenGenerico } from '@/share/screens/screen-generico/ScreenGenerico';

import { ScreenGenerico } from '@/app/share/screen-generico';

import { CadastroProtocoloService } from '@/src/protocolo/services/CadastroProtocoloService';

const ListaProtocoloGenerico = new ScreenGenerico(
  'Meus Serviços',
  'ListaProtocolo',
  Protocolo
);
export { ListaProtocoloGenerico };

export default function ListaProtocolo() {
  const router = useRouter();

  return (
    <ListaGenerica
      class={Protocolo}
      service={new CadastroProtocoloService()}
      arrayColumns={[
        new Column('Ano', 'ano', false, 'number'),
        new Column('Número', 'codigo', true, 'number'),
        new Column('Assunto', 'assunto.descricao', false),
        new Column('Descrição', 'descricao', false),
      ]}
      arrayFilters={[]}
      navigation={router}
      onPressButttonAdd={() => {
        // router.push('/protocolo/cadastro-protocolo'); // Ajuste o caminho conforme o nome do arquivo na pasta `app/`
        // router.push({ pathname: '/protocolo/cadastro-protocolo' });
        router.push('/protocolo/cadastro-protocolo' as any);
      }}
      onPressRow={(id) => {
        // router.push({ pathname: '/protocolo/cadastro-protocolo/view', params: { id: id.toString() } });
        router.push(`/protocolo/cadastro-protocolo/${id}` as any);
      }}
    />
  );
}
