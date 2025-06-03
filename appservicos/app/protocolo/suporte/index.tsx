import React from 'react';
import {Text} from 'react-native-paper';
import {Linking, ScrollView, StyleSheet} from 'react-native';

import {ButtonOC} from '@/share/components/button-oc/ButtonOC';
import {screenStyles} from '@/share/settings/GlobalStyle';
import {sizes} from '@/share/settings/Settings';

export default function Suporte() {
  return (
    <ScrollView style={screenStyles.scroll}>
      <Text style={styles.title}>Necessita de ajuda?</Text>
      <Text style={styles.subtitle}>
        Clique no botão abaixo e será redirecionado para nossa central de atendimento.
      </Text>
      <ButtonOC text='Suporte' onPress={() => {
        Linking.openURL('https://digifred.atlassian.net/servicedesk/customer/portal/6');
      }}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: sizes.fontLarge,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: sizes.fontMedium,
    marginBottom: '10%',
  },
});
