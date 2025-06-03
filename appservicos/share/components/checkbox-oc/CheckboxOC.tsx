import React from 'react';
import {Checkbox, Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {componentsStyles} from '../../settings/GlobalStyle';
import {colors, sizes} from '../../settings/Settings';

function CheckboxOC(props: {
                        checked: boolean,
                        onPress: ((valueChange) => void),

                        style?: any,
                        disabled?: boolean,
                    }
) {

    return (
        <TouchableOpacity
            style={props.style}
            onPress={() => props.onPress(!props.checked)}
        >
            <Checkbox
                disabled={props.disabled}
                onPress={() => props.onPress(!props.checked)}
                status={props.checked ? 'checked' : 'unchecked'}
            />
        </TouchableOpacity>
    );
}

function CheckboxLabelOC(props: {
                             checked: boolean,
                             onPress: ((valueChange) => void),
                             label: string,

                             style?: any,
                             disabled?: boolean,
                             align?: 'left' | 'right',
                         }
) {

    return (
        <TouchableOpacity
            style={[props.style ? props.style : styles.container, componentsStyles.input, props.align && props.align === 'right' ? styles.right : false]}
            onPress={() => props.onPress(!props.checked)}
        >
            <Checkbox
                color={colors.primary}
                disabled={props.disabled}
                onPress={() => props.onPress(!props.checked)}
                status={props.checked ? 'checked' : 'unchecked'}
            />
            <Text style={styles.text}>
                {props.label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    left: {
        alignSelf: 'flex-start',
    },
    right: {
        alignSelf: 'flex-end',
    },
    text: {
        fontSize: sizes.fontSmall,
        color: colors.icon,
        marginLeft: 5
    }
});


export {CheckboxOC, CheckboxLabelOC};
