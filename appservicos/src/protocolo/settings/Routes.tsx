// import React from 'react';
// import {Platform, StatusBar, StyleSheet, View} from 'react-native';
// import {createAppContainer, createSwitchNavigator} from 'react-navigation';
// import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
// import {createStackNavigator} from 'react-navigation-stack';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
// import Home from '../screens/home/Home';
// import ListaProtocolo, {ListaProtocoloGenerico} from '../screens/protocolo/lista-protocolo/ListaProtocolo';
// import CadastroProtocoloSteep1, {CadastroProtocoloSteep1Generico} from '../screens/protocolo/cadastro-protocolo/CadastroProtocoloSteep1';
// import SincronizarDados from '../screens/sincronizar-dados/SincronizarDados';
// import Account from '../screens/account/Account';
// import Login from '@/share/screens/login/Login';
// import Suporte from '../screens/suporte/Suporte';
// import Profile from '@/share/screens/profile/Profile';
// import {colors, sizes} from '@/share/settings/Settings';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import Erro from '../screens/erro/Erro';
// import CriarConta from '@/share/screens/criar-conta/CriarConta';
// import {ButtonOC} from '@/share/components/button-oc/ButtonOC';
// import ViewCadastroProtocolo, { ViewCadastroProtocoloGenerico } from '../screens/protocolo/cadastro-protocolo/ViewCadastroProtocolo';


// const styles = StyleSheet.create({
//   header: {
//     height: (StatusBar.currentHeight ? StatusBar.currentHeight : 14) + hp(Platform.OS === 'ios' ? '6%' : '3%'),
//   },
//   headerTitleStyle: {
//     fontSize: sizes.fontSmall
//   },
//   iconRightView: {
//     marginRight: 7,
//     marginTop: -20,
//     flexDirection: 'row',
//   },
//   iconRight: {
//     fontSize: sizes.icon,
//     color: colors.icon,
//   }
// });

// const HomeStack = createStackNavigator({
//   Home: {
//     screen: Home,
//     navigationOptions: {
//       headerShown: false,
//       cardStyle: {backgroundColor: colors.background},
//     },
//   },
//   CriarConta: {
//     screen: CriarConta,
//     navigationOptions: {
//       headerShown: false,
//       cardStyle: {backgroundColor: colors.background},
//     },
//   },
//   ListaProtocolo: {
//     screen: ListaProtocolo,
//     navigationOptions: {
//       headerTitle: ListaProtocoloGenerico.title,
//       headerTitleStyle: styles.headerTitleStyle,
//       headerStyle: styles.header,
//       cardStyle: {backgroundColor: colors.background},
//       headerShown: true,
//     },
//   },  
//   ViewCadastroProtocolo: {
//     screen: ViewCadastroProtocolo,
//     navigationOptions: {
//       headerTitle: ViewCadastroProtocoloGenerico.title,
//       headerTitleStyle: styles.headerTitleStyle,
//       headerStyle: styles.header,
//       cardStyle: {backgroundColor: colors.background},
//       headerRight: () => (        
//         <View style={styles.iconRightView}>
//           <ButtonOC
//             mode='text'
//             icon='trash-can-outline'
//             styleIcon={styles.iconRight}
//             onPress={CadastroProtocoloSteep1Generico.onDelete}
//           />
//         </View>        
//       )
//     },    
//   },
//   CadastroProtocoloSteep1: {
//     screen: CadastroProtocoloSteep1,
//     navigationOptions: {
//       headerTitle: CadastroProtocoloSteep1Generico.title,
//       headerTitleStyle: styles.headerTitleStyle,
//       headerStyle: styles.header,
//       cardStyle: {backgroundColor: colors.background},
//       headerRight: () => (
//         <View style={styles.iconRightView}>
//           {/*
//           <ButtonOC
//             mode='text'
//             icon='trash-can-outline'
//             styleIcon={styles.iconRight}
//             onPress={CadastroProtocoloSteep1Generico.onDelete}
//           />
//           */}
//           <ButtonOC
//             mode='text'
//             icon='close'
//             styleIcon={styles.iconRight}
//             onPress={CadastroProtocoloSteep1Generico.onCancel}
//           />
//         </View>
//       )
//     },
//   }  
// });

// HomeStack.navigationOptions = ({navigation}) => {
//   const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
//   const isMyScreen = currentScreenPath !== 'Home';
//   return {
//     tabBarVisible: !isMyScreen
//   };
// };

// const AccountStack = createStackNavigator({
//   Account: {
//     screen: Account,
//     navigationOptions: {
//       headerShown: false,
//       cardStyle: {backgroundColor: colors.background},
//     },
//   }, 
//   SincronizarDados: {
//     screen: SincronizarDados,
//     navigationOptions: {
//       headerTitle: 'Sincronizar Dados',
//       headerTitleStyle: styles.headerTitleStyle,
//       headerStyle: styles.header,
//       cardStyle: {backgroundColor: colors.background},
//     },
//   },
//   Profile: {
//     screen: Profile,
//     navigationOptions: {
//       headerTitle: 'Perfil',
//       headerTitleStyle: styles.headerTitleStyle,
//       headerStyle: styles.header,
//       cardStyle: {backgroundColor: colors.background},
//     },
//   },
//   Erro: {
//     screen: Erro,
//     navigationOptions: {
//       headerTitle: 'Erros',
//       headerTitleStyle: styles.headerTitleStyle,
//       headerStyle: styles.header,
//       cardStyle: {backgroundColor: colors.background},
//     },
//   },
// });


// const SuporteStack = createStackNavigator({
//   Suporte: {
//     screen: Suporte,
//     navigationOptions: {
//       headerShown: false,
//       cardStyle: {backgroundColor: colors.background},
//     },
//   },
// });


// const TabNavigator = createMaterialBottomTabNavigator(
//   {
//     Home: {
//       screen: HomeStack,
//       navigationOptions: {
//         tabBarLabel: 'Início',
//         tabBarIcon: ({tintColor}) => (
//           <View>
//             <Icon name={'dashboard'} size={25} style={[{color: colors.secondary}]}/>
//           </View>
//         )
//       },
//     },
//     Suporte: {
//       screen: SuporteStack,
//       navigationOptions: {
//         tabBarLabel: 'Suporte',
//         tabBarIcon: ({tintColor}) => (
//           <View>
//             <IconCommunity name={'wrench-outline'} size={25} style={[{color: colors.secondary}]}/>
//           </View>
//         ),
//       }
//     },
//     Account: {
//       screen: AccountStack,
//       navigationOptions: {
//         tabBarLabel: 'Usuário',
//         tabBarIcon: ({tintColor}) => (
//           <View>
//             <Icon name={'account-circle'} size={25} style={[{color: colors.secondary}]}/>
//           </View>
//         ),
//       }
//     },

//   },
//   {
//     initialRouteName: 'Home',
//     resetOnBlur: true
//   }
// );


// const MainNavigation = createSwitchNavigator({
//     Login: {
//       screen: Login
//     },
//     TabNavigator: {
//       screen: TabNavigator
//     },
//   },
//   {
//     initialRouteName: 'Login'
//   }
// );

// export default createAppContainer(MainNavigation);
