import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from './IconComp';
import theme from '../assets/theme';

function Input({
  labelName,
  placeholder,
  mand = false,
  value,
  autoFocus,
  keyboardType,
  handleChangeText,
  onSubmitEditing,
  secureTextEntry,
  prependIcon,
  prependIconColor,
  prependIconName,
  prependIconSize,
  appendIconColor,
  appendIconName,
  appendIconSize,
  handlePress,
  style
}) {
  return (
    <>
      {labelName && (
        <Text style={Styles.labelName}>
          {labelName}
          {mand && <Text style={Styles.mand}> *</Text>}
        </Text>
      )}
      <View style={[Styles.inputContainer, style]}>
        {prependIcon && (
          <View style={Styles.inputCircle}>
            <Icon
              name={prependIconName}
              size={prependIconSize}
              color={prependIconColor}
            />
          </View>
        )}
        <TextInput
          style={Styles.input}
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          onChangeText={handleChangeText}
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={secureTextEntry}
        />
        {appendIconName && (
          <Ripple style={Styles.inputCircle} onPress={handlePress}>
            <Icon
              name={appendIconName}
              size={appendIconSize}
              color={appendIconColor}
            />
          </Ripple>
        )}
      </View>
    </>
  );
}

const Styles = StyleSheet.create({
  labelName: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD8D8',
    borderStyle: 'solid',
    borderRadius: 8,
    backgroundColor: theme.bgWhite,
    paddingHorizontal: 12
  },
  mand: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    height: 48,
    fontSize: 16,
    color: theme.textBlack,
    flex: 1
  },
  inputCircle: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Input;
