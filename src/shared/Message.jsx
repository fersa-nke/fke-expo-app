import React from "react";
import {View, Text, StyleSheet} from 'react-native';
import theme from "../assets/theme";


const Message = ({title, description}) => {
    return (
        <View style={Styles.msg}>
            {title && <Text style={Styles.msgTitle}>{title}</Text>}
            {description && <Text style={Styles.msgDesc}>{description}</Text>}
        </View>
    )
}

const Styles = StyleSheet.create({
    msg: {
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: theme.bgLight,
        padding: 16,
        borderRadius: 8,
        marginBottom: 24
    },
    msgTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        color: theme.textBlack
    },
    msgDesc: {
        fontSize: 14,
        fontWeight: '400',
        color: theme.textBlack
    }
});

export default Message;