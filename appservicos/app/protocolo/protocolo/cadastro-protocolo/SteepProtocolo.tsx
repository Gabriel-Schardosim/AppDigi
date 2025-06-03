import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import SteepOC, { Steep } from '@/share/components/steep-oc/SteepOC';
import { Protocolo } from '@/src/protocolo/models/Protocolo';
//import {CadastroIndividualSteep1Generico} from './CadastroIndividualSteep1';
//import {CadastroIndividualSteep2Generico} from './CadastroIndividualSteep2';
//import {CadastroIndividualSteep3Generico} from './CadastroIndividualSteep3';
//import {CadastroIndividualSteep4Generico} from './CadastroIndividualSteep4';
//import {CadastroIndividualSteep5Generico} from './CadastroIndividualSteep5';
//import {CadastroIndividualSteep6Generico} from './CadastroIndividualSteep6';
//import {CadastroIndividual} from '@/../models/CadastroIndividual';

export const listSteepProtocolo = [
  //CadastroIndividualSteep1Generico,
  //CadastroIndividualSteep2Generico,
  //CadastroIndividualSteep3Generico,
  //CadastroIndividualSteep4Generico,
  //CadastroIndividualSteep5Generico,
  //CadastroIndividualSteep6Generico
];

export default function SteepProtocolo(props: {
  steepKey: string;
  Protocolo: Protocolo,
  disabled?: boolean
  onPress?: ((steep: Steep) => void),
  // navigation?: any,
  onNavigate?: (route: string, id: string) => void,
}
) {
  const [steeps, setSteeps] = useState<Steep[]>([]);

  useEffect(() => {
    const steepsTemp: Steep[] = [];
    /*
    steepsTemp.push({
      icon: 'account',
      key: 'CadastroIndividualSteep1',
      route: CadastroIndividualSteep1Generico.route
    });
    steepsTemp.push({
      icon: 'account-child',
      key: 'CadastroIndividualSteep2',
      route: CadastroIndividualSteep2Generico.route
    });
    steepsTemp.push({
      icon: 'account-details',
      key: 'CadastroIndividualSteep3',
      route: CadastroIndividualSteep3Generico.route
    });
    steepsTemp.push({
      icon: 'account-heart',
      key: 'CadastroIndividualSteep4',
      route: CadastroIndividualSteep4Generico.route
    });
    steepsTemp.push({
      icon: 'file-document-edit',
      key: 'CadastroIndividualSteep5',
      route: CadastroIndividualSteep5Generico.route
    });
    */
    steepsTemp.forEach(value => value.selected = value.key === props.steepKey);

    setSteeps(steepsTemp);
  }, []);

  return (
    <View>
      {/* <SteepOC disabled={props.disabled} value={steeps} navigation={props.navigation} id={props.Protocolo.id}
               onPress={props.onPress} freeSequence={true}/> */}
      <SteepOC
        disabled={props.disabled}
        value={steeps}
        id={props.Protocolo.id}
        onPress={props.onPress}
        
        // onNavigate={props.onNavigate} // Nova abordagem
        freeSequence={true}
      />
    </View>
  );
}


