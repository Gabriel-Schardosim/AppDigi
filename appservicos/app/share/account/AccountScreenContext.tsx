import React, { createContext, useEffect, useState, ReactNode } from 'react';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

import { getSession } from '@/share/services/Auth';
import { Usuario } from '@/share/models/objects/Usuario';
import ServiceGenerico from '@/share/services/ServiceGenerico';

// Tipagem do contexto
type AccountScreenContextProps = {
  usuario: Usuario;
  dialogLogout: boolean;
  setDialogLogout: React.Dispatch<React.SetStateAction<boolean>>;
  itens: any[];
  versao: string;
};

const AccountScreenContext = createContext<AccountScreenContextProps>({} as AccountScreenContextProps);

// Tipagem das props do Provider
interface AccountScreenProviderProps {
  children: ReactNode;
}

export const AccountScreenProvider: React.FC<AccountScreenProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState(new Usuario());
  const [dialogLogout, setDialogLogout] = useState(false);
  const [itens, setItens] = useState<any[]>([]);
  const [versao, setVersao] = useState('');

  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const session = await getSession();
      setUsuario(session.usuario);
    }

    async function getItens() {
      const lista: any[] = [];

      lista.push({
        title: 'Perfil',
        icon: 'account-circle',
        onPress: () => router.push('/Profile' as any), // Rota com expo-router
      });

      const generico = new ServiceGenerico();

      if (!(await generico.online())) {
        lista.push({
          title: 'Sincronizar dados',
          icon: 'sync',
          onPress: () => router.push('/SincronizarDados' as any),
        });

        lista.push({
          title: 'Erros',
          icon: 'information-outline',
          onPress: () => router.push('/Erro' as any),
          divider: true,
        });
      }

      lista.push({
        title: 'Sair',
        icon: 'logout',
        onPress: () => setDialogLogout(true),
      });

      setItens(lista);
    }

    const nomeApp = Constants.expoConfig?.name ?? '';
    const versaoApp = Constants.expoConfig?.version ?? '';
    setVersao(`${nomeApp} ${versaoApp}`);

    getUser();
    getItens();
  }, []);

  return (
    <AccountScreenContext.Provider
      value={{
        usuario,
        dialogLogout,
        setDialogLogout,
        itens,
        versao,
      }}
    >
      {children}
    </AccountScreenContext.Provider>
  );
};

export default AccountScreenContext;
