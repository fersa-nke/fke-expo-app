import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  Modal,
  ScrollView,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import theme from '../assets/theme';
import Icon from '../shared/IconComp';
import GBStyles from '../assets/globalstyles';
import Ribbon from '../shared/Ribbon';

const Select = ({
  disabled,
  placeholder,
  label,
  selectedValue = '',
  modalTitle,
  handlePress,
  items,
  modalObj,
  style,
  borderStyle,
  rippleStyle,
}) => {
  const [modal, setModal] = useState(false);
  const [value, setValue] = useState(selectedValue);

  useEffect(() => {
    console.log('defaultvalue ', value, selectedValue);
    setValue(selectedValue);
  }, [selectedValue]);
  const onSelectValue = item => {
    setValue(item[modalObj.name]);
    handlePress(item);
    setModal(false);
  };
  return (
    <>
      {label && <Text style={GBStyles.labelName}>{label}</Text>}
      <View
        style={[
          disabled ? Styles.searchInputdisabled : Styles.searchInputCont,
          borderStyle,
          style,
        ]}>
        <TextInput
          placeholder={placeholder}
          value={value}
          style={Styles.searchInput}
          editable={false}
        />
        <Ripple
          disabled={disabled}
          onPress={() => setModal(true)}
          style={[
            Styles.inputCircle,
            {backgroundColor: disabled ? theme.border : theme.bgWhite},
            rippleStyle,
          ]}>
          <Icon
            name="DownAngle"
            size={16}
            color={disabled ? '#DDD8D8' : theme.textBlue}
          />
        </Ripple>
      </View>
      <Modal visible={modal} animationType="slide" transparent={true}>
        <Ribbon />
        <View style={Styles.modalContent}>
          <View style={Styles.modalHeader}>
            <Ripple style={GBStyles.rippleBtn} onPress={() => setModal(false)}>
              <Icon name="LeftAngle" size={20} color={theme.textBlue} />
            </Ripple>
            <Text style={Styles.modalTitle}>{modalTitle}</Text>
          </View>
          <Text
            style={{color: theme.textGray, fontWeight: '500', textAlign: 'center', marginVertical: 12}}>
            {items?.length} Results
            found
          </Text>
          <ScrollView style={Styles.modalBody}>
            {items?.map(item => (
              <Ripple
                key={item[modalObj.id]}
                onPress={() => onSelectValue(item)}>
                <Text style={Styles.selectText}>{item[modalObj.name]}</Text>
              </Ripple>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const Styles = StyleSheet.create({
  searchInputCont: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD8D8',
    backgroundColor: theme.bgWhite,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  searchInputdisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.border,
    paddingHorizontal: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  searchInput: {
    height: 48,
    fontSize: 16,
    color: theme.textBlack,
    flex: 1,
  },
  inputCircle: {
    width: 32,
    height: 32,
    backgroundColor: theme.bgWhite,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.bgWhite,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 16,
    color: theme.textBlack,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginLeft: 16
  },
  modalBody: {
    flex: 1,
  },
  selectText: {
    fontSize: 16,
    color: theme.textBlack,
    paddingVertical: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    marginHorizontal: 24,
  },
  circle: {
    width: 10,
    height: 10,
    backgroundColor: theme.bgBlue,
    borderRadius: 5,
  },
});

export default Select;
