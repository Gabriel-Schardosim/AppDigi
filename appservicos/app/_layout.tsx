import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   if (!loaded) {
//     // Async font loading only occurs in development.
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import {HomeScreen} from './share/home';

 import Login from './(drawer)/login';
 import CriarConta from './(drawer)/criar-conta';
// import TabTwoScreen from './teste/explore';






const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  return (
    
      <Drawer.Navigator>

        <Drawer.Screen name="home" component={HomeScreen} />
       
        <Drawer.Screen name="login" component={Login} /> 
        {/* <Drawer.Screen name="criar-conta" component={CriarConta} /> */}

        
     

      </Drawer.Navigator>
   
  );
}