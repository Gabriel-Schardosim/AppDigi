import React from 'react';
import {Card, Text} from 'react-native-paper';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {hp,wp} from '../../utils/responsive';


import {colors, sizes} from '../../settings/Settings';

export interface ListCardInitialItem {
  icon?: string;
  image?: string;
  title: string;
  onPress: (() => void);
}

function ListCardInitialOC(props: {
                             items: Array<ListCardInitialItem>,
                           }
) {

  return (
    <View style={styles.cardList}>
      {
        props.items.map((item1, index1) => {
            return (
              index1 % 2 == 0 ?
                <View style={styles.cardRow} key={index1}>
                  {
                    props.items.map((item2, index2) => {
                      return (index1 === index2 || index1 + 1 === index2 ?
                          <CardInitialOC key={index2}
                                         icon={item2.icon}
                                         image={item2.image}
                                         title={item2.title}
                                         onPress={item2.onPress}
                          />
                          :
                          false
                      );
                    })
                  }
                </View>
                : false
            );
          }
        )
      }
    </View>
  );
}

function ListCardHorizontalOC(props: {
                                items: Array<ListCardInitialItem>,
                              }
) {
  const itemsPerInterval = 4;

  const [interval, setInterval] = React.useState(1);
  const [intervals, setIntervals] = React.useState(1);
  const [width, setWidth] = React.useState(0);
  const init = (width: number) => {
    setWidth(width);
    const totalItems = props.items.length;
    setIntervals(Math.ceil(totalItems / itemsPerInterval));
  }

  const getInterval = (offset: any) => {
    for (let i = 1; i <= intervals; i++) {
      if (offset < (width / intervals) * i) {
        return i;
      }
      if (i == intervals) {
        return i;
      }
    }
  }

  let bullets: React.ReactNode[] = [];
  for (let i = 1; i <= intervals; i++) {
    bullets.push(
      <Text
        key={i}
        style={{
          ...styles.bullet,
          opacity: interval === i ? 0.5 : 0.1
        }}
      >
        &bull;
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{...styles.scrollView, width: `${100 * intervals}%`}}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(w, h) => init(w)}
        onScroll={data => {
          setWidth(data.nativeEvent.contentSize.width);
          setInterval(getInterval(data.nativeEvent.contentOffset.x) ?? 1);
        }}
        scrollEventThrottle={200}
        pagingEnabled
        decelerationRate="fast"
      >
        {
          props.items.map((item2, index2, items) => {
            return (index2 % 2 == 0 ?
              <View>
                <CardInitialOC key={index2}
                               icon={item2.icon}
                               image={item2.image}
                               title={item2.title}
                               horizontal={true}
                               onPress={item2.onPress}
                />
                {index2 < items.length - 1 ?
                  <CardInitialOC key={index2}
                                 icon={items[index2 + 1].icon}
                                 image={items[index2 + 1].image}
                                 title={items[index2 + 1].title}
                                 horizontal={true}
                                 onPress={items[index2 + 1].onPress}
                  /> : false}
              </View> : false);
          })
        }
      </ScrollView>
      <View style={styles.bullets}>
        {bullets}
      </View>
    </View>
  );
}

function CardInitialOC(props: {
                         icon?: string,
                         image?: string,
                         title: string,
                         horizontal?: boolean,
                         onPress: (() => void),
                       }
) {

  return (
    <Card
      style={[styles.card, props.horizontal ? styles.cardHorizontal : styles.cardVertical]}
      onPress={props.onPress}
    >
      <Card.Content>
        {props.icon ?
          <Icon
            style={styles.icon}
            size={hp('6%')}
            color={colors.primary}
            name={props.icon}
          /> : null}
        {props.image ?
          <View style={styles.containerImage}>
            <Image
              style={styles.image}
              source={{ uri: props.image }}
            />
          </View> : null}
        <Text style={styles.iconTitle}>{props.title}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardList: {
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  cardHorizontal: {
    margin: wp('1.3'),
    width: wp('43%'),
  },
  cardVertical: {
    margin: '2%',
    width: '41%',
    marginTop: '5%',
  },
  containerImage: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'stretch',
  },
  icon: {
    textAlign: 'center'
  },
  iconTitle: {
    color: colors.primary,
    fontSize: sizes.fontSmall,
    textAlign: 'center',
    marginTop: 2,
  },
  container: {
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 5
    },
  },
  scrollView: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  bullets: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 5,
  },
  bullet: {
    paddingHorizontal: 5,
    fontSize: 20,
  }
});


export {ListCardInitialOC, ListCardHorizontalOC};
