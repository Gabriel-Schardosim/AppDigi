import React from 'react';
import {Dialog, Portal, Text} from 'react-native-paper';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {hp} from '../../utils/responsive';

import {sizes} from '../../settings/Settings';
import {ButtonOC} from '../button-oc/ButtonOC';

export class ItemDialog {
  chave: string = '';
  descricao: string = '';
}

export default function DialogOc(props: {
                                   visible: boolean,
                                   title: string,
                                   onDismiss: (() => void)
                                   itens?: ItemDialog[],
                                   style?: any
                                   dismissable?: boolean,
                                   description?: string,
                                   titleButtonCancel?: string,
                                   titleButtonConfirm?: string,
                                   onPress?: (() => void),
                                   onItemClick?: ((item: ItemDialog) => void),
                                 }
) {

  return (
    <Portal>
      <Dialog
        onDismiss={props.onDismiss}
        style={[props.style, styles.container]}
        visible={props.visible}
        dismissable={props.dismissable}
      >

        <Dialog.Title style={styles.title}>
          {props.title}
        </Dialog.Title>
        <ScrollView>

          <Dialog.Content>
            <Text style={styles.description}>
              {props?.description}
            </Text>
            {Array.isArray(props.itens) && props.itens.length > 0 ?
              props.itens.map((item, idx) => (
                <TouchableOpacity
                  key={item.chave || idx}
                  onPress={() => props.onItemClick && props.onItemClick(item)}
                >
                  <Text style={styles.itens}>{item.descricao}</Text>
                </TouchableOpacity>
              ))
              : null
            }
          </Dialog.Content>

        </ScrollView>

        <Dialog.Actions>
          {props.titleButtonCancel ?
            <ButtonOC
              text={props.titleButtonCancel}
              onPress={props.onDismiss}
            />
            : false
          }

          <ButtonOC
            style={styles.button}
            text={props.titleButtonConfirm ? props.titleButtonConfirm : 'Ok'}
            onPress={props.onPress ? props.onPress : props.onDismiss}
          />

        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  itens: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: sizes.fontMedium
  },
  container: {
    height: hp('80%'),
  },
  title: {
    fontSize: sizes.fontMedium,
  },
  description: {
    fontSize: sizes.fontMedium,
  },
  button: {
    marginLeft: 10,
  },
});
