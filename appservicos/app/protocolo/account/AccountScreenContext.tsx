import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'expo-router';

import { getSession } from '@/share/services/Auth';
import { Usuario } from '@/share/models/objects/Usuario';
import ServiceGenerico from '@/share/services/ServiceGenerico';

import * as Application from 'expo-application';

// Tipagem para os itens da lista exibidos na tela de conta
type ListaItem = {
  title: string;
  icon: string;
  onPress: () => void;
  divider?: boolean;
};

// Tipagem do contexto
type AccountScreenContextType = {
  usuario: Usuario;
  dialogLogout: boolean;
  setDialogLogout: (value: boolean) => void;
  itens: ListaItem[];
  versao: string;
};

const AccountScreenContext = createContext<AccountScreenContextType>({} as AccountScreenContextType);

// Props esperadas no Provider
type AccountScreenProviderProps = {
  children: ReactNode;
};

export const AccountScreenProvider: React.FC<AccountScreenProviderProps> = ({ children }) => {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario>(new Usuario());
  const [dialogLogout, setDialogLogout] = useState<boolean>(false);
  const [itens, setItens] = useState<ListaItem[]>([]);
  const [versao, setVersao] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        const session = await getSession();
        setUsuario(session.usuario);
      } catch (error) {
        console.warn('Erro ao recuperar sessão do usuário:', error);
      }

      try {
        const lista: ListaItem[] = [];
        const generico = new ServiceGenerico();

        if (!(await generico.online())) {
          lista.push({
            title: 'Sincronizar dados',
            icon: 'sync',
            onPress: () => router.push('/'), // ajuste para rota correta
          });
        }

        lista.push({
          title: 'Sair',
          icon: 'logout',
          onPress: () => setDialogLogout(true),
        });

        setItens(lista);
      } catch (error) {
        console.warn('Erro ao montar lista de itens:', error);
      }

      const nomeApp = Application.applicationName || 'App';
      const versaoApp = Application.nativeApplicationVersion || '1.0.0';
      setVersao(`${nomeApp} ${versaoApp}`);
    }

    loadData();
  }, [router]);

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
