import AsyncStorage from "@react-native-async-storage/async-storage";

export class ConfiguracaoSistema {
   modulo: string = '';
  sistema: string = '';
  onlineOffline: string = '';
  usaContext: string = '';
}

class ConfigSistema {
    async setConfig(config: ConfiguracaoSistema) {
        await AsyncStorage.setItem('CONFIG_SISTEMA', JSON.stringify(config));
    }

    async getConfig(): Promise<ConfiguracaoSistema> {
        return JSON.parse(String(await AsyncStorage.getItem('CONFIG_SISTEMA')));
    }

    async limpaConfig() {
        await AsyncStorage.removeItem('CONFIG_SISTEMA');
    }
}

const configSistema = new ConfigSistema();
export default configSistema;
