import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import Ripple from "react-native-material-ripple";
import nke_logo from "../../assets/images/nke_logo.png";
import fersa_logo from "../../assets/images/fersa.png";
import Input from "../../shared/Input";
import Button from "../../shared/Button";
import theme from "../../assets/theme";
import Loader from "../../shared/Loader";
import { useSelector, useDispatch, connect } from "react-redux";
import { login } from "../../redux/Login/LoginActions";

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const isLogin = useSelector((state) => state.userReducer.isLogin);

  console.log(isLogin, "user loggin details");
  const dispatch = useDispatch();

  const [data, setData] = useState({
    username: "operator@gmail.com",
    password: "test",
    check_textInputChange: false,
    isValidUser: true,
    isValidPassword: true,
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  const handleEmailChange = (val) => {
    if (val.trim().length < 3) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length < 3) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const handleSubmitPress = () => {
    if (data.username.length == 0 || data.password.length == 0) {
      Alert.alert(
        "Wrong Input!",
        "Username or password field cannot be empty.",
        [{ text: "Okay" }]
      );
      return;
    }
    setLoading(true);
    // let dataToSend = { Email: data.username, Password: data.password };
    // Create the thunk function with the text the user wrote
    // Then dispatch the thunk function itself
    const callLogin = login(data);
    dispatch(callLogin);
    console.log("login status---->", isLogin);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.bgWhite} />
      <Loader loading={loading} />
      <ScrollView style={{ backgroundColor: theme.bgWhite }}>
        <View
          style={{
            alignItems: "center",
            height: 220,
            justifyContent: "center",
          }}
        >
          <Image
            source={nke_logo}
            width={80}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </View>
        <View style={{ padding: 16 }}>
          <View style={Styles.tabRow}>
            <Ripple style={[Styles.tab, Styles.tabActive]}>
              <Text style={Styles.tabText}>Customer</Text>
            </Ripple>
            <Ripple style={Styles.tab}>
              <Text style={Styles.tabText}>Operator</Text>
            </Ripple>
          </View>
          <View style={{ marginBottom: 20 }}>
            <Input
              labelName="Customer ID"
              placeholder="Enter Customer ID"
              mand={true}
              handleChangeText={handleEmailChange}
            />
          </View>
          <View style={{ marginBottom: 24 }}>
            <Input
              labelName="Password"
              placeholder="Enter password"
              mand={true}
              secureTextEntry={true}
              appendIconName="Eye"
              appendIconSize={22}
              appendIconColor={theme.textBlue}
              handleChangeText={handlePasswordChange}
            />
          </View>
          <Button text="login" onPress={handleSubmitPress} />
          <Image
            source={fersa_logo}
            style={{ marginVertical: 24, alignSelf: "center" }}
            height={25}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </>
  );
};

const Styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    marginBottom: 44,
    alignSelf: "center",
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  tabText: {
    fontSize: 18,
    color: theme.textBlack,
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center",
  },
  tabActive: {
    borderBottomWidth: 4,
    borderBottomColor: theme.bgBlue,
    borderStyle: "solid",
  },
});

const mapStateToProps = (state) => ({
  isLogin: state.userReducer.isLogin,
});

export default Login;
