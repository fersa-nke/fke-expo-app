import React, { useState } from "react";
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
import { saveJob } from "../../redux/Jobs/JobsActions";
import { BarCodeScanner } from "expo-barcode-scanner";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FieldInitialLoader } from "../../shared/InitialLoaders";
import { Formik } from "formik";
import * as Yup from "yup";

const AddJob = ({ navigation }) => {
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState("");
  const dispatch = useDispatch();
  const masterData = useSelector((state) => state.masterReducer);
  const userData = useSelector((state) => state.userReducer.user);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [selectedReasonForChange, setSelectedReasonForChange] = useState({});
  const [selectedBrand, setSelectedBrand] = useState({});
  const [selectedShaftPositon, setSelectedShaftPositon] = useState({});
  const [selectedExchange, setSelectedExchange] = useState({});
  const [selectedBearingType, setSelectedBearingType] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [matrixNumber, setMatrixNumber] = useState(false);
  const [barcodeReaderFailed, setBarCodeReaderFailed] = useState(false);
  const [comments, setComments] = useState("");
  const [jobName, setJobName] = useState("");
  const [orNumber, setOrNumber] = useState("");
  const [irNumber, setIrNumber] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [generatorModel, setGeneratorModel] = useState("");
  const [windForm, setWindForm] = useState("");
  const [windTurbine, setWindTurbine] = useState("");

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
    "OR Number": barcodeReaderFailed ? Yup.string().required("Enter OR Number") : Yup.string(),
    "IR Number": barcodeReaderFailed ? Yup.string().required("Enter IR Number") : Yup.string(),
    "Batch Number":  barcodeReaderFailed ? Yup.string().required("Enter Batch Number") : Yup.string(),
    "Wind Farm": Yup.string().required("Enter Wind Farm"),
    "Wind Turbine": Yup.string(),
    "Generator Model": Yup.string(),
    Brand: Yup.object(),
    'Reasons List': Yup.object(),
    'Part Type List': Yup.object(),
    'Shaft Position List': Yup.object(),
    'Exchange Type List': Yup.object(),
    "Comments": Yup.string(),
    "Report Code": Yup.string()
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

  const handleSubmitPress = (values) => {
    //setLoading(true);
    let data = {
      DataMatirx: result,
      Date: startDate,
      Name: values.Name,
      Brand: [values.Brand],

      "Wind Farm": values['Wind Farm'],
      "Wind Turbine": values['Wind Turbine'],
      "OR Number": values['OR Number'],
      "IR Number": values['IR Number'],
      "Batch Number": values['Batch Number'],
      "Generator Model": values['Generator Model'],
      Comments: values.Comments,
      "Reasons List": [values['Reasons List']],
      "Part Type List": [values['Part Type List']],
      "Exchange Type List": [values['Exchange Type List']],
      "Brand List": [values['Brand List']],
      "Shaft Position List": [values['Shaft Position List']],
      CustomerId: userData?.CustomerId,
      OperatorId: userData?.OperatorId,
    };
    
    console.log("Job Submit============>",data)
    dispatch(saveJob(data));
  };

  return (
    <ScrollView style={{ backgroundColor: theme.bgWhite }}>
      {/* <View style={{padding: 18}}>{[1,2,3,4,5,6,7,8,9].map((idx)=>(
       <FieldInitialLoader key={idx} />
     ))}</View> */}
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
          initialValues={{
            DataMatirx: "",
            Date: "",
            //Name: "",
            Brand: "",
            Model: "",
            "Wind Farm": "",
            "Wind Turbine": "",
            "OR Number": "",
            "IR Number": "",
            "Batch Number": "",
            "Generator Model": "",
            Comments: "",
            "Reasons List": "",
            "Part Type List": "",
            "Exchange Type List": "",
            "Brand List": "",
            "Shaft Position List": "",
            "Report Code":""
          }}
          onSubmit={(values) => {

            console.log('Job Save=========>', values)
            alert("Hi")
            handleSubmitPress(values);
          }}
          validationSchema={addJobSchema}
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
                      handleChangeText={handleChange("Batch Number")}
                      value={values["Batch Number"]}
                    />
                    {errors["Batch Number"] && touched["Batch Number"] && (
                      <Text style={Styles.validateError}>
                        {errors["Batch Number"]}
                      </Text>
                    )}
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Input
                      labelName="IR Number"
                      placeholder="Enter IR Number"
                      handleChangeText={handleChange("IR Number")}
                      value={values["IR Number"]}
                    />
                    {errors["IR Number"] && touched["IR Number"] && (
                      <Text style={Styles.validateError}>
                        {errors["IR Number"]}
                      </Text>
                    )}
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Input
                      labelName="OR Number"
                      placeholder="Enter OR Number"
                      handleChangeText={handleChange("OR Number")}
                      value={values["OR Number"]}
                    />
                    {errors["OR Number"] && touched["OR Number"] && (
                      <Text style={Styles.validateError}>
                        {errors["OR Number"]}
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
                  selectedValue={masterData.exhangeTypes?.Name}
                  disabled={false}
                  onChange={(item)=>{
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('Exchange Type List', obj);
                  }}
                  placeholder="Select Exchange"
                  label="Exchange"
                  modalTitle="Select Exchange"
                  items={masterData.exhangeTypes}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors["Exchange Type List"] && touched["Exchange Type List"] && (
                  <Text style={Styles.validateError}>
                    {errors["Exchange Type List"]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values["Reasons List"].Name}
                  disabled={false}
                  onChange={(item)=>{
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('Reasons List', obj);
                  }}
                  placeholder="Select Reason"
                  label="Reasons of Change"
                  modalTitle="Select Reason"
                  items={masterData.reasonOfChanges}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors["Reasons List"] && touched["Reasons List"] && (
                  <Text style={Styles.validateError}>
                    {errors["Reasons List"]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Wind Farm"
                  placeholder="Enter Wind Farm"
                  handleChangeText={handleChange("Wind Farm")}
                  value={values["Wind Farm"]}
                />
                {errors["Wind Farm"] && touched["Wind Farm"] && (
                  <Text style={Styles.validateError}>
                    {errors["Wind Farm"]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Wind Turbine"
                  placeholder="Enter Wind Turbine"
                  handleChangeText={handleChange("Wind Turbine")}
                  value={values["Wind Turbine"]}
                />
                {errors["Wind Turbine"] && touched["Wind Turbine"] && (
                  <Text style={Styles.validateError}>
                    {errors["Wind Turbine"]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={masterData.shaftPositions?.Name}
                  disabled={false}
                  onChange={(item) =>{
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('Shaft Position List', obj);
                  }}
                  placeholder="Select Shaft Position"
                  label="Shaft Position"
                  modalTitle="Select Shaft Position"
                  items={masterData.shaftPositions}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors["Shaft Position List"] && touched["Shaft Position List"] && (
                  <Text style={Styles.validateError}>
                    {errors["Shaft Position List"]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={masterData.brands?.Name}
                  disabled={false}
                  onChange={(item) =>{
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('Brand', obj);
                  }}
                  placeholder="Select Removed Brearing Brand"
                  label="Removed Brearing Brand"
                  modalTitle="Select Removed Brearing Brand"
                  items={masterData.brands}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors.Brand && touched.Brand && (
                  <Text style={Styles.validateError}>
                    {errors.Brand}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={masterData.bearingTypes?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('Part Type List', obj);
                  }}
                  placeholder="Select Removed Brearing Type"
                  label="Removed Brearing Type"
                  modalTitle="Select Removed Brearing Type"
                  items={masterData.bearingTypes}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors['Part Type List'] && touched['Part Type List'] && (
                  <Text style={Styles.validateError}>
                    {errors['Part Type List']}
                  </Text>
                )}
              </View>
             
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Generator Model"
                  placeholder="Enter Generator Model"
                  handleChangeText={handleChange("Generator Model")}
                  value={values["Generator Model"]}
                />
                {errors["Generator Model"] && touched["Generator Model"] && (
                  <Text style={Styles.validateError}>
                    {errors["Generator Model"]}
                  </Text>
                )}
              </View>

              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={masterData.brands?.Name}
                  disabled={false}
                  onChange={(item) =>{
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('Brand', obj);
                  }}
                  placeholder="Select Bearing Brand"
                  label="New Bearing Brand"
                  modalTitle="Select Bearing Brand"
                  items={masterData.brands}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors.Brand && touched.Brand && (
                  <Text style={Styles.validateError}>
                    {errors.Brand}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={masterData.bearingTypes?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = {Id: item.Id, Name: item.Name};
                    setFieldValue('Part Type List', obj);
                  }}
                  placeholder="Select Bearing Type"
                  label="New Bearing Type"
                  modalTitle="Select Bearing Type"
                  items={masterData.bearingTypes}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors['Part Type List'] && touched['Part Type List'] && (
                  <Text style={Styles.validateError}>
                    {errors['Part Type List']}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Report Code"
                  placeholder="Enter Report Code"
                  handleChangeText={handleChange("Comments")}
                  value={values['Report Code']}
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
