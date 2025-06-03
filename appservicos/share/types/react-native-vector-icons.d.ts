declare module 'react-native-vector-icons/MaterialIcons' {
  import { Icon } from 'react-native-vector-icons/Icon';
  import { ImageURISource } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: any;
  }

  interface IconComponent extends React.FC<IconProps> {
    getImageSource(name: string, size?: number, color?: string): Promise<ImageURISource>;
    getImageSourceSync(name: string, size?: number, color?: string): ImageURISource;
    Button: any;
  }

  const icon: IconComponent;
  export default icon;
}
