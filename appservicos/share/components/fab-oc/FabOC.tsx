import React from 'react';
import {Button, FAB} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {hp} from '../../utils/responsive';
import {colors, sizes} from "../../settings/Settings";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function FabOC(props: {
                   icon: string,

                   style?: any,
                   small?: boolean,
                   disabled?: boolean,
                   label?: string,
                   color?: string,
                   position?: 'left' | 'right'
                   onPress?: (() => void),
               }
) {

    return (
        <FAB
            color={props.color}
            disabled={props.disabled}
            icon={pIcon => <Icon
                name={props.icon}
                size={sizes.icon}
                color={colors.primary}
            />}
            label={props.label}
            onPress={props.onPress}
            small={props.small}
            style={[props.style, styles.fab, (props.position === 'left' ? styles.fabLeft : styles.fabRight)]}
        />
    );
}


function Fab2OC(props: {
                    style?: any,
                    disabled?: boolean,
                    icon?: string,
                    text?: string,
                    onPress?: (() => void)
    position?: 'left' | 'right'
                }
) {

    return (
        <Button
            disabled={props.disabled}
            onPress={props.onPress}
            style={[props.style, styles.fab, (props.position === 'left' ? styles.fabLeft : styles.fabRight)]}
        >
            <Icon
                name={props.icon ?? 'help-circle'}
                size={hp('3%')}
                color={colors.secondary}
            />
        </Button>
    );
}

export {FabOC, Fab2OC};


const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        fontSize: 20,
        padding: 5,
        borderRadius: hp('20%'),
        bottom: 0,
        backgroundColor: colors.primary
    },
    fabLeft: {
        left: 0,
    },
    fabRight: {
        right: 0,
    }
});


