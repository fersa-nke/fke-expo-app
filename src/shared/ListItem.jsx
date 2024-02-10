import React from "react";
import {View, Text, StyleSheet} from 'react-native';
import theme from "../assets/theme";

const ListItem = ({label, value, style, valueStyle, children}) => {
    return(
        <View style={[Styles.listItem, style]}>
            {label && <Text style={Styles.label}>{label}</Text>}
            {children}
            {value && <Text style={[Styles.value, valueStyle]}>{value}</Text>}
        </View>
    )
}

const Styles = StyleSheet.create({
    label: {
        fontSize: 12,
        color: theme.textGray,
        fontWeight: '400'
    },
    value: {
        fontSize: 16,
        color: theme.textBlack,
        fontWeight: '600'
    },
    listItem: {
        paddingVertical: 16,
        borderBottomColor: theme.border,
        borderBottomWidth: 1,
        borderStyle: 'solid'
    }
})

export default ListItem;