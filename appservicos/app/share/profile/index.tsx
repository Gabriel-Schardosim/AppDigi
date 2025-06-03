import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {hp} from '@/share/utils/responsive';

import {getSession} from '@/share/services/Auth';
import {Usuario} from '@/share/models/objects/Usuario';
import {AvatarAroundImageOC} from '@/share/components/avatar-around-oc/AvatarAroundOC';
import {screenStyles} from '@/share/settings/GlobalStyle';
import {colors, sizes} from '@/share/settings/Settings';
import {InputTextOC} from '@/share/components/text-input-oc/InputTextOC';
import {InputTextMaskCpfCnpjOC} from '@/share/components/text-input-oc/InputTextMaskOC';
import { useRouter } from 'expo-router';

export default function Profile() {


   const router = useRouter();
  const [usuario, setUsuario] = useState(new Usuario());

  useEffect(() => {
    async function getUser() {
      getSession().then(session => {
        setUsuario(session.usuario);
      });
    }

    getUser().then();
  }, []);

  return (
    <ScrollView style={screenStyles.scroll}>
      <View style={styles.avatar}>
        <AvatarAroundImageOC
            selectImage={false}
            imageBase64={usuario.foto}
            size={hp('12%')}
        />
      </View>
      <View style={styles.information}>
        <InputTextOC
          value={usuario.nome}
          label={'Nome'}
          disabled={true}
        />
        <InputTextMaskCpfCnpjOC
          required={true}
          label={'CPF/CNPJ'}
          value={usuario.cpfCnpj}
          disabled={true}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
  },
  information: {
    marginTop: 30
  },
  name: {
    fontSize: sizes.fontMedium,
    color: colors.secondary,
  },
  buttonLogout: {
    margin: 20,
    fontSize: 20,
  },
});

