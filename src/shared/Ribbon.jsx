import React from 'react';
import {View} from 'react-native';

const Ribbon = () => {
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{height: 5, backgroundColor: '#FECC00', flex: 1, 
          marginRight: 8,}}></View>
      <View
        style={{
          height: 5,
          backgroundColor: '#FECC00',
          flex: 2,
        }}></View>
    </View>
  );
};

export default Ribbon;
