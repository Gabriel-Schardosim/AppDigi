import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Divider, List} from 'react-native-paper';
import {colors, sizes} from '../../settings/Settings';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function ListItemOC(props: {
                      items: Array<any>,
                    }
) {

  return (
      <View>
        {
          props.items.map((item, index) => {
          return (
              <View key={index} style={styles.view}>
                <List.Item
                    titleStyle={styles.item}
                    title={item.title}
                    onPress={item.onPress}
                    left={props => <List.Icon {...props} icon={pIcon => <Icon
                        name={item.icon}
                        size={sizes.icon}
                        style={{width: sizes.icon}}
                        color={colors.primary}
                    />} color={colors.primary}/>}
                />
              {
                item.divider ? <Divider style={styles.divider}/> : false
              }
            </View>
          );
        })
      }
    </View>

  );
}

export {ListItemOC};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#e5e5e5',
    height: 1,
  },
  item: {
    fontSize: sizes.fontSmall,
    color: colors.primary
  },
  view: {
    marginBottom: 15
  }
});
