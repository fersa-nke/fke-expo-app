import React from 'react';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { View } from 'react-native';
import IcomoonConfig from '@NkeProject-theme/selection.json';
const Icomoon = createIconSetFromIcoMoon(IcomoonConfig);
const Icon = ({ name, size, color, onPress, ...rest }) => {
    return <View>
        <Icomoon
            name={name}
            size={size}
            color={color}
            onPress={onPress}
            {...rest}
        />
    </View>
}
export default Icon;