import React, {useEffect, useState} from 'react';
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
  import Loader from "../../shared/Loader";
  import fersa_logo from "../../assets/images/fersa.png";
  import Input from "../../shared/Input";
  import Button from "../../shared/Button";
  import theme from "../../assets/theme";
  import Select from "../../shared/Select";
  import { Formik } from "formik";
  import * as Yup from "yup";
import { getCountries, getCustomerSectors, createRequest } from '../../redux/CreateAccount/CreateAccountAction';
import { useSelector, useDispatch } from "react-redux";

function CreateAccount({navigation}) {
    const dispatch = useDispatch();
    const [showPswd, setShowPswd] = useState(true);
    const countries = useSelector((state) => state.createAccountReducer.countries);
    const customerSectors = useSelector((state) => state.createAccountReducer.customerSectors);
    const pageLoader = useSelector((state) => state.createAccountReducer.loading);
    const fetchCountries = () => dispatch(getCountries());

    const fetchCustomerSectors = () => dispatch(getCustomerSectors());

    const initialFormValues = {
      email: '',
      company: '',
      country: null,
      sector: null,
    };

    const [formData, setFormData] = useState(initialFormValues);

    console.log('countries list', countries);
    useEffect(() => {
      fetchCountries();
      fetchCustomerSectors();
    }, []);


    const createAccountSchema = Yup.object().shape({
        email: Yup.string()
          .email("Enter Email")
          .required("Enter Email"),
        company: Yup.string().required("Enter Company"),
        country: Yup.array(Yup.object()).required("Select Country"),
        sector: Yup.array(Yup.object()).required("Select Sector")
    });

 
      const callBack = () => {
        console.log('call back called');
        //    setFormData(initialFormValues);
          navigation.navigate('Login');
      }     

    const handleSubmitPress = (values) => {
    console.log(values);
      let data = {
        Email: values.email,
        Company: values.company, 
        Country: values.country[0].Id,
        Sector: values.sector[0].Id
      };

      dispatch(createRequest(data, callBack));

    }


  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.bgWhite} />
      <Loader loading={pageLoader} />
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
            initialValues={formData}
            onSubmit={(values) => {
              handleSubmitPress(values);
            }}
            validationSchema={createAccountSchema}
            enableReinitialize
            onChange
          >
            {({ handleChange, errors, values, handleSubmit, touched, setFieldValue }) => (
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
                      value={values.company}
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
                      setFieldValue('country', [obj]);
                    }}
                    placeholder="Select Country"
                    label="Country *"
                    modalTitle="Select Country"
                    items={countries}
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
                      setFieldValue('sector', [obj]);
                    }}
                    placeholder="Select Sector"
                    label="Sector *"
                    modalTitle="Select Sector"
                    items={customerSectors}
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
