import Login from '@/app/share/login/index';

import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  return <Login navigation={navigation} />;
}