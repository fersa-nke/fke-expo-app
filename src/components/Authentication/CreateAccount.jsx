import React, {useState} from 'react';
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
  import Select from "../../shared/Select";
  import { Formik } from "formik";
  import * as Yup from "yup";

function CreateAccount({navigation}) {
    const [showPswd, setShowPswd] = useState(true);
    const createAccountSchema = Yup.object().shape({
        email: Yup.string()
          .email("Enter Email")
          .required("Enter Email"),
        company: Yup.string().required("Enter Company"),
        country: Yup.string().required("Select Country"),
        sector: Yup.string().required("Select Sector")
      });
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.bgWhite} />
      {/* <Loader loading={loginLoader} /> */}
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
          <Formik
            initialValues={{
              email: "",
              company: "",
              country: "",
              sector: "",
            }}
            onSubmit={(values) => {
              handleSubmitPress(values);
            }}
            validationSchema={createAccountSchema}
          >
            {({ handleChange, errors, values, handleSubmit, touched }) => (
              <>
                <View style={{ marginBottom: 20 }}>
                  <Input
                    labelName="Email"
                    placeholder="Enter Email"
                    mand={true}
                    handleChangeText={handleChange("email")}
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <Text style={Styles.validateError}>{errors.email}</Text>
                  )}
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Input
                      labelName="Company"
                      placeholder="Enter Company"
                      mand={true}
                      handleChangeText={handleChange("company")}
                      value={values.email}
                    />
                    {errors.company && touched.company && (
                      <Text style={Styles.validateError}>
                        {errors.company}
                      </Text>
                    )}
                  </View>
                <View style={{ marginBottom: 20 }}>
                  <Select
                    selectedValue={""}
                    disabled={false}
                    onChange={(item) => {
                      let obj = { Id: item.Id, Name: item.Name };
                      setFieldValue(REMOVEDBEARINGBRAND, [obj]);
                    }}
                    placeholder="Select Country"
                    label="Country *"
                    modalTitle="Select Country"
                    //items={{ id: "Id", name: "Name" }}
                    modalObj={{ id: "Id", name: "Name" }}
                  />
                  {errors.country && touched.country && (
                    <Text style={Styles.validateError}>{errors.country}</Text>
                  )}
                </View>
                <View style={{ marginBottom: 25 }}>
                  <Select
                    selectedValue={""}
                    disabled={false}
                    onChange={(item) => {
                      let obj = { Id: item.Id, Name: item.Name };
                      setFieldValue(REMOVEDBEARINGBRAND, [obj]);
                    }}
                    placeholder="Select Sector"
                    label="Sector *"
                    modalTitle="Select Sector"
                    //items={{ id: "Id", name: "Name" }}
                    modalObj={{ id: "Id", name: "Name" }}
                  />
                  {errors.sector && touched.sector && (
                    <Text style={Styles.validateError}>{errors.sector}</Text>
                  )}
                </View>
                <Button text="Send" onPress={() => handleSubmit()} />
              </>
            )}
          </Formik>
          <Button
            type="Secondary"
            style={{ marginTop: 15 }}
            text="Back"
            onPress={() => navigation.navigate("Login")}
          />
          <Image
            source={fersa_logo}
            style={{ marginTop: 36, alignSelf: "center" }}
            height={25}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </>
  );
}

const Styles = StyleSheet.create({
    validateError: {
      fontSize: 12,
      color: theme.textRed,
      marginTop: 4,
    },
  });

export default CreateAccount; 
