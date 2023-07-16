import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Platform,
  Switch
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
// import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera, CameraType, PermissionStatus } from 'expo-camera';
import BarcodeMask from 'react-native-barcode-mask';
import DateTimePicker from "@react-native-community/datetimepicker";
import { FieldInitialLoader } from "../../shared/InitialLoaders";
import { Formik } from "formik";
import * as Yup from "yup";
import Loader from '../../shared/Loader';
import AuthService from "../../services/AuthService";
import { KEYMapper as JOBKEYMapper } from './../../services/UserConfig';
import { Toast } from 'toastify-react-native';
import { SET_JOB_TITLE, SHOW_BARCODE_BUTTON } from '../../redux/ReduxConsants';
import { BarCodeScanner } from 'expo-barcode-scanner';
import displayToast from "../../services/ToastService";

const AddJob = ({ navigation, route }) => {
  const { Id } = route.params;
  console.log("Edit Id--->", Id)
  const [scan, setScan] = useState(false);
  const [scanType, setScanType] = useState('');
  const [result, setResult] = useState("");
  const [deResult, setDEResult] = useState('');
  const [ndeResult, setNDEResult] = useState('');
  const [removedResult, setRemovedResult] = useState('');

  const dispatch = useDispatch();
  const masterData = useSelector((state) => state.masterReducer);
  const userData = useSelector((state) => state.userReducer.user);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [failureDate, setFailureDate] = useState();
  const [show, setShow] = useState(false);
  const [showFailureDate, setFailureDateShow] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [matrixNumber, setMatrixNumber] = useState(false);
  const showBarCodeScanButton = useSelector((state) => state.jobsReducer.showBarCodeScanButton);
  
  const [showDEDataMatrix, setShowDEDataMatrix] = useState(true);
  const [showNDEDataMatrix, setShowNDEDataMatrix] = useState(true);
  const [showDataMatrix, setShowDataMatrix] = useState(true);
  const [showRemovedDataMatrix, setShowRemovedDataMatrix] = useState(true);
  const [tempFormdata, setTempFormdata] = useState();
  const [barcodeReaderFailed, setBarCodeReaderFailed] = useState(false);
  const selectedJobId = useSelector((state) => state.jobsReducer.selectedJobId);
  const jobs = useSelector((state) => state.jobsReducer.jobs);
  const loading = useSelector((state) => state.jobsReducer.pageLoader);
  let customerId = AuthService.isOperator() ? userData?.CustomerId : userData?.UserId;
  let operatorId = AuthService.isOperator() ? userData?.UserId : null;
  const [jobTitle, setJobTitle] = useState('');
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const {
    TITLE,
    CUSTOMER,
    DATAMATRIX,
    JOBDATE,
    JOBID,
    CUSTOMERWINDFARM,
    WINDTURBINE,
    GENERATORMODEL,
    REASONS,
    EXCHANGETYPE,
    POSITION,
    REMOVEDBEARINGBRAND,
    REMOVEDBEARINGTYPE,
    NEWBEARINGBRAND,
    NEWBEARINGTYPE,
    COMMENTS,
    OPERATORID,
    CUSTOMERID,
    REPORTCODE,
    OPERATORNAME,
    STATE,
    FAILUREDATE,
    WINDLOCATION,
    NDEDATAMATRIX,
    DEDATAMATRIX,
    REMOVEDDATAMATRIX,
    DEBATCHNUMBER,
    NDEBATCHNUMBER,
    SENSORBATCHNUMBER,
    REMOVEDBATCHNUMBER
  } = JOBKEYMapper;

  const initialFormValues = {
    [DATAMATRIX]: '',
    [JOBDATE]: startDate,
    [CUSTOMERWINDFARM]: '',
    [STATE]: '',
    [WINDLOCATION]: '',
    [FAILUREDATE]: '',
    [WINDTURBINE]: '',
    [GENERATORMODEL]: '',
    [COMMENTS]: '',
    [REASONS]: '',
    [EXCHANGETYPE]: '',
    [POSITION]: '',
    [NEWBEARINGBRAND]: '',
    [NEWBEARINGTYPE]: '',
    [REMOVEDBEARINGBRAND]: '',
    [REMOVEDBEARINGTYPE]: '',
    [NDEDATAMATRIX]: '',
    [DEDATAMATRIX]: '',
    [REMOVEDBATCHNUMBER]: '',
    [REMOVEDDATAMATRIX]: '',
    [DEBATCHNUMBER]: '',
    [NDEBATCHNUMBER]: '',
    [SENSORBATCHNUMBER]: ''
  };

  const [formData, setFormData] = useState(initialFormValues);

  function updateFormData(data) {
    console.log('---------------------------->', data);
    setTempFormdata(data);
  }

  useEffect(() => {
    let j = '';
    if (Id && selectedJobId && jobs && jobs.length > 0) {
      const filterJob = jobs.filter(j => j.Id === selectedJobId)[0];
    //  console.log('fetched job details', customerId, operatorId, selectedJobId, filterJob);
      let formValues = { 
        [DATAMATRIX]: filterJob[DATAMATRIX] ? filterJob[DATAMATRIX] : '',
    [JOBDATE]: filterJob[JOBDATE] ? filterJob[JOBDATE] : '',
      [CUSTOMERWINDFARM]: filterJob[CUSTOMERWINDFARM] && filterJob[CUSTOMERWINDFARM][0] ? filterJob[CUSTOMERWINDFARM] : '',
    [STATE]: filterJob[STATE] && filterJob[STATE][0] ? filterJob[STATE] : '',
    [WINDLOCATION]: filterJob[WINDLOCATION] && filterJob[WINDLOCATION][0] ? filterJob[WINDLOCATION] : '',
    [FAILUREDATE]: filterJob[FAILUREDATE] ? filterJob[FAILUREDATE] : '',
    [WINDTURBINE]: filterJob[WINDTURBINE] ? filterJob[WINDTURBINE] : '',
    [GENERATORMODEL]: filterJob[GENERATORMODEL] && filterJob[GENERATORMODEL][0] ? filterJob[GENERATORMODEL] : '',
    [COMMENTS]: filterJob[COMMENTS] ? filterJob[COMMENTS] : '',
    [REASONS]: filterJob[REASONS] && filterJob[REASONS][0] ? filterJob[REASONS] : '',
    [EXCHANGETYPE]: filterJob[EXCHANGETYPE] && filterJob[EXCHANGETYPE][0] ? filterJob[EXCHANGETYPE] : '',
    [POSITION]: filterJob[POSITION] && filterJob[POSITION][0] ? filterJob[POSITION] : '',
    [NEWBEARINGBRAND]: filterJob[NEWBEARINGBRAND] && filterJob[NEWBEARINGBRAND][0] ? filterJob[NEWBEARINGBRAND] : '',
    [NEWBEARINGTYPE]: filterJob[NEWBEARINGTYPE] && filterJob[NEWBEARINGTYPE][0] ? filterJob[NEWBEARINGTYPE] : '',
    [REMOVEDBEARINGBRAND]: filterJob[REMOVEDBEARINGBRAND] && filterJob[REMOVEDBEARINGBRAND][0] ? filterJob[REMOVEDBEARINGBRAND] : '',
    [REMOVEDBEARINGTYPE]: filterJob[REMOVEDBEARINGTYPE] && filterJob[REMOVEDBEARINGTYPE][0] ? filterJob[REMOVEDBEARINGTYPE] : '',
    [NDEDATAMATRIX]: filterJob[NDEDATAMATRIX] ? filterJob[NDEDATAMATRIX] : '',
    [DEDATAMATRIX]: filterJob[DEDATAMATRIX] ? filterJob[DEDATAMATRIX] : '',
    [REMOVEDBATCHNUMBER]: filterJob[REMOVEDBATCHNUMBER] ? filterJob[REMOVEDBATCHNUMBER] : '',
    [REMOVEDDATAMATRIX]: filterJob[REMOVEDDATAMATRIX] ? filterJob[REMOVEDDATAMATRIX] : '',
    [DEBATCHNUMBER]: filterJob[DEBATCHNUMBER] ? filterJob[DEBATCHNUMBER] : '',
    [NDEBATCHNUMBER]: filterJob[NDEBATCHNUMBER] ? filterJob[NDEBATCHNUMBER] : '',
    [SENSORBATCHNUMBER]: filterJob[SENSORBATCHNUMBER] ? filterJob[SENSORBATCHNUMBER] : ''
       };
       
      console.log('setting form data job details', formValues, filterJob);
      setFormData(formValues);
   
      if(filterJob[DEDATAMATRIX]){
        setDEResult(filterJob[DEDATAMATRIX]);
      } else {
        setShowDEDataMatrix(false);
      }
      if(filterJob[NDEDATAMATRIX]){
        setNDEResult(filterJob[NDEDATAMATRIX]);
      } else {
        setShowNDEDataMatrix(false);
      }
      if(filterJob[SENSORBATCHNUMBER]){
        setShowDataMatrix(false);
      } else {
        setResult(filterJob[DATAMATRIX]);
      }
      if(filterJob[REMOVEDBATCHNUMBER]){
        setShowRemovedDataMatrix(false);
      } else {
        setRemovedResult(filterJob[REMOVEDDATAMATRIX]);
      }
      
      setStartDate(new Date(filterJob[JOBDATE]));
      let failedDate = filterJob[FAILUREDATE] ? new Date(filterJob[FAILUREDATE]) : '';
      setFailureDate(failedDate);
      dispatch({
        type: SHOW_BARCODE_BUTTON,
        payload: filterJob[DATAMATRIX] ? true : false,
      });
      j = `${filterJob[JOBID]}`;
    } else {
      let date = new Date();
      let dateFormate = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
      console.log(userData);
      j = `${userData.ShortCode}-${dateFormate}-JB`;
      dispatch({
        type: SHOW_BARCODE_BUTTON,
        payload: true
      });
    }
    setJobTitle(j);
    dispatch(
      {
        type: SET_JOB_TITLE,
        payload: j
      }
    )
  }, []);


  const addJobSchema = Yup.object().shape({
    [DATAMATRIX]: Yup.string(),
    [DEDATAMATRIX]: showDEDataMatrix ? Yup.string().required('Required New DE DataMatrix') : Yup.string(), 
    [NDEDATAMATRIX]: showNDEDataMatrix ? Yup.string().required('Required New NDE DataMatrix') : Yup.string(),
    [REMOVEDDATAMATRIX]: Yup.string(),

    [DEBATCHNUMBER]: showDEDataMatrix ? Yup.string() : Yup.string().required('Required New DE Batch'),
    [NDEBATCHNUMBER]: showNDEDataMatrix ? Yup.string() : Yup.string().required('Required New NDE Batch'),
    [SENSORBATCHNUMBER]: Yup.string(),
    [REMOVEDBATCHNUMBER]: Yup.string(),
    
    [CUSTOMERWINDFARM]: Yup.array(Yup.object()),
    [JOBDATE]: Yup.string().required('Required Job jDate'),
    [FAILUREDATE]: Yup.string().required('Required Job Replacement Date'),
    [STATE]: Yup.array(Yup.object()),
    [WINDLOCATION]: Yup.array(Yup.object()),
    [WINDTURBINE]: Yup.string(),
    [GENERATORMODEL]: Yup.array(Yup.object()),
    [REASONS]: Yup.array(Yup.object()).required('Required Reason of Change'),
    [NEWBEARINGBRAND]: Yup.array(Yup.object()),
    [NEWBEARINGTYPE]: Yup.array(Yup.object()),
    [REMOVEDBEARINGBRAND]: Yup.array(Yup.object()),
    [REMOVEDBEARINGTYPE]: Yup.array(Yup.object()),
    [POSITION]: Yup.array(Yup.object()),
    [EXCHANGETYPE]: Yup.array(Yup.object()).required('Required Exchange Type'),
    [COMMENTS]: Yup.string(Yup.string()),
  });

  // const getBarCodeScannerPermissions = async () => {
  //   const status = await Camera.useCameraPermissions();
  //   console.log(status);
  //   setHasPermission(status === "granted");
  // };

  const showScanner = (type) => {
 //   await getBarCodeScannerPermissions();
 console.log('check camera permission before open',permission);
    if (!permission.granted) {
    // Camera permissions are not granted yet
   return requestPermission();
    // return (
    //   <View style={GBStyles.container}>
    //     <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
    //     <Button onPress={requestPermission} text="grant permission" />
    //   </View>
    // );
  }  
    setScanLoading(true);
    setScanType(type);
    setScan(true);
    setScanLoading(false);
  };

  const onChange = (event, selectedDate) => {
    setShow(false);
    setStartDate(selectedDate);
  };

  const onFailureDateChange = (event, selectedDate) => {
    setFailureDateShow(false);
    setFailureDate(selectedDate);
  };


  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    onSuccess(type, data);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  // if (scanLoading && hasPermission === null) {
  //   return <Loader loading={'true'} />;
  // }
  if (scan && hasPermission === false) {
   return  <View style={GBStyles.container}>
  <Text style={{ textAlign: 'center', margin: 50 }}>No access to camera</Text>
  <Button onPress={requestPermission} text="Request permission" />
  </View>;
  }
  
  // if (!permission) {
  //   // Camera permissions are still loading
  //   return <Loader loading={'true'} />;
  // }

  // if (!permission.granted) {
  //   // Camera permissions are not granted yet
  //   return (
  //     <View style={GBStyles.container}>
  //       <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
  //       <Button onPress={requestPermission} text="grant permission" />
  //     </View>
  //   );
  // }

  const onSuccess = (type, data) => {
    if (type && data != null) {
      let f;
      switch(scanType) {
        case "DATAMATRIX":
        setResult(data);
        console.log(tempFormdata);
        f = { ...tempFormdata, [DATAMATRIX]: data};
       setFormData(f);
        break;
        case "DE":
          console.log(tempFormdata);
        setDEResult(data);
        f = { ...tempFormdata, [DEDATAMATRIX]: data};
       setFormData(f);
        break;
        case "NDE":
          console.log(tempFormdata);
          f = { ...tempFormdata, [NDEDATAMATRIX]: data};
          setNDEResult(data);
         setFormData(f);
        break;
        case 'REMOVEDBEARING':
          f = { ...tempFormdata, [REMOVEDDATAMATRIX]: data};
          setRemovedResult(data);
          console.log(tempFormdata);
         setFormData(f);
        break;
      }
      setScan(false);
      setScanned(false);
    } else {
      setScan(true);
      setScanned(false);
    }
  };

  const startScan = () => {
    setScan(true);
  };

  const callBack = () => {
    navigation.navigate('Jobs');
  }

  const handleSubmitPress = (values) => {
    console.log('submit clicked',showBarCodeScanButton, values);

    let originalData = {
      ...values,
      [NDEDATAMATRIX]: showNDEDataMatrix ? ndeResult: '',
      [DEDATAMATRIX]: showDEDataMatrix ? deResult : '',
      [DATAMATRIX]: showDataMatrix ? result : '',
      [REMOVEDDATAMATRIX]: showRemovedDataMatrix ? removedResult: '',

      [DEBATCHNUMBER]: showDEDataMatrix ? '' : values[DEBATCHNUMBER],
      [NDEBATCHNUMBER]: showNDEDataMatrix ? '' : values[NDEBATCHNUMBER],
      [SENSORBATCHNUMBER]: showDataMatrix ? '' : values[SENSORBATCHNUMBER],
      [REMOVEDBATCHNUMBER]: showRemovedDataMatrix ? '' : values[REMOVEDBATCHNUMBER],

      [JOBDATE]: startDate ? startDate.toISOString().split("T")[0] : '',
      [FAILUREDATE]: failureDate ? failureDate.toISOString().split("T")[0] : '',
      [JOBID]: jobTitle,
      [CUSTOMERID]: AuthService.isOperator() ? userData?.CustomerId : userData?.UserId,
      [CUSTOMER]: AuthService.isOperator() ? userData?.CustomerId : userData?.UserId,
      [OPERATORID]: AuthService.isOperator() ? userData?.UserId : null,
      [OPERATORNAME]: userData?.Name
    };
    let updateValues = {
      [CUSTOMERWINDFARM]: values[CUSTOMERWINDFARM] && values[CUSTOMERWINDFARM][0] ? values[CUSTOMERWINDFARM][0].Id : null,
      [WINDLOCATION]: values[WINDLOCATION]?.length > 0 ? values[WINDLOCATION][0].Id : null,
      [STATE]: values[STATE][0] ? values[STATE][0].Id : null,
      [GENERATORMODEL]: values[GENERATORMODEL] && values[GENERATORMODEL][0] ? values[GENERATORMODEL][0].Id : null,
      [EXCHANGETYPE]: values[EXCHANGETYPE] && values[EXCHANGETYPE][0] ? values[EXCHANGETYPE][0].Id : null,
      [REASONS]: values[REASONS] && values[REASONS][0] ? values[REASONS][0].Id : null,
      [POSITION]: values[POSITION] && values[POSITION][0] ? values[POSITION][0].Id : null,
      [NEWBEARINGBRAND]: values[NEWBEARINGBRAND] && values[NEWBEARINGBRAND][0] ? values[NEWBEARINGBRAND][0].Id : null,
      [NEWBEARINGTYPE]: values[NEWBEARINGTYPE] && values[NEWBEARINGTYPE][0] ? values[NEWBEARINGTYPE][0].Id : null,
      [REMOVEDBEARINGBRAND]: values[REMOVEDBEARINGBRAND] && values[REMOVEDBEARINGBRAND][0] ? values[REMOVEDBEARINGBRAND][0].Id : null,
      [REMOVEDBEARINGTYPE]: values[REMOVEDBEARINGTYPE] && values[REMOVEDBEARINGTYPE][0] ? values[REMOVEDBEARINGTYPE][0].Id : null,
    };

    let data = {
      ...originalData,
      ...updateValues
    };

    console.log('submitting data job ------------->', originalData, data);
    // return;
    if (Id) {
      dispatch(updateJob(data, originalData, Id, callBack));
    } else {
      dispatch(saveJob(data, originalData, callBack));
    }

  };

  return (
    <ScrollView style={{ backgroundColor: theme.bgWhite }}>
      <Loader loading={loading} />

      {scan ? (
        <>
          <Camera
            style={[
              {
                flex: 1,
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height - 85,
              },
            ]}
            flashMode={torch ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            useCamera2Api={true}
            //PermissionStatus={permission.granted ? Camera.Constants.PermissionStatus.GRANTED : Camera.Constants.PermissionStatus.DENIED}
          >

            <BarcodeMask width={280} height={280} edgeBorderWidth={1} outerMaskOpacity={0.8} />
            
          </Camera>
          <View
              style={
                [StyleSheet.absoluteFill,
                {
                  bottom: 0,
                  top: '73%',
                  zIndex: 100
                }
                ]
              }>
              <Ripple
                onPress={() => { setTorch(!torch) }}
                style={[Styles.torchBtn, { backgroundColor: torch ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.2)' }]}
              >
                <Icon
                  name="TorchOn"
                  size={24}
                  color={torch ? theme.textBlue : theme.textWhite}
                  style={{ alignSelf: "center" }}
                />
              </Ripple>
              <Button
                text="Close"
                style={{ margin: 24 }}
                type={'secondary'}
                onPress={() => {
                  setScan(false), setScanned(false);
                }}
              />
            </View>
          {scanned && (
            <Button
              text="Tap to Scan Again"
              onPress={() => setScanned(false)}
            />
          )}
        </>
      ) : (
        <Formik
          initialValues={formData}
          onSubmit={(values) => {
            handleSubmitPress(values);
          }}
          validationSchema={addJobSchema}
          enableReinitialize
          onChange
        >
          {({ handleChange, errors, values, handleSubmit, touched, setFieldValue }) => {
             updateFormData(values);
            return(
              <View style={GBStyles.container}>
              
              <View style={{ marginBottom: 20, paddingTop: 20 }}>
                 <Row style={Styles.SwitchContainer}>
                  <Switch
                      trackColor={{false: theme.bgWhite, true: theme.bgBlue}}
                      thumbColor={showDEDataMatrix ? theme.bgWhite : theme.bgLight}
                      ios_backgroundColor={showDEDataMatrix ? theme.bgWhite : theme.bgLight}
                      onValueChange={() => setShowDEDataMatrix(!showDEDataMatrix)}
                      value={showDEDataMatrix}
                  />
                  </Row>

                  {showDEDataMatrix ?  <>
                    <Input
                    labelName="New DE DataMatrix"
                    placeholder="Scan DE DataMatrix"
                    value={deResult}
                    appendIconName="DataMatrix"
                    appendIconColor={theme.textBlue}
                    appendIconSize={24}
                    handlePress={() => showScanner('DE')}
                    mand={true}
                  />
                    {errors[DEDATAMATRIX] && touched[DEDATAMATRIX] && (
                      <Text style={Styles.validateError}>
                        {errors[DEDATAMATRIX]}
                      </Text>
                    )}
                    </>  : <>
                      <Input
                      labelName="New DE Batch"
                      placeholder="Enter DE Batch"
                      handleChangeText={handleChange(DEBATCHNUMBER)}
                      value={values[DEBATCHNUMBER]}
                      mand={true}
                    />
                    {errors[DEBATCHNUMBER] && touched[DEBATCHNUMBER] && (
                      <Text style={Styles.validateError}>
                        {errors[DEBATCHNUMBER]}
                      </Text>
                    )}
                  </>
                } 
                </View>

                <View style={{ marginBottom: 20, paddingTop: 20 }}>
                 <Row style={Styles.SwitchContainer}>
                  <Switch
                      trackColor={{false: theme.bgWhite, true: theme.bgBlue}}
                      thumbColor={showNDEDataMatrix ? theme.bgWhite : theme.bgLight}
                      ios_backgroundColor={showNDEDataMatrix ? theme.bgWhite : theme.bgLight}
                      onValueChange={() => setShowNDEDataMatrix(!showNDEDataMatrix)}
                      value={showNDEDataMatrix}
                  />
                  </Row>

                  {showNDEDataMatrix ? <>
                    <Input
                    labelName="New NDE DataMatrix"
                    placeholder="Scan NDE DataMatrix"
                    value={ndeResult}
                    appendIconName="DataMatrix"
                    appendIconColor={theme.textBlue}
                    appendIconSize={24}
                    handlePress={() => showScanner('NDE')}  
                    mand={true}
                  />
                    {errors[NDEDATAMATRIX] && touched[NDEDATAMATRIX] && (
                      <Text style={Styles.validateError}>
                        {errors[NDEDATAMATRIX]}
                      </Text>
                    )}
                    </> : <>
                      <Input
                      labelName="New NDE Batch"
                      placeholder=" Enter NDE Batch"
                      handleChangeText={handleChange(NDEBATCHNUMBER)}
                      value={values[NDEBATCHNUMBER]}
                      mand={true}
                    />
                    {errors[NDEBATCHNUMBER] && touched[NDEBATCHNUMBER] && (
                      <Text style={Styles.validateError}>
                        {errors[NDEBATCHNUMBER]}
                      </Text>
                    )}
                  </>
                } 
                </View>

                <View style={{ marginBottom: 20, paddingTop: 20 }}>
                 <Row style={Styles.SwitchContainer}>
                  <Switch
                      trackColor={{false: theme.bgWhite, true: theme.bgBlue}}
                      thumbColor={showDataMatrix ? theme.bgWhite : theme.bgLight}
                      ios_backgroundColor={showDataMatrix ? theme.bgWhite : theme.bgLight}
                      onValueChange={() => setShowDataMatrix(!showDataMatrix)}
                      value={showDataMatrix}
                  />
                  </Row>

                  {showDataMatrix ? <Input
                    labelName="Sensor DataMatrix"
                    placeholder="Scan Sensor DataMatrix"
                    value={result}
                    appendIconName="DataMatrix"
                    appendIconColor={theme.textBlue}
                    appendIconSize={24}
                    handlePress={() => showScanner('DATAMATRIX')}
                  /> : <>
                      <Input
                      labelName="Sensor Batch"
                      placeholder="Enter Sensor Batch"
                      handleChangeText={handleChange(SENSORBATCHNUMBER)}
                      value={values[SENSORBATCHNUMBER]}
                    />
                  </>
                } 
                </View>

              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Replacement Date"
                  placeholder="DD/MM/YYYY"
                  appendIconName="Calendar"
                  appendIconColor={theme.textBlue}
                  appendIconSize={16}
                  value={failureDate ? failureDate.toLocaleDateString() : null}
                  handlePress={() => setFailureDateShow(true)}
                  mand={true}
                />
                {errors[FAILUREDATE] && touched[FAILUREDATE] && (
                  <Text style={Styles.validateError}>
                    {errors[FAILUREDATE]}
                  </Text>
                )}
                {showFailureDate && (
                  <DateTimePicker
                    value={failureDate ? failureDate : new Date()}
                    mode="date"
                    onChange={(event, selectedDate) => {
                      setFieldValue(FAILUREDATE, selectedDate);
                      onFailureDateChange(event, selectedDate);
                    }}
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                  />
                )}
              </View>
              
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Job Start Date"
                  placeholder="DD/MM/YYYY"
                  appendIconName="Calendar"
                  appendIconColor={theme.textBlue}
                  appendIconSize={16}
                  value={startDate.toLocaleDateString()}
                  handlePress={() => setShow(true)}
                  mand={true}
                />
                {errors[JOBDATE] && touched[JOBDATE] && (
                  <Text style={Styles.validateError}>
                    {errors[JOBDATE]}
                  </Text>
                )}
                {show && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    onChange={(event, selectedDate) => {
                      onChange(event, selectedDate);
                      setFieldValue(JOBDATE, selectedDate);
                    }}
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                  />
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[EXCHANGETYPE][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(EXCHANGETYPE, [obj]);
                  }}
                  placeholder="Select Exchange Type"
                  label={'Exchange Type *'}
                  modalTitle="Select Exchange Type"
                  items={masterData.exhangeTypes}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors[EXCHANGETYPE] && touched[EXCHANGETYPE] && (
                  <Text style={Styles.validateError}>
                    {errors[EXCHANGETYPE]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[REASONS][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(REASONS, [obj]);
                  }}
                  placeholder="Select Reason"
                  label="Reason of Change *"
                  modalTitle="Select Reason"
                  items={masterData.reasonOfChanges}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors[REASONS] && touched[REASONS] && (
                  <Text style={Styles.validateError}>
                    {errors[REASONS]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[CUSTOMERWINDFARM][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(CUSTOMERWINDFARM, [obj]);
                  }}
                  placeholder="Select Wind Farm"
                  label="Wind Farm"
                  modalTitle="Select Wind Farm"
                  items={masterData.windFarms}
                  modalObj={{ id: "Id", name: "Name" }}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[WINDLOCATION][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(WINDLOCATION, [obj]);
                  }}
                  placeholder="Select Wind Farm Location"
                  label="Wind Farm Location"
                  modalTitle="Select Wind Farm Location"
                  items={masterData.windLocations}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors[WINDLOCATION] && touched[WINDLOCATION] && (
                  <Text style={Styles.validateError}>
                    {errors[WINDLOCATION]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Wind Turbine"
                  placeholder="Enter Wind Turbine"
                  handleChangeText={handleChange(WINDTURBINE)}
                  value={values[WINDTURBINE]}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[STATE][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(STATE, [obj]);
                  }}
                  placeholder="Select State"
                  label="State"
                  modalTitle="Select State"
                  items={masterData.states}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors[STATE] && touched[STATE] && (
                  <Text style={Styles.validateError}>
                    {errors[STATE]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[GENERATORMODEL][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(GENERATORMODEL, [obj]);
                  }}
                  placeholder="Select Generator Model"
                  label="Generator Model"
                  modalTitle="Select Generator Model"
                  items={masterData.generatorModels}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors[GENERATORMODEL] && touched[GENERATORMODEL] && (
                  <Text style={Styles.validateError}>
                    {errors[GENERATORMODEL]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[POSITION][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(POSITION, [obj]);
                  }}
                  placeholder="Select Bearing Model"
                  label="Bearing Model"
                  modalTitle="Select Bearing Model"
                  items={masterData.shaftPositions}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors[POSITION] && touched[POSITION] && (
                  <Text style={Styles.validateError}>
                    {errors[POSITION]}
                  </Text>
                )}
              </View>

              <View style={{ marginBottom: 20, paddingTop: 20 }}>
                 <Row style={Styles.SwitchContainer}>
                  <Switch
                      trackColor={{false: theme.bgWhite, true: theme.bgBlue}}
                      thumbColor={showRemovedDataMatrix ? theme.bgWhite : theme.bgLight}
                      ios_backgroundColor={showRemovedDataMatrix ? theme.bgWhite : theme.bgLight}
                      onValueChange={() => setShowRemovedDataMatrix(!showRemovedDataMatrix)}
                      value={showRemovedDataMatrix}
                  />
                  </Row>

                  {showRemovedDataMatrix ? <Input
                    labelName="Removed DE DataMatrix"
                    placeholder="Scan Removed DE DataMatrix"
                    value={removedResult}
                    appendIconName="DataMatrix"
                    appendIconColor={theme.textBlue}
                    appendIconSize={24}
                    handlePress={() => showScanner('REMOVEDBEARING')}  
                  /> : <>
                      <Input
                      labelName="Removed Batch"
                      placeholder="Enter Removed Batch"
                      handleChangeText={handleChange(REMOVEDBATCHNUMBER)}
                      value={values[REMOVEDBATCHNUMBER]}
                    />
                  </>
                } 
                </View>

              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[REMOVEDBEARINGBRAND][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(REMOVEDBEARINGBRAND, [obj]);
                  }}
                  placeholder="Select Removed Brearings Brand"
                  label="Removed Brearings Brand"
                  modalTitle="Select Removed Brearings Brand"
                  items={masterData.brands}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors[REMOVEDBEARINGBRAND] && touched[REMOVEDBEARINGBRAND] && (
                  <Text style={Styles.validateError}>
                    {errors[REMOVEDBEARINGBRAND]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[REMOVEDBEARINGTYPE][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(REMOVEDBEARINGTYPE, [obj]);
                  }}
                  placeholder="Select Removed Brearings Type"
                  label="Removed Brearings Type"
                  modalTitle="Select Removed Brearings Type"
                  items={masterData.bearingTypes}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors[REMOVEDBEARINGTYPE] && touched[REMOVEDBEARINGTYPE] && (
                  <Text style={Styles.validateError}>
                    {errors[REMOVEDBEARINGTYPE]}
                  </Text>
                )}
              </View>


              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[NEWBEARINGBRAND][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(NEWBEARINGBRAND, [obj]);
                  }}
                  placeholder="Select Bearing Brand"
                  label="New Bearing Brand"
                  modalTitle="Select Bearing Brand"
                  items={masterData.brands}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors[NEWBEARINGBRAND] && touched[NEWBEARINGBRAND] && (
                  <Text style={Styles.validateError}>
                    {errors[NEWBEARINGBRAND]}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Select
                  selectedValue={values[NEWBEARINGTYPE][0]?.Name}
                  disabled={false}
                  onChange={(item) => {
                    let obj = { Id: item.Id, Name: item.Name };
                    setFieldValue(NEWBEARINGTYPE, [obj]);
                  }}
                  placeholder="Select Bearing Type"
                  label="New Bearing Type"
                  modalTitle="Select Bearing Type"
                  items={masterData.bearingTypes}
                  modalObj={{ id: "Id", name: "Name" }}
                />
                {errors[NEWBEARINGTYPE] && touched[NEWBEARINGTYPE] && (
                  <Text style={Styles.validateError}>
                    {errors[NEWBEARINGTYPE]}
                  </Text>
                )}
              </View>
              
              <View style={{ marginBottom: 20 }}>
                <Input
                  labelName="Comments"
                  placeholder="Enter Comments"
                  multiline={true}
                  handleChangeText={handleChange(COMMENTS)}
                  value={values[COMMENTS]}
                />
              </View>
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
            )

            
          }}
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
  torchBtn: {
    width: 64, height: 64, borderRadius: 16, padding: 12,
    alignSelf: 'center', marginTop: 0, justifyContent: 'center'
  },
  SwitchContainer: {
    position: 'absolute',
    right: 0
  }
});

export default AddJob;
