import React from 'react';
import {View, StyleSheet} from 'react-native';

const Row = ({children, justifyContent, alignItems, style}) => {
  return (
    <View
      style={[
        Styles.row, style,
        {
          justifyContent: justifyContent || 'center',
          alignItems: alignItems || 'center',
        },
      ]}>
      {children}
    </View>
  );
};

const Styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

export default Row;
