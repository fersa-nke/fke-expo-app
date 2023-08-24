import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import theme from "../../assets/theme";
import GBStyles from "../../assets/globalstyles";
import Ripple from "react-native-material-ripple";
import Document from "../../shared/Document";
import Input from "../../shared/Input";
import Row from "../../shared/Row";
import Button from "../../shared/Button";
import { useSelector, useDispatch } from "react-redux";
import { saveJobReport, updateJobReport, showLoadData } from "../../redux/Reports/ReportsAction";
import DateTimePicker from "@react-native-community/datetimepicker";
import Select from "../../shared/Select";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { KEYMapper as ReportKEYMapper } from './../../services/UserConfig';
import { Formik } from "formik";
import * as Yup from "yup";
import Loader from '../../shared/Loader';

const AddReport = ({navigation, route }) => {
  const Id = route.params?.Id;
  const reports = useSelector((state) => state.reportsReducer.reports);
  const selectedJobId = useSelector((state) => state.jobsReducer.selectedJobId);
  const selectedJobTitle = useSelector((state) => state.jobsReducer.jobTitle);
  const selectedReportId = useSelector((state) => state.reportsReducer.selectedReportId);
 // const navigation = useNavigation();
  const loading = useSelector((state) => state.masterReducer.pageLoader);
  const [reportName, setReportName] = useState('');
  const [reportDate, setReportDate] = useState(new Date());
  const [lastLubricationDate, setLastLubricationDate] = useState();
  const [showReporDate, setReportDateShow] = useState(false);
  const [showLastLubricationDate, setLastLubricationDateShow] = useState(false);
  const dispatch = useDispatch();
  const masterData = useSelector((state) => state.masterReducer);
  const nokBearings = [{Name: 'DE', Id: 'DE'}, {Name: 'NDE', Id: 'NDE'}, {Name: 'BOTH', Id: 'BOTH'}, {Name: 'NONE', Id: 'NONE'}];

  const {
    JOBID,
    NAME,
    COMMENTS,
    SERIALNUMBER,
    NOKBEARING,
    SHAFTNDEMAX,
    SHAFTNDEMIN,
    BEARINGNDEMAX,
    BEARINGNDEMIN,
    SHAFTDEMAX,
    SHAFTDEMIN,
    BEARINGDEMAX,
    BEARINGDEMIN,
    LASTLUBRICATION,
    INSULATERESISTANCE,
    VOLTAGETESTED,
    REPORTDATE,
    REPORTID,
    LUBRICATIONTYPE,
    LUBRICATIONGRADE
  } = ReportKEYMapper;

  const initialFormValues = {
    [NAME]: '',
    [SERIALNUMBER]: '',
    [NOKBEARING]: '',
    [SHAFTNDEMAX]: '',
    [SHAFTNDEMIN]: '',
    [BEARINGNDEMAX]: '',
    [BEARINGNDEMIN]: '',
    [SHAFTDEMAX]: '',
    [SHAFTDEMIN]: '',
    [BEARINGDEMAX]: '',
    [BEARINGDEMIN]: '',
    [LUBRICATIONTYPE]: '',
    [LUBRICATIONGRADE]: '',
    [INSULATERESISTANCE]: '',
    [VOLTAGETESTED]: '',
    [COMMENTS]: ''
  };

  const [formData, setFormData] = useState(initialFormValues);

  const addReportSchema = Yup.object().shape({
    [NAME]: Yup.string(),
    [SERIALNUMBER]: Yup.string(),
    [NOKBEARING]: Yup.array(Yup.object()),
    [SHAFTNDEMAX]: Yup.string(),
    [SHAFTNDEMIN]: Yup.string(),
    [BEARINGNDEMAX]: Yup.string(),
    [BEARINGNDEMIN]: Yup.string(),
    [SHAFTDEMAX]: Yup.string(),
    [SHAFTDEMIN]: Yup.string(),
    [BEARINGDEMAX]: Yup.string(),
    [BEARINGDEMIN]: Yup.string(),
    [LUBRICATIONTYPE]: Yup.array(Yup.object()),
    [LUBRICATIONGRADE]: Yup.array(Yup.object()),
    [INSULATERESISTANCE]: Yup.string(),
    [VOLTAGETESTED]: Yup.string(),
    [COMMENTS]: Yup.string()
  });

  useEffect(() => {
    let j = '';
    if (Id && selectedReportId && reports && reports.length > 0) {
      const filterReport = reports.filter(r => r.Id === selectedReportId)[0];
      let lubricationDate = filterReport[LASTLUBRICATION] ? new Date(filterReport[LASTLUBRICATION]) : '';
      filterReport[NOKBEARING] = filterReport[NOKBEARING] ? [{Id: filterReport[NOKBEARING], Name: filterReport[NOKBEARING]}] : '';
      console.log('fetched report details', selectedReportId, filterReport, SHAFTDEMAX);
     
      let formValues = {
        ...filterReport,
      [NOKBEARING]: filterReport[NOKBEARING][0] ? filterReport[NOKBEARING] : '',
      [NAME]: filterReport[NAME] ?  filterReport[NAME] : '',
      [SERIALNUMBER]: filterReport[SERIALNUMBER] ?  filterReport[SERIALNUMBER] : '',
      [SHAFTNDEMAX]: filterReport[SHAFTNDEMAX] ?  filterReport[SHAFTNDEMAX] : '',
      [SHAFTNDEMIN]: filterReport[SHAFTNDEMIN] ?  filterReport[SHAFTNDEMIN] : '',
      [BEARINGNDEMAX]: filterReport[BEARINGNDEMAX] ?  filterReport[BEARINGNDEMAX] : '',
      [BEARINGNDEMIN]: filterReport[BEARINGNDEMIN] ?  filterReport[BEARINGNDEMIN] : '',
      [SHAFTDEMAX]: filterReport[SHAFTDEMAX] ?  filterReport[SHAFTDEMAX] : '',
      [SHAFTDEMIN]: filterReport[SHAFTDEMIN] ?  filterReport[SHAFTDEMIN] : '',
      [BEARINGDEMAX]: filterReport[BEARINGDEMAX] ?  filterReport[BEARINGDEMAX] : '',
      [BEARINGDEMIN]: filterReport[BEARINGDEMIN] ?  filterReport[BEARINGDEMIN] : '',
      [INSULATERESISTANCE]: filterReport[INSULATERESISTANCE] ?  filterReport[INSULATERESISTANCE] : '',
      [VOLTAGETESTED]: filterReport[VOLTAGETESTED] ?  filterReport[VOLTAGETESTED] : '',
      [COMMENTS]: filterReport[COMMENTS],
      [LASTLUBRICATION]: filterReport[LASTLUBRICATION] ? filterReport[LASTLUBRICATION] : '',
      [JOBID]: selectedJobId,
      [LUBRICATIONTYPE]: filterReport[LUBRICATIONTYPE][0] ? filterReport[LUBRICATIONTYPE] : '',
      [LUBRICATIONGRADE]: filterReport[LUBRICATIONGRADE][0] ? filterReport[LUBRICATIONGRADE] : ''
    };
      setFormData(formValues);
      setReportDate(new Date(filterReport[REPORTDATE]));
      setLastLubricationDate(lubricationDate);
      j = `${filterReport[REPORTID]}`;
    } else {
      let date = new Date();
      let dateFormate = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
      j = `${selectedJobTitle.split('-JB')[0]}/${reports.length + 1}`;
      let tempName = `RP/${reports.length + 1}`;
      let formValues = {
        ...initialFormValues,
        [NAME]: tempName
      };
      setFormData(formValues);
    }
    setReportName(j);
    dispatch(showLoadData(false));
  }, [])

  const onReportDateChange = (event, selectedDate) => {
    setReportDateShow(false);
    setReportDate(selectedDate);
  };

  const onlastLubricationDateChange = (event, selectedDate) => {
    setLastLubricationDateShow(false);
    setLastLubricationDate(selectedDate);
  };

  const handleSubmitPress = (values) => {
    let originalData = {
      ...values,
      [NAME]: values[NAME] ?  values[NAME] : null,
      [SERIALNUMBER]: values[SERIALNUMBER] ?  values[SERIALNUMBER] : null,
      [SHAFTNDEMAX]: values[SHAFTNDEMAX] ?  values[SHAFTNDEMAX].replace(/,/g , ".") : null,
      [SHAFTNDEMIN]: values[SHAFTNDEMIN] ?  values[SHAFTNDEMIN].replace(/,/g , ".") : null,
      [BEARINGNDEMAX]: values[BEARINGNDEMAX] ?  values[BEARINGNDEMAX].replace(/,/g , ".") : null,
      [BEARINGNDEMIN]: values[BEARINGNDEMIN] ?  values[BEARINGNDEMIN].replace(/,/g , ".") : null,
      [SHAFTDEMAX]: values[SHAFTDEMAX] ?  values[SHAFTDEMAX].replace(/,/g , ".") : null,
      [SHAFTDEMIN]:values[SHAFTDEMIN] ?  values[SHAFTDEMIN].replace(/,/g , ".") : null,
      [BEARINGDEMAX]: values[BEARINGDEMAX] ?  values[BEARINGDEMAX].replace(/,/g , ".") : null,
      [BEARINGDEMIN]: values[BEARINGDEMIN] ?  values[BEARINGDEMIN].replace(/,/g , ".") : null,
      [INSULATERESISTANCE]: values[INSULATERESISTANCE] ?  values[INSULATERESISTANCE].replace(/,/g , ".") : null,
      [VOLTAGETESTED]: values[VOLTAGETESTED] ?  values[VOLTAGETESTED].replace(/,/g , ".") : null,
      [COMMENTS]: values[COMMENTS],
      [REPORTDATE]: reportDate ? reportDate.toISOString().split("T")[0] : null,
      [LASTLUBRICATION]: lastLubricationDate ? lastLubricationDate.toISOString().split("T")[0] : null,
      [JOBID]: selectedJobId,
      [REPORTID]: reportName,
      Id
    };
    
    let updateValues = {
      [NOKBEARING]: values[NOKBEARING][0] ? values[NOKBEARING][0].Id : null,
      [LUBRICATIONTYPE]: values[LUBRICATIONTYPE][0] ? values[LUBRICATIONTYPE][0].Id : null,
      [LUBRICATIONGRADE]: values[LUBRICATIONGRADE][0] ? values[LUBRICATIONGRADE][0].Id : null
    };

    let data = {
      ...originalData,
      ...updateValues
    };

    console.log('submit clicked', data);

    if (Id) {
      dispatch(updateJobReport(data, originalData, Id, navigateBack));
    } else {
      dispatch(saveJobReport(data, navigateBack));
    }

  };

  const navigateBack = () => {
    navigation.navigate('JobDetails',{Id: selectedJobId});
  }

  return (
    <ScrollView style={{ backgroundColor: theme.bgWhite }}>
       <Loader loading={loading} />

      <KeyboardAwareScrollView>
      <Formik
          initialValues={formData}
          onSubmit={(values) => {
            handleSubmitPress(values);
          }}
          validationSchema={addReportSchema}
          enableReinitialize
        >
          {({ handleChange, errors, values, handleSubmit, touched, setFieldValue }) => (
       <View style={GBStyles.container}>
       <View style={{backgroundColor: '#f4f4f4', padding: 12, marginBottom: 20, borderRadius: 8}}>
        <Text style={{ fontSize: 16}}>Job - <Text style={{fontWeight: '700'}}>{selectedJobTitle}</Text></Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Report Id" mand labelName="Report Id" value={reportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
        <Input
          labelName="Report Date"
          placeholder="DD/MM/YYYY"
          appendIconName="Calendar"
          appendIconColor={theme.textBlue}
          appendIconSize={16}
          value={reportDate.toLocaleDateString()}
          handlePress={() => setReportDateShow(true)}
          mand
        />
        {showReporDate && (
          <DateTimePicker
            value={reportDate}
            mode="date"
            onChange={(event, selectedDate) => {
              setFieldValue(REPORTDATE, selectedDate);
              onReportDateChange(event, selectedDate);
            }}
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
          />
        )}
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Name" labelName="Name" value={values[NAME]} handleChangeText={handleChange(NAME)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Serial No" labelName="Serial No" value={values[SERIALNUMBER]} handleChangeText={handleChange(SERIALNUMBER)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Select
            selectedValue={values[NOKBEARING][0]?.Name}
            disabled={false}
            onChange={(item) => {
              let obj = { Id: item.Id, Name: item.Name };
              setFieldValue(NOKBEARING, [obj]);
            }}
            placeholder="Select NOK Bearing"
            label="NOK Bearing"
            modalTitle="Select NOK Bearing"
            items={nokBearings}
            modalObj={{ id: "Id", name: "Name" }}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Shaft NDE Min" labelName="Shaft NDE Min" keyboardType="numeric" value={values[SHAFTNDEMIN]} handleChangeText={handleChange(SHAFTNDEMIN)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Shaft NDE Max" labelName="Shaft NDE Max" keyboardType="numeric" value={values[SHAFTNDEMAX]} handleChangeText={handleChange(SHAFTNDEMAX)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Housing NDE Min" labelName="Housing NDE Min" keyboardType="numeric" value={values[BEARINGNDEMIN]} handleChangeText={handleChange(BEARINGNDEMIN)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Housing NDE Max" labelName="Housing NDE Max" keyboardType="numeric" value={values[BEARINGNDEMAX]} handleChangeText={handleChange(BEARINGNDEMAX)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Shaft DE Min" labelName="Shaft DE Min" keyboardType="numeric"  value={values[SHAFTDEMIN]} handleChangeText={handleChange(SHAFTDEMIN)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Shaft DE Max" labelName="Shaft DE Max" keyboardType="numeric" value={values[SHAFTDEMAX]} handleChangeText={handleChange(SHAFTDEMAX)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Housing DE Min" labelName="Housing DE Min" keyboardType="numeric" value={values[BEARINGDEMIN]} handleChangeText={handleChange(BEARINGDEMIN)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Housing DE Max" labelName="Housing DE Max" keyboardType="numeric" value={values[BEARINGDEMAX]} handleChangeText={handleChange(BEARINGDEMAX)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Select
            selectedValue={values[LUBRICATIONTYPE][0]?.Name}
            disabled={false}
            onChange={(item) => {
              let obj = { Id: item.Id, Name: item.Name };
              setFieldValue(LUBRICATIONTYPE, [obj]);
            }}
            placeholder="Select Lubrication Type"
            label="Lubrication Type"
            modalTitle="Select Lubrication Type"
            items={masterData.lubricationTypes}
            modalObj={{ id: "Id", name: "Name" }}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Select
            selectedValue={values[LUBRICATIONGRADE][0]?.Name}
            disabled={false}
            onChange={(item) => {
              let obj = { Id: item.Id, Name: item.Name };
              setFieldValue(LUBRICATIONGRADE, [obj]);
            }}
            placeholder="Select Lubrication Grade"
            label="Lubrication Grade"
            modalTitle="Select Lubrication Grade"
            items={masterData.lubricationGrades}
            modalObj={{ id: "Id", name: "Name" }}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
        <Input
          labelName="Last Lubrication"
          placeholder="DD/MM/YYYY"
          appendIconName="Calendar"
          appendIconColor={theme.textBlue}
          appendIconSize={16}
          value={lastLubricationDate ? lastLubricationDate.toLocaleDateString() : null}
          handlePress={() => setLastLubricationDateShow(true)}
        />
        {showLastLubricationDate && (
          <DateTimePicker
            value={lastLubricationDate ? lastLubricationDate : new Date()}
            mode="date"
            onChange={(event, selectedDate) => {
              setFieldValue(LASTLUBRICATION, selectedDate);
              onlastLubricationDateChange(event, selectedDate);
            }}
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
          />
        )}
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Insulate Resistance (G Ohms)" labelName="Insulate Resistance (G Ohms)" keyboardType="numeric" value={values[INSULATERESISTANCE]} handleChangeText={handleChange(INSULATERESISTANCE)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Voltage Tested (Volts)" labelName="Voltage Tested (Volts)" keyboardType="numeric" value={values[VOLTAGETESTED]} handleChangeText={handleChange(VOLTAGETESTED)} />
        </View>
        <View style={{ marginBottom: 24 }}>
          <Input placeholder="Comments" labelName="Comments" multiline={true} value={values[COMMENTS]} handleChangeText={handleChange(COMMENTS)} />
        </View>
        <Row>
          <Button
            text="Save"
            style={{ flex: 1, marginRight: 8 }}
            onPress={() => handleSubmit()}
          />
          <Button
            text="Cancel"
            type="Secondary"
            style={{ flex: 1, marginLeft: 8 }}
            onPress={navigateBack}
          />
        </Row>
        </View>
           )}
      </Formik>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

export default AddReport;
