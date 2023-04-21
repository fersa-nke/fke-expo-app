import React from 'react';
import {Text, StyleSheet} from 'react-native';
import Ripple from 'react-native-material-ripple';
import theme from '../assets/theme';
import Icon from './IconComp';
import Row from './Row';

const Button = ({text, onPress, style, type, buttonIcon = false}) => {
  return (
    <Ripple
      style={[
        Styles.button,
        style,
        {backgroundColor: type === 'Secondary' ? theme.bgWhite : theme.bgBlue},
      ]}
      onPress={onPress}>
      <Row>
        {buttonIcon && <Icon name="Add" size={16} color={theme.textWhite} style={{marginRight: 12}} />}
        <Text
          style={[
            Styles.buttonText,
            {color: type === 'Secondary' ? theme.textBlue : theme.textWhite},
          ]}>
          {text}
        </Text>
      </Row>
    </Ripple>
  );
};

const Styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.bgBlue,
    borderStyle: 'solid',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: theme.textWhite,
    height: 48,
    lineHeight: 48,
  },
});

export default Button;
