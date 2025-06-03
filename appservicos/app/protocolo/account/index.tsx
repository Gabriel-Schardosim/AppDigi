import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { ScrollView, View, Text } from 'react-native';

import { screenStyles } from '@/share/settings/GlobalStyle';
import { AvatarAroundImageOC } from '@/share/components/avatar-around-oc/AvatarAroundOC';
import { onSignOut } from '@/share/services/Auth';
import { ListItemOC } from '@/share/components/list-oc/ListOC';
import DialogOC from '@/share/components/dialog-oc/DialogOC';
import { StringUtilsService } from '@/share/services/StringUtilsService';
import AccountScreenContext, { AccountScreenProvider } from './AccountScreenContext';
import { styles } from '@/app/share/account'; // ajuste para o caminho novo se necessário
import { LoadingDialogOc } from '@/share/components/loading-oc/LoadingOC';
import manipuladorExcecoes from '@/share/services/ManipuladorExcecoes';
import { getRegistrosParaEnviar } from '../sincronizar-dados';

export function AccountScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existeFichasParaEnviar, setExisteFichasParaEnviar] = useState(false);
  const {
    usuario,
    dialogLogout,
    setDialogLogout,
    itens,
    versao,

  } = useContext(AccountScreenContext);

  async function verificaSeExisteFichasParaEnviar() {
    setLoading(true);
    setExisteFichasParaEnviar(false);

    try {
      const fichasParaEnviar = await getRegistrosParaEnviar();
      setLoading(false);

      if (fichasParaEnviar.length > 0) {
        manipuladorExcecoes.exib('Atenção', 'Existe fichas que não foram enviadas.');
        setExisteFichasParaEnviar(true);
        setDialogLogout(false);
      }
    } catch (error) {
      setLoading(false);
      manipuladorExcecoes.exib('Atenção', 'Erro ao verificar fichas não enviadas.');
      setDialogLogout(false);
    }
  }

  useEffect(() => {
    if (dialogLogout) {
      // verificaSeExisteFichasParaEnviar();
    }
  }, [dialogLogout]);

  const mostrarModalSair = useMemo(() => {
    return dialogLogout && !loading && !existeFichasParaEnviar;
  }, [dialogLogout, loading, existeFichasParaEnviar]);

  return (
    <View style={styles.container}>
      <LoadingDialogOc visible={loading} />
      <ScrollView>
        <View style={styles.card}>
          <View style={styles.avatar}>
            {/* Avatar opcional */}
            <View style={styles.information}>
              <Text style={styles.name}>{usuario.nome}</Text>
              <Text style={styles.cpf}>{StringUtilsService.formataCpfCnpj(usuario.cpfCnpj)}</Text>
            </View>
          </View>
        </View>
        <View style={screenStyles.scroll}>
          <DialogOC
            visible={mostrarModalSair}
            title="Confirmação"
            description="Tem certeza que deseja sair?"
            titleButtonCancel="Não"
            titleButtonConfirm="Sim"
            onDismiss={() => setDialogLogout(false)}
            onPress={() => {
              // onSignOut().then(() => navigation.navigate('Login'));
              onSignOut().then(() => router.replace('/login'));
            }}
          />
          <ListItemOC items={itens} />
        </View>
      </ScrollView>
      <Text style={styles.versao}>{versao}</Text>
    </View>
  );
}

// Wrap com provider
// type AccountScreenProps = {
//   navigation: any; // Replace 'any' with the correct navigation type if available
//   [key: string]: any;
// };


export default function AccountScreenWrapper() {
  return (
    <AccountScreenProvider>
      <AccountScreen />
    </AccountScreenProvider>
  );
}
