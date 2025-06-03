import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { hp, wp } from '@/share/utils/responsive';
import {screenStyles} from '@/share/settings/GlobalStyle';
import {AvatarAroundImageOC} from '@/share/components/avatar-around-oc/AvatarAroundOC';
import {onSignOut} from '@/share/services/Auth';
import {ListItemOC} from '@/share/components/list-oc/ListOC';
import {colors, sizes} from '@/share/settings/Settings';
import DialogOC from '@/share/components/dialog-oc/DialogOC';
import {StringUtilsService} from '@/share/services/StringUtilsService';
import AccountScreenContext, {AccountScreenProvider} from './AccountScreenContext';
import {useRouter} from 'expo-router';
// 

export function Account() {
  const {
    usuario,
    dialogLogout,
    setDialogLogout,
    itens,
    versao,
  } = useContext(AccountScreenContext);

  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <AvatarAroundImageOC
              selectImage={false}
              imageBase64={usuario.foto}
              size={hp('12%')}
            />
            <View style={styles.information}>
              <Text style={styles.name}>{usuario.nome}</Text>
              <Text style={styles.cpf}>{StringUtilsService.formataCpfCnpj(usuario.cpfCnpj)}</Text>
            </View>
          </View>
        </View>
        <View style={screenStyles.scroll}>
          <DialogOC
            visible={dialogLogout}
            title='Confirmação'
            description='Tem certeza que deseja sair?'
            titleButtonCancel={'Não'}
            titleButtonConfirm={'Sim'}
            onDismiss={() => {
              setDialogLogout(false);
            }}
            onPress={() => {
              // onSignOut().then(() => navigation.navigate('Login'));
              router.replace('/');
            }}
          />
          <ListItemOC items={itens}/>
        </View>
      </ScrollView>
      <Text style={styles.versao}>{versao}</Text>
    </View>
  );
}

// export default ({navigation, ...rest}) => (
//   <AccountScreenProvider navigation={navigation}>
//     <Account navigation={navigation} {...rest} />
//   </AccountScreenProvider>
// )
export default () => (
  <AccountScreenProvider>
    <Account />
  </AccountScreenProvider>
);

export const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  card: {
    backgroundColor: colors.primary
  },
  avatar: {
    padding: 20,
    flexDirection: 'row',
  },
  information: {
    margin: 20,
    width: '70%'
  },
  name: {
    fontSize: sizes.fontSmall,
    color: colors.secondary,
  },
  cpf: {
    marginTop: 5,
    fontSize: sizes.fontSmall,
    color: colors.secondary,
  },
  buttonLogout: {
    margin: 20,
    fontSize: 20,
  },
  versao: {
    bottom: 5,
    color: '#5e5e5e',
    fontSize: sizes.fontSmall,
    textAlign: 'center',
  },
});

