import React, { useState } from "react";
import {
  View,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import nke_logo from "../assets/images/nke_logo.png";
import Icon from "./IconComp";
import theme from "../assets/theme";
import GBStyles from "../assets/globalstyles";
import Ripple from "react-native-material-ripple";
import { useSelector, useDispatch, connect } from "react-redux";
import { SHOW_BARCODE_BUTTON } from "../redux/ReduxConsants";
import { logout } from "../redux/Login/LoginActions";
import Input from "./Input";
import Row from "./Row";
import Ribbon from "./Ribbon";
import Button from "./Button";
import Select from "./Select";
import SearchForm from "./SearchForm";

const HeaderLeft = () => {
  return (
    <>
      <Image
        source={nke_logo}
        resizeMode="contain"
        resizeMethod="resize"
        style={{ height: 30, width: 80 }}
      />
    </>
  );
};

const HeaderRight = ({ showSeach = false, isAddPage = false }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [searchModal, setSearchModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const showBarCode = useSelector(
    (state) => state.jobsReducer.showBarCodeScanButton
  );

  const handleLogoutPress = () => {
    const callLogOut = logout();
    dispatch(callLogOut);
  };
  const isLogin = useSelector((state) => state.userReducer.isLogin);
  const handleSearch = () => {
    setSearchModal(true);
  };
  const handleSubmitPress = () => {
    setSearchModal(false);
  };

  const handleIconPress = () => {
    dispatch({
      type: SHOW_BARCODE_BUTTON,
      payload: showBarCode ? false : true,
    });
  };

  if (!isLogin) {
    navigation.navigate("Login");
  }
  if (isAddPage) {
    return (
      <>
        <Ripple style={GBStyles.rippleBtn} onPress={handleIconPress}>
          <Icon
            name="DataMatrix"
            size={22}
            color={showBarCode ? theme.textBlue : theme.textGray}
          />
        </Ripple>
      </>
    );
  }
  return (
    <>
      {showSeach && (
        <Ripple
          style={[GBStyles.rippleBtn, { marginRight: 10 }]}
          onPress={handleSearch}
        >
          <Icon name="Search" size={22} color={theme.textBlue} />
        </Ripple>
      )}
      <Ripple style={GBStyles.rippleBtn} onPress={handleLogoutPress}>
        <Icon name="Logout" size={22} color={theme.textBlue} />
      </Ripple>
      <Modal visible={searchModal} animationType="slide" transparent={true}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={Styles.modalContent}>
          <Ribbon />
            <View style={Styles.modalBody}>
            <Row style={Styles.modalHeader} justifyContent={"space-between"}>
        <Ripple
          style={GBStyles.rippleBtn}
          onPress={() => setSearchModal(false)}
        >
          <Icon name="LeftAngle" size={20} color={theme.textBlue} />
        </Ripple>
        <Text style={Styles.modalTitle}>Search</Text>
        <Ripple
          style={GBStyles.rippleBtn}
          onPress={() => setSearchModal(false)}
        >
          <Icon name="Close" size={20} color={theme.textBlue} />
        </Ripple>
      </Row>

      <SearchForm setSearchModal={setSearchModal} />

            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const Styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 30,
    paddingVertical: 50,
    flex: 1
  },
  modalBody: {
    backgroundColor: theme.bgWhite,
    width: '100%',
    height: '100%',
    alignSelf: "center",
    justifyContent: 'center'
  },
  modalHeader: {
    padding: 12
  },
  modalTitle: {
    fontSize: 14,
    color: theme.textBlack,
    fontWeight: "700",
    textTransform: "uppercase",
    marginLeft: 16,
  },
});

export { HeaderLeft, HeaderRight };
