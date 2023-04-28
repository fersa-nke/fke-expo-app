import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar
} from "react-native";
import Ripple from "react-native-material-ripple";
import nke_logo from "../../assets/images/nke_logo.png";
import fersa_logo from "../../assets/images/fersa.png";
import Input from "../../shared/Input";
import Button from "../../shared/Button";
import theme from "../../assets/theme";
import Loader from "../../shared/Loader";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../redux/Login/LoginActions";
import { Formik } from "formik";
import * as Yup from "yup";
import Message from "../../shared/Message";

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const isLogin = useSelector((state) => state.userReducer.isLogin);
  const isLoginFailed = useSelector((state) => state.userReducer.failed);
  const loginMessage = useSelector((state) => state.userReducer.message);
  const loader = useSelector((state) => state.userReducer.loading);
  const [operatorLogin, setOperatorLogin] = useState(false);
  const [customerLogin, setCustomerLogin] = useState(true);
  const [showCustomerPswd, setShowCustomerPswd] = useState(true);
  const [showOperatorPswd, setShowOperatorPswd] = useState(true);
  const [loginError, setLoginError] = useState(null);

  console.log(isLogin, "user loggin details");
  const dispatch = useDispatch();

  const customerLoginSchema = Yup.object().shape({
    username: Yup.string()
      .email("Enter Customer Id")
      .required("Enter Customer Id"),
    password: Yup.string().required("Enter Password."),
    //.min(8, "Password is too short - should be 8 chars minimum.")
    //.matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  });

  const operatorLoginSchema = Yup.object().shape({
    username: Yup.string()
      .email("Enter Operator Id")
      .required("Enter Operator Id"),
    password: Yup.string().required("Enter Password."),
    //.min(8, "Password is too short - should be 8 chars minimum.")
    //.matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  const handleSubmitPress = (values) => {
    let d = {
      username: values.username,
      password: values.password,
      check_textInputChange: false,
      isValidUser: true,
      isValidPassword: true,
    };
    // let dataToSend = { Email: data.username, Password: data.password };
    // Create the thunk function with the text the user wrote
    // Then dispatch the thunk function itself
    const callLogin = login(d);
    dispatch(callLogin);
    console.log("login status---->", isLogin);
  };

  const handleCustomerLogin = () => {
    setCustomerLogin(true);
    setOperatorLogin(false);
    setShowOperatorPswd(true);
  };

  const handleOperatorLogin = () => {
    setOperatorLogin(true);
    setCustomerLogin(false);
    setShowCustomerPswd(true);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.bgWhite} />
      <Loader loading={loading} />
      <ScrollView style={{ backgroundColor: theme.bgWhite }}>
        <View
          style={{
            alignItems: "center",
            height: 200,
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
            <Ripple
              style={[
                Styles.tab,
                customerLogin === true ? Styles.tabActive : "",
              ]}
              onPress={handleCustomerLogin}
            >
              <Text style={Styles.tabText}>Customer</Text>
            </Ripple>
            <Ripple
              style={[
                Styles.tab,
                operatorLogin === true ? Styles.tabActive : "",
              ]}
              onPress={handleOperatorLogin}
            >
              <Text style={Styles.tabText}>Operator</Text>
            </Ripple>
          </View>
          {isLoginFailed && <Message title="Warning!" description={loginMessage} />}
          {customerLogin && (
            <Formik
              initialValues={{
                username: "",
                password: "",
              }}
              onSubmit={(values) => {
                handleSubmitPress(values);
              }}
              validationSchema={customerLoginSchema}
            >
              {({ handleChange, errors, values, handleSubmit, touched }) => (
                <>
                  <View style={{ marginBottom: 20 }}>
                    <Input
                      labelName="Customer ID"
                      placeholder="Enter Customer ID"
                      mand={true}
                      handleChangeText={handleChange("username")}
                      value={values.username}
                    />
                    {errors.username && touched.username && (
                      <Text style={Styles.validateError}>
                        {errors.username}
                      </Text>
                    )}
                  </View>
                  <View style={{ marginBottom: 24 }}>
                    <Input
                      labelName="Password"
                      placeholder="Enter Password"
                      mand={true}
                      secureTextEntry={showCustomerPswd}
                      appendIconName={
                        showCustomerPswd === true ? "Eye" : "Eyeoff"
                      }
                      appendIconSize={showCustomerPswd === true ? 24 : 22}
                      appendIconColor={theme.textBlue}
                      handleChangeText={handleChange("password")}
                      handlePress={() => setShowCustomerPswd(!showCustomerPswd)}
                      value={values.password}
                    />
                    {errors.password && touched.password ? (
                      <Text style={Styles.validateError}>
                        {errors.password}
                      </Text>
                    ) : null}
                  </View>
                  <Button text="login" onPress={() => handleSubmit()} />
                </>
              )}
            </Formik>
          )}
          {operatorLogin && (
            <Formik
              initialValues={{
                username: "",
                password: "",
              }}
              onSubmit={(values) => {
                handleSubmitPress(values);
              }}
              validationSchema={operatorLoginSchema}
            >
              {({ handleChange, errors, values, handleSubmit, touched }) => (
                <>
                  <View style={{ marginBottom: 20 }}>
                    <Input
                      labelName="Operator ID"
                      placeholder="Enter Operator ID"
                      mand={true}
                      handleChangeText={handleChange("username")}
                      value={values.username}
                    />
                    {errors.username && touched.username && (
                      <Text style={Styles.validateError}>
                        {errors.username}
                      </Text>
                    )}
                  </View>
                  <View style={{ marginBottom: 24 }}>
                    <Input
                      labelName="Password"
                      placeholder="Enter Password"
                      mand={true}
                      handleChangeText={handleChange("password")}
                      value={values.password}
                      secureTextEntry={showOperatorPswd}
                      appendIconName={
                        showOperatorPswd === true ? "Eye" : "Eyeoff"
                      }
                      appendIconSize={showOperatorPswd === true ? 24 : 22}
                      appendIconColor={theme.textBlue}
                      handlePress={() => setShowOperatorPswd(!showOperatorPswd)}
                    />
                    {errors.password && touched.password && (
                      <Text style={Styles.validateError}>
                        {errors.password}
                      </Text>
                    )}
                  </View>
                  <Button text="login" onPress={() => handleSubmit()} />
                </>
              )}
            </Formik>
          )}
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
    marginBottom: 30,
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
  validateError: {
    fontSize: 12,
    color: theme.textRed,
    marginTop: 4,
  },
});

export default Login;
