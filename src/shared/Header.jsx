import React, {useState} from 'react';
import {View, Image, Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import nke_logo from '../assets/images/nke_logo.png';
import Icon from './IconComp';
import theme from '../assets/theme';
import GBStyles from '../assets/globalstyles';
import Ripple from 'react-native-material-ripple';
import {useSelector, useDispatch, connect} from 'react-redux';
import {logout} from '../redux/Login/LoginActions';
import Input from './Input';
import Row from './Row';

const HeaderLeft = () => {
  return (
    <>
      <Image
        source={nke_logo}
        resizeMode="contain"
        resizeMethod="resize"
        style={{height: 30, width: 80}}
      />
    </>
  );
};

const HeaderRight = ({showSeach = false}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [searchModal, setSearchModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleLogoutPress = () => {
    console.log('logout pressed');
    const callLogOut = logout();
    dispatch(callLogOut);
  };
  const isLogin = useSelector(state => state.userReducer.isLogin);
  const handleSearch = () => {
    setSearchModal(true);
  };
  const handleSubmitPress = () => {
    setSearchModal(false);
  }
  if (!isLogin) {
    navigation.navigate('Login');
  }
  return (
    <>
      {showSeach && (
        <Ripple
          style={[GBStyles.rippleBtn, {marginRight: 10}]}
          onPress={handleSearch}>
          <Icon name="Search" size={22} color={theme.textBlue} />
        </Ripple>
      )}
      <Ripple style={GBStyles.rippleBtn} onPress={handleLogoutPress}>
        <Icon name="Logout" size={22} color={theme.textBlue} />
      </Ripple>
      <Modal visible={searchModal} animationType="fade" transparent={true}>
        <View style={GBStyles.modalContent}>
          <Row style={GBStyles.modalHeader}>
            <Ripple
              style={GBStyles.rippleBtn}
              onPress={() => setSearchModal(false)}>
              <Icon name="LeftAngle" size={20} color={theme.textBlue} />
            </Ripple>
            <Input
              style={{flex: 1, marginLeft: 10}}
              autoFocus
              placeholder="Search"
              appendIcon
              appendIconSize={22}
              appendIconColor={theme.textBlue}
              appendIconName="Search"
              handleChangeText={setSearchText}
              handlePress={handleSubmitPress}
              onSubmitEditing={handleSubmitPress}
            />
          </Row>
        </View>
      </Modal>
    </>
  );
};

export {HeaderLeft, HeaderRight};
