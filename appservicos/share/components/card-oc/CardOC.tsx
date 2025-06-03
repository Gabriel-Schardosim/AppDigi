import React from 'react';
import {Divider} from 'react-native-paper';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

import {colors, sizes} from '../../settings/Settings';
import {AvatarAroundImageOC} from '../avatar-around-oc/AvatarAroundOC';
import {hp} from '../../utils/responsive';
import {StringUtilsService} from '../../services/StringUtilsService';

function CardAutocompleteOC(props: {
  key: string,
  titles: Array<any>
  style?: any,
  onPress?: (() => void),
  onDelete?: (() => void),
  disabled?: boolean,
  multiple?: boolean,
  select?: boolean,
  flagAtivo?: boolean,
}) {

  return (
    <View
      key={StringUtilsService.uuidv4()}
    >
      <TouchableOpacity
        onPress={props.flagAtivo == null ? props.onPress : props.flagAtivo ? props.onPress : () => {
        }}
        style={[
          styles.container,
          styles.cardNormalLine,
          (props.multiple && props.select) || (props.flagAtivo != null && !props.flagAtivo) ? {backgroundColor: colors.selected} : {backgroundColor: colors.background},
          styles.card
        ]}
        disabled={props.disabled}
      >
        <View style={styles.cardNormalLineTitle}>
          {
            props.onDelete ?
              <TouchableOpacity
                style={styles.delete}
                onPress={props.onDelete}
              >
                <IconCommunity
                  name={'trash-can-outline'}
                  size={sizes.icon}
                />
              </TouchableOpacity>
              : false
          }
          <View style={styles.inLine} key={props.titles.filter(t => t.main)[0].title}>
            {
              props.flagAtivo != null && !props.flagAtivo ?
                <Text style={[styles.title, styles.medium]}>INATIVO</Text> :
                false
            }
            <Text
              style={[props.style?.cardText, styles.title, styles.medium]}
            >
              {props.titles.filter(t => t.main)[0].title}{props.titles.filter(t => t.main)[0].value ? ': ' : ''}
            </Text>
            <Text
              style={[props.style?.cardText, styles.medium]}
            >
              {props.titles.filter(t => t.main)[0].value ? props.titles.filter(t => t.main)[0].value /*.toUpperCase() */ : ''}
            </Text>
          </View>
          {
            props.titles.map(t => {
              return (
                !t.main ?
                  <View style={styles.inLine} key={t.title}>
                    <Text style={[props.style?.cardText, styles.subtitle, styles.small]}>{t.title}: </Text>
                    <Text style={[props.style?.cardText, styles.small]}>{t.value?.toString().toUpperCase()}</Text>
                  </View>
                  : false
              );
            })
          }
        </View>
      </TouchableOpacity>
      {!props.disabled ?
        <Divider style={styles.divider}/>
        : false
      }
    </View>

  );
}

function CardPersonAutocompleteOC(props: {
  key: string,
  titles: Array<any>
  style?: any,

  disabled?: boolean,
  multiple?: boolean,
  select?: boolean,
  icon?: string
  onPress?: (() => void),
  flagAtivo?: boolean,
}) {

  return (
    <TouchableOpacity
      key={StringUtilsService.uuidv4()}
      onPress={props.flagAtivo == null ? props.onPress : props.flagAtivo ? props.onPress : () => {
      }}
      style={[styles.cardPersonLine, styles.card, props.flagAtivo != null && !props.flagAtivo ? {backgroundColor: colors.selected} : {backgroundColor: colors.background}]}
      disabled={props.disabled}
    >
      <View style={[styles.container]}>
        {
          props.flagAtivo != null && !props.flagAtivo ?
            <Text style={[styles.title, styles.medium]}>INATIVO</Text> :
            false
        }
        <AvatarAroundImageOC
          selectImage={false}
          size={hp('10%')}
          style={styles.cardPersonLineAvatar}
          imageBase64={props.titles.filter(t => t.type === 'image').length > 0 ? props.titles.filter(
            t => t.type === 'image')[0].value : null}
        />
        <View style={styles.cardPersonLineTitle}>
          <View style={styles.inLine}>
            <Text
              style={[props.style?.cardText, styles.title, styles.medium]}
            >
              {props.titles.filter(t => t.main)[0].title}{props.titles.filter(t => t.main)[0].value ? ': ' : ''}
            </Text>
            <Text
              style={[props.style?.cardText, styles.medium]}
            >
              {props.titles.filter(t => t.main)[0].value ? props.titles.filter(t => t.main)[0].value.toUpperCase() : ''}
            </Text>
          </View>
          {
            props.titles.map(t => {
              return (
                !t.main && (t.type == null || t.type !== 'image') ?
                  <View style={styles.inLine} key={StringUtilsService.uuidv4()}>
                    <Text style={[props.style?.cardText, styles.subtitle, styles.small]}>{t.title}: </Text>
                    <Text style={[props.style?.cardText, styles.small]}>{t.value.toUpperCase()}</Text>
                  </View>
                  : false
              );
            })
          }
        </View>
      </View>

      {!props.disabled ?
        <Divider style={styles.divider}/>
        : false
      }
    </TouchableOpacity>
  );
}

export {CardAutocompleteOC, CardPersonAutocompleteOC};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  card: {
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#fff',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
    // borderWidth: 1,
    // borderRadius: 5,
    // borderColor: colors.primary,
    padding: 8
  },
  delete: {
    alignItems: 'flex-end'
  },
  cardNormalLineTitle: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    fontSize: sizes.fontSmall,
  },
  cardNormalLine: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  cardPersonLine: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  cardPersonLineTitle: {
    marginBottom: 5,
    marginLeft: 8,
    marginRight: 8,
    width: '70%',
    fontSize: 15,
  },
  cardPersonLineAvatar: {
    marginLeft: 20,
    marginTop: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontWeight: 'bold',
  },
  small: {
    fontSize: sizes.fontSmall,
  },
  medium: {
    fontSize: sizes.fontSmall,
  },
  divider: {
    backgroundColor: '#e5e5e5',
    height: 0,
    margin: 0
  },
  inLine: {
    alignItems: 'flex-start',
    marginLeft: 10,
    marginBottom: 4
  },
});


