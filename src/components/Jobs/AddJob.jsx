import React, { useState, useEffect } from "react";
import Authservice from '../../services/AuthService';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Platform,
} from "react-native";
import theme from "../../assets/theme";
import GBStyles from "../../assets/globalstyles";
import Input from "../../shared/Input";
import Button from "../../shared/Button";
import Row from "../../shared/Row";
import Icon from "../../shared/IconComp";
import Ripple from "react-native-material-ripple";
import Select from "../../shared/Select";
import { useSelector, useDispatch } from "react-redux";
import { saveJob, updateJob } from "../../redux/Jobs/JobsActions";
import { BarCodeScanner } from "expo-barcode-scanner";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FieldInitialLoader } from "../../shared/InitialLoaders";
import { Formik } from "formik";
import * as Yup from "yup";
import Loader from '../../shared/Loader';
import AuthService from "../../services/AuthService";

const AddJob = ({ navigation, route }) => {
  const { Id } = route.params;
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState("");
  const dispatch = useDispatch();
  const masterData = useSelector((state) => state.masterReducer);
  const userData = useSelector((state) => state.userReducer.user);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [matrixNumber, setMatrixNumber] = useState(false);
  const [barcodeReaderFailed, setBarCodeReaderFailed] = useState(false);
  const selectedJobId = useSelector((state) => state.jobsReducer.selectedJobId);
  const jobs = useSelector((state) => state.jobsReducer.jobs);
  const loading = useSelector((state) => state.jobsReducer.pageLoader);
  let customerId = AuthService.isOperator() ? userData?.CustomerId : userData?.UserId;
  let operatorId = AuthService.isOperator() ? userData?.UserId : null;

  const initialFormValues = {
    DataMatirx: '',
    Date: '',
    Brand: '',
    WindFarm: '',
    WindTurbine: '',
    ORNumber: '',
    IRNumber: '',
    BatchNumber: '',
    GeneratorModel: '',
    Comments: '',
    Reasons: '',
    ExchangeType: '',
    ShaftPosition: '',
    NewBearingBrand: '',
    NewBearingType: '',
    RemoveBearingBrand: '',
    RemoveBearingType: '',
    ReportCode: ''
  };
  const [formData, setFormData] = useState(initialFormValues);
  
  
    useEffect(() => {
     if(Id && selectedJobId && jobs && jobs.length > 0) {
      const filterJob = jobs.filter(j => j.Id === selectedJobId)[0];
      console.log('fetched job details', customerId, operatorId, selectedJobId , filterJob);
      //setJob(filterJob);
      let formValues = {
        DataMatirx: filterJob?.DataMatirx,
        Date: filterJob?.Date,
        WindFarm: filterJob?.WindFarm,
        WindTurbine: filterJob?.WindTurbine,
        ORNumber: filterJob?.ORNumber || '',
        IRNumber: filterJob?.IRNumber || '',
        BatchNumber: filterJob?.BatchNumber || '',
        GeneratorModel: filterJob?.GeneratorModel,
        Comments: filterJob?.Comments,
        Reasons: filterJob?.Reasons[0],
        ExchangeType: filterJob?.ExchangeType[0],
        ShaftPosition: filterJob?.ShaftPosition[0],
        NewBearingBrand: filterJob?.NewBearingBrand[0],
        NewBearingType: filterJob?.NewBearingType[0],
        RemoveBearingBrand: filterJob?.RemoveBearingBrand[0],
        RemoveBearingType: filterJob?.RemoveBearingType[0],
        ReportCode:""
      }
      setFormData(formValues);
      setResult(filterJob?.DataMatirx);
      setStartDate(new Date(filterJob?.Date));
     }

    }, []);
  
  // const addJobSchema = Yup.object().shape({
  //   DataMatirx: Yup.string().required("Please Scan Data Matrix"),
  //   //Name: Yup.string().required("Enter Job Name"),
  //   Brand: Yup.string().required("Please Select Brand"),
  //   "OR Number": Yup.string().required("Enter OR Number"),
  //   "IR Number": Yup.string().required("Enter IR Number"),
  //   "Wind Farm": Yup.string().required("Enter Wind Farm"),
  //   "Wind Turbine": Yup.string().required("Enter Wind Turbine"),
  //   "Batch Number": Yup.string().required("Enter Batch Number"),
  //   "Generator Model": Yup.string().required("Enter Generator Model"),
  //   'Reasons List': Yup.string().required("Please Select Reason"),
  //   'Part Type List': Yup.string().required("Please Select Type"),
  //   'Shaft Position List': Yup.string().required("Please Select Shaft Position"),
  //   'Exchange Type List': Yup.string().required("Please Select Exchange Type"),
  //   "Comments": Yup.string(),
  //   "Report Code": Yup.string()
  // });

  
  const addJobSchema = Yup.object().shape({
    DataMatirx: barcodeReaderFailed ?  Yup.string() : Yup.string(),
    ORNumber: barcodeReaderFailed ? Yup.string().required("Enter OR Number") : Yup.string(),
    IRNumber: barcodeReaderFailed ? Yup.string().required("Enter IR Number") : Yup.string(),
    BatchNumber:  barcodeReaderFailed ? Yup.string().required("Enter Batch Number") : Yup.string(),
    WindFarm: Yup.string().required("Enter Wind Farm"),
    WindTurbine: Yup.string(),
    GeneratorModel: Yup.string(),
    Reasons: Yup.object(),
    NewBearingType: Yup.object(),
    NewBearingBrand: Yup.object(),
    RemoveBearingBrand: Yup.object(),
    RemoveBearingType: Yup.object(),
    ShaftPosition: Yup.object(),
    ExchangeType: Yup.object(),
    Comments: Yup.string(),
    ReportCode: Yup.string()
  });

  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const showScanner = async () => {
    setScanLoading(true);
    await getBarCodeScannerPermissions();
    setScan(true);
    setScanLoading(false);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setShow(false);
    setStartDate(currentDate);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    onSuccess(type, data);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (scanLoading && hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (scan && hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const onSuccess = (type, data) => {
    if (type && data != null) {
      setResult(data);
      setScan(false);
    } else {
      setScan(true);
    }
  };

  const startScan = () => {
    setScan(true);
  };

  const callBack = () => {
    navigation.navigate('Jobs');
  }

  const handleSubmitPress = (values) => {
   
    let data = {
      DataMatirx: result,
      Date: startDate ? startDate.toISOString().split("T")[0]: '',
      Reasons: [values['Reasons']],
      ExchangeType: [values['ExchangeType']],
      ShaftPosition: [values['ShaftPosition']],
      NewBearingType: [values['NewBearingType']],
      NewBearingBrand: [values['NewBearingBrand']],
      RemoveBearingBrand: [values['RemoveBearingBrand']],
      RemoveBearingType: [values['RemoveBearingType']],
      GeneratorModel: values['GeneratorModel'],
      WindFarm: values['WindFarm'],
      WindTurbine: values['WindTurbine'],
      CustomerId: customerId,
      OperatorId: operatorId,
      Comments: values['Comments'],
      ReportCode: values['ReportCode']
    };
    console.log('submitting data job ------------->',data);
    if(Id) {
      dispatch(updateJob(data, Id, callBack));
    } else {
      dispatch(saveJob(data, callBack));
    }
  };

  return (
    <ScrollView style={{ backgroundColor: theme.bgWhite }}>
      {/* <View style={{padding: 18}}>{[1,2,3,4,5,6,7,8,9].map((idx)=>(
       <FieldInitialLoader key={idx} />
     ))}</View> */}
     <Loader loading={loading} />

      {scan ? (
        <View style={Styles.container}>
          <BarCodeScanner
            style={[
              StyleSheet.absoluteFill,
              Styles.container,
              {
                flex: 1,
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height - 140,
              },
            ]}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={Styles.layerTop} />
            <View style={Styles.layerCenter}>
              <View style={Styles.layerLeft} />
              <View style={Styles.focused} />
              <View style={Styles.layerRight} />
            </View>
            <View style={Styles.layerBottom}>
              <Button
                text="Close"
                style={{ margin: 40 }}
                onPress={() => {
                  setScan(false), setScanned(false);
                }}
              />
            </View>
          </BarCodeScanner>

          {scanned && (
            <Button
              text="Tap to Scan Again"
              onPress={() => setScanned(false)}
            />
          )}
        </View>
      ) : (
        <Formik
          initialValues={formData}
          onSubmit={(values) => {
            console.log('Job Save=========>', values);
            handleSubmitPress(values);
          }}
          validationSchema={addJobSchema}
          enableReinitialize
        >
          {({ handleChange, errors, values, handleSubmit, touched, setFieldValue }) => (
            <View style={GBStyles.container}>
               {/* <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Job Name"
                  placeholder="Enter Job Name"
                  handleChangeText={handleChange("Name")}
                  value={values.Name}
                />
                {errors.Name && touched.Name && (
                  <Text style={Styles.validateError}>{errors.Name}</Text>
                )}
              </View> */}
              
              {barcodeReaderFailed ? (
                <>
                  <View style={{ marginBottom: 20 }}>
                    <Input
                      labelName="Batch Number"
                      placeholder="Enter Batch Number"
                      handleChangeText={handleChange("BatchNumber")}
                      value={values["BatchNumber"]}
                    />
                    {errors["BatchNumber"] && touched["BatchNumber"] && (
                      <Text style={Styles.validateError}>
                        {errors["BatchNumber"]}
                      </Text>
                    )}
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Input
                      labelName="IR Number"
                      placeholder="Enter IR Number"
                      handleChangeText={handleChange("IRNumber")}
                      value={values["IRNumber"]}
                    />
                    {errors["IRNumber"] && touched["IRNumber"] && (
                      <Text style={Styles.validateError}>
                        {errors["IRNumber"]}
                      </Text>
                    )}
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Input
                      labelName="OR Number"
                      placeholder="Enter OR Number"
                      handleChangeText={handleChange("ORNumber")}
                      value={values["ORNumber"]}
                    />
                    {errors["ORNumber"] && touched["ORNumber"] && (
                      <Text style={Styles.validateError}>
                        {errors["ORNumber"]}
                      </Text>
                    )}
                  </View>
                </>
              ) : <>
              <Ripple
                onPress={showScanner}
                style={{ alignSelf: "center", marginBottom: 24, marginTop: 12 }}
              >
                <Icon
                  name="DataMatrix"
                  size={60}
                  color={theme.textBlue}
                  style={{ alignSelf: "center" }}
                />
                <Text style={{ alignSelf: "center", marginTop: 5 }}>
                  Scan Data Matrix
                </Text>
              </Ripple>
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Data Matrix Code"
                  placeholder="Enter Data Matrix Code"
                  value={result}
                  disabled={true}
                />
              </View>
              </>}
             
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Start Date"
                  placeholder="DD/MM/YYYY"
                  appendIconName="Calendar"
                  appendIconColor={theme.textBlue}
                  appendIconSize={16}
                  value={startDate.toLocaleDateString()}
                  handlePress={() => setShow(true)}
                />
                {show && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    onChange={onChange}
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                  />
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values["ExchangeType"]?.Name}
                  disabled={false}
                  onChange={(item)=>{
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('ExchangeType', obj);
                  }}
                  placeholder="Select Exchange"
                  label="Exchange"
                  modalTitle="Select Exchange"
                  items={masterData.exhangeTypes}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors["ExchangeType"] && touched["ExchangeType"] && (
                  <Text style={Styles.validateError}>
                    {errors["ExchangeType"]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values["Reasons"]?.Name}
                  disabled={false}
                  onChange={(item)=>{
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('Reasons', obj);
                  }}
                  placeholder="Select Reason"
                  label="Reasons of Change"
                  modalTitle="Select Reason"
                  items={masterData.reasonOfChanges}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors["Reasons"] && touched["Reasons"] && (
                  <Text style={Styles.validateError}>
                    {errors["Reasons"]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Wind Farm"
                  placeholder="Enter Wind Farm"
                  handleChangeText={handleChange("WindFarm")}
                  value={values["WindFarm"]}
                />
                {errors["WindFarm"] && touched["WindFarm"] && (
                  <Text style={Styles.validateError}>
                    {errors["WindFarm"]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Wind Turbine"
                  placeholder="Enter Wind Turbine"
                  handleChangeText={handleChange("WindTurbine")}
                  value={values["WindTurbine"]}
                />
                {errors["WindTurbine"] && touched["WindTurbine"] && (
                  <Text style={Styles.validateError}>
                    {errors["WindTurbine"]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values["ShaftPosition"]?.Name}
                  disabled={false}
                  onChange={(item) =>{
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('ShaftPosition', obj);
                  }}
                  placeholder="Select Shaft Position"
                  label="Shaft Position"
                  modalTitle="Select Shaft Position"
                  items={masterData.shaftPositions}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors["ShaftPosition"] && touched["ShaftPosition"] && (
                  <Text style={Styles.validateError}>
                    {errors["ShaftPosition"]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values["RemoveBearingBrand"]?.Name}
                  disabled={false}
                  onChange={(item) =>{
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('RemoveBearingBrand', obj);
                  }}
                  placeholder="Select Removed Brearing Brand"
                  label="Removed Brearing Brand"
                  modalTitle="Select Removed Brearing Brand"
                  items={masterData.brands}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors['RemoveBearingBrand'] && touched['RemoveBearingBrand'] && (
                  <Text style={Styles.validateError}>
                    {errors['RemoveBearingBrand']}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values["RemoveBearingType"]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('RemoveBearingType', obj);
                  }}
                  placeholder="Select Removed Brearing Type"
                  label="Removed Brearing Type"
                  modalTitle="Select Removed Brearing Type"
                  items={masterData.bearingTypes}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors['RemoveBearingType'] && touched['RemoveBearingType'] && (
                  <Text style={Styles.validateError}>
                    {errors['RemoveBearingType']}
                  </Text>
                )}
              </View>
             
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Generator Model"
                  placeholder="Enter Generator Model"
                  handleChangeText={handleChange("GeneratorModel")}
                  value={values["GeneratorModel"]}
                />
                {errors["GeneratorModel"] && touched["GeneratorModel"] && (
                  <Text style={Styles.validateError}>
                    {errors["GeneratorModel"]}
                  </Text>
                )}
              </View>

              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values["NewBearingBrand"]?.Name}
                  disabled={false}
                  onChange={(item) =>{
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('NewBearingBrand', obj);
                  }}
                  placeholder="Select Bearing Brand"
                  label="New Bearing Brand"
                  modalTitle="Select Bearing Brand"
                  items={masterData.brands}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors['NewBearingBrand'] && touched['NewBearingBrand'] && (
                  <Text style={Styles.validateError}>
                    {errors['NewBearingBrand']}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values["NewBearingType"]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('NewBearingType', obj);
                  }}
                  placeholder="Select Bearing Type"
                  label="New Bearing Type"
                  modalTitle="Select Bearing Type"
                  items={masterData.bearingTypes}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors['NewBearingType'] && touched['NewBearingType'] && (
                  <Text style={Styles.validateError}>
                    {errors['NewBearingType']}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Report Code"
                  placeholder="Enter Report Code"
                  handleChangeText={handleChange("ReportCode")}
                  value={values['ReportCode']}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Comments"
                  placeholder="Enter Comments"
                  multiline={true}
                  handleChangeText={handleChange("Comments")}
                  value={values.Comments}
                />
              </View>
              {/* <Ripple
            style={Styles.addReportBtn}
            onPress={() => navigation.navigate("AddReport")}
          >
            <Row>
              <Icon name="AddReport" size={18} color={theme.textBlue} />
              <Text style={[GBStyles.pageTitle, Styles.addReportBtnText]}>
                Add report
              </Text>
            </Row>
          </Ripple> */}
              <Row>
                <Button
                  text="Save"
                  style={{ flex: 1, marginRight: 8 }}
                  onPress={() => handleSubmit()}
                />
                <Button
                  text="Close"
                  type="Secondary"
                  style={{ flex: 1, marginLeft: 8 }}
                  onPress={() => navigation.navigate("Jobs")}
                />
              </Row>
            </View>
          )}
        </Formik>
      )}
    </ScrollView>
  );
};

const opacity = "rgba(0, 0, 0, .6)";
const Styles = StyleSheet.create({
  addReportBtnText: {
    color: theme.textBlue,
    marginBottom: 0,
    marginLeft: 6,
  },
  addReportBtn: {
    marginBottom: 34,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    overflow: "hidden",
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 1,
    flexDirection: "row",
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity,
  },
  validateError: {
    fontSize: 12,
    color: theme.textRed,
    marginTop: 4,
  },
});

export default AddJob;
