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
import { saveJobReport, updateJobReport } from "../../redux/Reports/ReportsAction";
import DateTimePicker from "@react-native-community/datetimepicker";
import Select from "../../shared/Select";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { KEYMapper as ReportKEYMapper } from './../../services/UserConfig';
import { Formik } from "formik";
import * as Yup from "yup";

const AddReport = ({navigation, route }) => {
  const Id = route.params?.Id;
  const reports = useSelector((state) => state.reportsReducer.reports);
  const selectedJobId = useSelector((state) => state.jobsReducer.selectedJobId);
  const selectedJobTitle = useSelector((state) => state.jobsReducer.jobTitle);
  const selectedReportId = useSelector((state) => state.reportsReducer.selectedReportId);
 // const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportDate, setReportDate] = useState(new Date());
  const [lastLubricationDate, setLastLubricationDate] = useState(new Date());
  const [showReporDate, setReportDateShow] = useState(false);
  const [showLastLubricationDate, setLastLubricationDateShow] = useState(false);
  const dispatch = useDispatch();
  const masterData = useSelector((state) => state.masterReducer);
  const nokBearings = [{Name: 'OK', Id: 'OK'}, {Name: 'NOK', Id: 'NOK'}];

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
    [SHAFTNDEMAX]: Yup.number(),
    [SHAFTNDEMIN]: Yup.number(),
    [BEARINGNDEMAX]: Yup.number(),
    [BEARINGNDEMIN]: Yup.number(),
    [SHAFTDEMAX]: Yup.number(),
    [SHAFTDEMIN]: Yup.number(),
    [BEARINGDEMAX]: Yup.number(),
    [BEARINGDEMIN]: Yup.number(),
    [LUBRICATIONTYPE]: Yup.array(Yup.object()),
    [LUBRICATIONGRADE]: Yup.array(Yup.object()),
    [INSULATERESISTANCE]: Yup.number(),
    [VOLTAGETESTED]: Yup.number(),
    [COMMENTS]: Yup.string()
  });

  useEffect(() => {
    let j = '';
    if (Id && selectedReportId && reports && reports.length > 0) {
      const filterReport = reports.filter(r => r.Id === selectedReportId)[0];
      console.log('fetched report details', selectedReportId, filterReport);

      let formValues = { ...filterReport,
      [NOKBEARING]: [{"Id": filterReport[NOKBEARING], "Name": filterReport[NOKBEARING]}] };
      setFormData(formValues);
      setReportDate(new Date(filterReport[REPORTDATE]));
      let lubricationDate = filterReport[LASTLUBRICATION] ? new Date(filterReport[LASTLUBRICATION]) : '';
      setLastLubricationDate(lubricationDate);
      j = `${filterReport[REPORTID]}`;
    } else {
      let date = new Date();
      let dateFormate = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
      j = `RM - ${dateFormate} - RP `;
    }
    setReportName(j);
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
    setLoading(true);
    let originalData = {
      ...values
    }
    let data = {
      [NAME]: values[NAME] ?  values[NAME] : null,
      [SERIALNUMBER]: values[SERIALNUMBER] ?  values[SERIALNUMBER] : null,
      [SHAFTNDEMAX]: values[SHAFTNDEMAX] ?  values[SHAFTNDEMAX] : null,
      [SHAFTNDEMIN]: values[SHAFTNDEMIN] ?  values[SHAFTNDEMIN] : null,
      [BEARINGNDEMAX]: values[BEARINGNDEMAX] ?  values[BEARINGNDEMAX] : null,
      [BEARINGNDEMIN]: values[BEARINGNDEMIN] ?  values[BEARINGNDEMIN] : null,
      [SHAFTDEMAX]: values[SHAFTDEMAX] ?  values[SHAFTDEMAX] : null,
      [SHAFTDEMIN]:values[SHAFTDEMIN] ?  values[SHAFTDEMIN] : null,
      [BEARINGDEMAX]: values[BEARINGDEMAX] ?  values[BEARINGDEMAX] : null,
      [BEARINGDEMIN]: values[BEARINGDEMIN] ?  values[BEARINGDEMIN] : null,
      [INSULATERESISTANCE]: values[INSULATERESISTANCE] ?  values[INSULATERESISTANCE] : null,
      [VOLTAGETESTED]: values[VOLTAGETESTED] ?  values[VOLTAGETESTED] : null,
      [COMMENTS]: values[COMMENTS],
      [REPORTDATE]: reportDate ? reportDate.toISOString().split("T")[0] : null,
      [LASTLUBRICATION]: lastLubricationDate ? lastLubricationDate.toISOString().split("T")[0] : null,
      [JOBID]: selectedJobId,
      [REPORTID]: reportName,
      [NOKBEARING]: values[NOKBEARING][0] ? values[NOKBEARING][0].Id : null,
      [LUBRICATIONTYPE]: values[LUBRICATIONTYPE][0] ? values[LUBRICATIONTYPE][0].Id : null,
      [LUBRICATIONGRADE]: values[LUBRICATIONGRADE][0] ? values[LUBRICATIONGRADE][0].Id : null
    };
    console.log('submit clicked', data, originalData);

    if (Id) {
      dispatch(updateJobReport(data, originalData, Id, navigateBack));
    } else {
      dispatch(saveJobReport(data, originalData, navigateBack));
    }

  };

  const navigateBack = () => {
    navigation.navigate('JobDetails',{Id: selectedJobId});
  }

  return (
    <ScrollView style={{ backgroundColor: theme.bgWhite }}>
      <KeyboardAwareScrollView style={GBStyles.container}>
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
            onChange={onReportDateChange}
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
          value={lastLubricationDate.toLocaleDateString()}
          handlePress={() => setLastLubricationDateShow(true)}
        />
        {showLastLubricationDate && (
          <DateTimePicker
            value={lastLubricationDate}
            mode="date"
            onChange={onlastLubricationDateChange}
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
          />
        )}
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Insulate Resistance" labelName="Insulate Resistance" keyboardType="numeric" value={values[INSULATERESISTANCE]} handleChangeText={handleChange(INSULATERESISTANCE)} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Voltage Tested" labelName="Voltage Tested" keyboardType="numeric" value={values[VOLTAGETESTED]} handleChangeText={handleChange(VOLTAGETESTED)} />
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
