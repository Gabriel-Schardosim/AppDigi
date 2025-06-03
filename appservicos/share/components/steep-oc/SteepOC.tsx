import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
// import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {colors} from '../../settings/Settings';

export class Steep {
  icon!: string;
  key!: string;
  route?: string;
  selected?: boolean;
  error?: boolean;
}

export default function SteepOC(props: {
  value: Array<Steep>,
  onPress?: ((steep: Steep) => void),
  onNavigate?: (route: string, id?: number) => void,
  style?: any,
  disabled?: boolean,
  freeSequence?: boolean,
  id?: number
}) {

  function click(item: Steep) {
    let isInSequence = true;

    if (!props.freeSequence) {
      const indexActual = props.value.findIndex(value => value.selected);
      const indexSelected = props.value.findIndex(value => value.key === item.key);
      isInSequence = (indexSelected === (indexActual + 1)) || (indexSelected < indexActual);
    }

    if (!props.disabled && (props.freeSequence || isInSequence)) {
      if (props.onPress) {
        props.onPress(item);
      } else {
        navigate(item);
      }
    }
  }

  function navigate(item: Steep) {
    if (item.route && props.onNavigate) {
      props.onNavigate(item.route, props.id);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.line}/>
      {
        props?.value?.map((item) => (
          <View
            key={item.key}
            style={[styles.itemContainer, item.selected ? styles.selected : null]}>
            <TouchableOpacity
              style={styles.item}
              key={item.key + '_btn'}
              onPress={() => click(item)}
            >
              <Icon
                name={item.icon}
                size={25}
                color={'#fff'}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
  },
  line: {
    position: 'absolute',
    borderTopColor: 'rgb(179,179,179)',
    borderTopWidth: 3,
    width: '100%',
    marginTop: 17,
    marginLeft: 5,
    marginRight: 5
  },
  itemContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    backgroundColor: 'rgb(149,149,149)',
    borderRadius: 50
  },
  item: {
    height: 40,
    width: 40,
  },
  icon: {
    alignSelf: 'center',
    paddingTop: 7,
  },
  selected: {
    backgroundColor: colors.primary,
  }
});
