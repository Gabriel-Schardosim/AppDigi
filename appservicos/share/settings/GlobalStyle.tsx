import {StyleSheet} from 'react-native';
import {colors} from './Settings';
import {hp} from '../utils/responsive';

const componentsStyles = StyleSheet.create({
    container: {
        /*marginTop: 5,
        marginBottom: 5,*/
    },
    input: {
        height: hp('7%'),
        fontSize: hp('2%'),
    },
    button: {
        height: hp('6.5%'),
    },
});

const screenStyles = StyleSheet.create({
    scroll: {
      paddingLeft: 20,
      paddingRight: 20,
      marginTop: 20,
      marginBottom: 20,
      backgroundColor: colors.background,
    },
});

export {componentsStyles, screenStyles}
