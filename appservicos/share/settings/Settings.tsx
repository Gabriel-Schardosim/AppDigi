// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { hp } from '../utils/responsive';   

interface Sizes {
    fontLarge: number;
    fontMedium: number;
    fontSmall: number;
    icon: number;
}

const sizes: Sizes = {
    fontLarge: hp('4%'),
    fontMedium: hp('2.5%'),
    fontSmall: hp('2%'),
    icon: hp('3.5%')
};

interface Colors {
    primary: string,
    secondary: string,
    background: string,
    selected: string,
    icon: string,
    font: string,
    error: string,
}
const colors: Colors = {
    primary: '#2070AD',
    secondary: '#fff',
    background: '#fff',
    selected: '#d9d9d9',
    icon: '#6c6c6c',
    font: '#6c6c6c',
    error: '#289FFA'
};

interface ApiUrls {
    protocolo: string;
    api: string;
}

const apiUrls: ApiUrls = {
    //protocolo: 'http://192.168.31.115/apiprotocolo/v1',
    protocolo: 'http://protocolo.digifred.net.br:8080/index.php/v1',

    api: 'protocolo',
};

interface DatabaseConfig {
    path: string;
    sistema: string;
    schema?: any;
}

const databaseConfig: DatabaseConfig = {
    path: 'databaseGRP',
    sistema: 'digiCidade',
};

interface AppConfig {
    prod: boolean,
    captchaSiteKey: string,
}

const appConfig: AppConfig = {
    prod: true,
    captchaSiteKey: '6LepGtEUAAAAAKu2n_l1l6VCwigLCRgAZfVAqSdZ',
};

export type {ApiUrls, Sizes, Colors, DatabaseConfig};
export {sizes, apiUrls, colors, databaseConfig, appConfig};
