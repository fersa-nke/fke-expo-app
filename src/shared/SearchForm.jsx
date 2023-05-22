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
import theme from "../assets/theme";
import { useSelector, useDispatch, connect } from "react-redux";
import Input from "./Input";
import Row from "./Row";
import Button from "./Button";
import Select from "./Select";
import { KEYMapper as JOBKEYMapper } from './../services/UserConfig';
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";

const SearchForm = ({setSearchModal}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const masterData = useSelector((state) => state.masterReducer);
    const userData = useSelector((state) => state.userReducer.user);
    const [jobSearchDate, setJobSearchDate] = useState('');
    const [showDate, setShowDate] = useState(false);

    const {
      JOBDATE,
      WINDFARM,
      WINDTURBINE,
      WINDLOCATION
    } = JOBKEYMapper;

    const initialFormValues = {
      [JOBDATE]: '',
      [WINDFARM]: '',
      [WINDLOCATION]: '',
      [WINDTURBINE]: ''    
    };
  
    const [formData, setFormData] = useState(initialFormValues);
  
    const addJobSchema = Yup.object().shape({
      [WINDFARM]: Yup.array(Yup.object()),
      [WINDLOCATION]: Yup.array(Yup.object()),
      [WINDTURBINE]: Yup.string()
    });

    const onJobDateChange = (event, selectedDate) => {
      setShowDate(false);
      setJobSearchDate(selectedDate);
    };

    const handleSubmitPress = (values) => {
      
      setSearchModal(false);
      let windFarm = values[WINDFARM][0] ? values[WINDFARM][0].Name : '';
      let windLocation = values[WINDLOCATION][0] ? values[WINDLOCATION][0].Name : '';
      let windTurbine = values[WINDTURBINE];
      let jobSearchDateValue = jobSearchDate ? jobSearchDate.toISOString().split("T")[0] : '';
      let query = `(${WINDFARM},eq,${windFarm})~and(${WINDLOCATION},eq,${windLocation})~and(${WINDTURBINE},eq,${windTurbine})~and(${JOBDATE},eq,${jobSearchDateValue})`;
      navigation.navigate('SearchJobs',{type: 'search', query: query, formObj: {windFarm, windLocation, windTurbine, jobSearchDate: jobSearchDateValue}} );

    }
      

    return (
<>
      <ScrollView style={{ flex: 1, padding: 16 }}>
      <Formik
          initialValues={formData}
          onSubmit={(values) => {
            handleSubmitPress(values);
          }}
          validationSchema={addJobSchema}
          enableReinitialize
        >
          {({ handleChange, errors, values, handleSubmit, touched, setFieldValue }) => (
     <>
      <View style={{ marginBottom: 20 }}>
        <Select
          selectedValue={values[WINDFARM][0]?.Name}
          disabled={false}
          onChange={(item)=>{
            let obj = {Id: item.Id, Name: item.Name};
            setFieldValue(WINDFARM, [obj]);
          }}
          placeholder="Select Wind Farm"
          label="Wind Farm"
          modalTitle="Select Wind Farm"
          items={masterData.windFarms}
          modalObj={{ id: "Id", name: "Name" }}
        />
        {errors[WINDFARM] && touched[WINDFARM] && (
          <Text style={Styles.validateError}>
            {errors[WINDFARM]}
          </Text>
        )}
      </View>

        <View style={{ marginBottom: 20 }}>
        <Select
          selectedValue={values[WINDLOCATION][0]?.Name}
          disabled={false}
          onChange={(item)=>{
            let obj = {Id: item.Id, Name: item.Name};
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
        {errors[WINDTURBINE] && touched[WINDTURBINE] && (
          <Text style={Styles.validateError}>
            {errors[WINDTURBINE]}
          </Text>
        )}
      </View>
      <View style={{ marginBottom: 20 }}>
        <Input
          labelName="Job Date"
          placeholder="DD/MM/YYYY"
          appendIconName="Calendar"
          appendIconColor={theme.textBlue}
          appendIconSize={16}
          value={jobSearchDate ? jobSearchDate.toLocaleDateString() : null}
          handlePress={() => setShowDate(true)}
        />
        {showDate && (
          <DateTimePicker
            value={jobSearchDate ? jobSearchDate : new Date()}
            mode="date"
            onChange={onJobDateChange}
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
          />
        )}
      </View>

      <Row style={{padding: 16}}>
        <Button type="Secondary" text="Close" style={{flex: 1, marginRight: 8}} onPress={() => setSearchModal(false)} />
        <Button text="Search" style={{flex: 1, marginLeft: 8}}  onPress={() => handleSubmit()} />
      </Row>

      </>
          )
        }
        </Formik>
      </ScrollView>
</>
    )

  }

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

  export default SearchForm;