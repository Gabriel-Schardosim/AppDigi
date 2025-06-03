import React from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerActions} from '@react-navigation/native';


type RootDrawerParamList = {
  RegisterAccount: undefined;
  CadastroScreen: undefined;
  Login: undefined; 
  CadastroProtocoloSteep1: undefined;
  CadastroProtocolo: undefined;  
  ListaProtocolo: undefined; // Ensure this route is defined in your navigator
};

type HomeScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // const navigation = useNavigation();
  return (
    
    <ScrollView style={styles.container}>
      {/* Topo - Menu e Título */}
      

      {/* Saudação */}
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeText}>Bom Dia Gabriel  -  Prefeitura de Frederico Westphalen</Text>
      </View>

      {/* Clima */}
      <View style={styles.weatherBox}>
        <Ionicons name="partly-sunny-outline" size={40} color="#f4c542" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.temperature}>22°C</Text>
          <Text>Pouco nublado</Text>
          <Text style={styles.tempRange}>Máx: 22°   Min: 20°</Text>
        </View>
      </View>

      {/* Campo de busca */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#666" />
        <TextInput
          placeholder='Digite por exemplo "Boleto"'
          style={styles.searchInput}
        />
        <Ionicons name="mic-outline" size={20} color="#C4C4C4" />
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Todos                                </Text>
          <Feather name="chevron-down" size={10} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButtonSecondary}>
          <Text style={styles.filterText}>Últimos Acessados</Text>
          <Feather name="chevron-down" size={10} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Cards de ação */}
      {/* <View style={styles.cardsContainer}>
       */}
       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
       <View style={{ flexDirection: 'row', gap: 25 }}>
        <ActionCard
          icon="leaf-outline"
          onPress={() => navigation.navigate('CadastroProtocolo')}
          label="Solicitar serviços"
          

        />
        <ActionCard
          icon="construct-outline"
          onPress={() => navigation.navigate('CadastroProtocoloSteep1')}
          label="Emitir DAM"
        />
        
        <ActionCard
          icon="construct-outline"
          label="Consultar Serviços"
          onPress={() => navigation.navigate('ListaProtocolo')}
        />
        <ActionCard
          icon="construct-outline"
          label="Teste"
          onPress={() => navigation.navigate('Login')}
        />
       
        </View>
      {/* </View> */}
      </ScrollView>
    </ScrollView>
  );
};

const ActionCard = ({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) => (
  <View style={styles.card}>
    <Ionicons name={icon} size={40} color="#1c3550" />
    <Text style={styles.cardText}>{label}</Text>
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <Ionicons name="add" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    backgroundColor: '#1c3550',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeBox: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  welcomeText: {
    color: '#1c3550',
    fontSize: 14,
  },
  weatherBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0e6',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d5f2e',
  },
  tempRange: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginHorizontal: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    height: 40,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  filterButton: {
    flexDirection: 'row',
    backgroundColor: '#1c3550',
    borderRadius: 12,
    paddingRight: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  filterButtonSecondary
: {
    flexDirection: 'row',
    backgroundColor: '#1c3550',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  filterText: {
    color: '#fff',
    marginRight: 5,
    fontSize: 12,
  },
  cardsContainer: {
    paddingHorizontal: 15,
    marginBottom: 50,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  card: {
    width: 100,
    height: 110, 
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    padding: 10,
    position: 'relative',
    overflow: 'visible', 
  },
  cardText: {
    fontFamily:'Inter',
    fontSize: 12,
    fontWeight: 'semibold',
    textAlign: 'center',
    marginTop: 5,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -14, 
    zIndex: 2, 
  },
});



// import React, {useEffect, useState} from 'react';
// import {
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
//   View,
//   Text,
// } from 'react-native';

// import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// import { ListCardInitialOC } from '../../share/components/list-card-initial-oc/ListCardInitialOC';
// import { Usuario } from '../../share/models/objects/Usuario';
// import { getSession } from '../../share/services/Auth';
// import { colors, sizes } from '../../share/settings/Settings';
// import { ScreenGenerico } from '../../share/screens/screen-generico/ScreenGenerico';
// import { ListaProtocoloGenerico } from '../../src/protocolo/screens/protocolo/lista-protocolo/ListaProtocolo';
// import { CadastroProtocoloSteep1Generico } from '../../src/protocolo/screens/protocolo/cadastro-protocolo/CadastroProtocoloSteep1';

// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// // 🔷 Defina as rotas disponíveis
// type RootStackParamList = {
//   Home: undefined;
//   ListaProtocolo: undefined;
//   CadastroProtocolo: undefined;
//   ViewCadastroProtocolo: { id: number };
// };

// type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// export default function Home() {
//   const navigation = useNavigation<NavigationProps>();
//   const [usuario, setUsuario] = useState(new Usuario());

//   useEffect(() => {
//     async function getUser() {
//       const session = await getSession();
//       if (session?.usuario) {
//         setUsuario(session.usuario);
//       }
//     }

//     getUser();
//   }, []);

//   function navegarParaFicha(ficha: ScreenGenerico<any>) {
//     const rota = ficha.route;
//     if (rota === 'CadastroProtocolo' || rota === 'ListaProtocolo') {
//       navigation.navigate(rota);
//     } else {
//       console.warn('Rota não suportada:', rota);
//     }
//   }
  

//   return (
//     <View>
//       <ScrollView style={styles.container}>
//         <Text style={styles.title}>Olá, {usuario.nome.split(' ')[0]}</Text>
//         <ListCardInitialOC
//           items={[
//             {
//               icon: 'add',
//               title: 'Solicitação de Serviço',
//               onPress: () => {
//                 navegarParaFicha(CadastroProtocoloSteep1Generico);
//               },
//             },
//             {
//               icon: 'list',
//               title: 'Consulta de Serviço',
//               onPress: () => {
//                 navegarParaFicha(ListaProtocoloGenerico);
//               },
//             },
//           ]}
//         />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     height: hp('100%'),
//   },
//   title: {
//     fontSize: sizes.fontLarge,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: sizes.fontMedium,
//     marginBottom: '10%',
//   },
//   information: {
//     marginTop: '12%',
//     marginBottom: 5,
//     fontSize: sizes.fontMedium,
//     fontWeight: 'bold',
//   },
//   card: {
//     borderWidth: 1,
//     borderRadius: 5,
//     borderColor: colors.primary,
//     marginBottom: 5,
//   },
//   cardContent: {
//     alignSelf: 'flex-start',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   textSync: {
//     fontSize: sizes.fontSmall,
//     marginLeft: 10,
//   },
// });

