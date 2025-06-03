import React, {useEffect} from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import 'react-native-get-random-values';// Polyfill for crypto.getRandomValues
import 'react-native-url-polyfill/auto';// Polyfill for URL API
import { MainNavigation } from './settings/Routes';
import {appConfig, colors, databaseConfig} from '@/share/settings/Settings';
import configSistema, {ConfiguracaoSistema} from '@/share/services/ConfigSistema';
import {schemaDigiServicos} from './database/SchemaDigiServicos';

export default function App() {
  databaseConfig.schema = schemaDigiServicos;

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      accent: colors.secondary,
      background: colors.background,
    }
  };

  useEffect(() => {
    // Deprecated: console.disableYellowBox
    // Use LogBox to ignore logs in React Native 0.63+
    if (appConfig.prod) {
      // Only ignore logs in production
      import('react-native').then(({ LogBox }) => {
        LogBox.ignoreAllLogs();
      });
    }

    async function setConfig() {
      const config = new ConfiguracaoSistema();
      //config.modulo = 'hnbFs'
      //config.sistema = '0Nc7J'
      config.onlineOffline = 'offline';
      config.usaContext = 'sim';
      await configSistema.setConfig(config);
    }
    setConfig().then();
  }, []);


  return (
    <PaperProvider theme={theme}>
      <MainNavigation/>
    </PaperProvider>
  );
}
