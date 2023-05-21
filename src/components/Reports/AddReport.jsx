import React, { useState } from "react";
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
import { saveJobReport } from "../../redux/Reports/ReportsAction";
import DateTimePicker from "@react-native-community/datetimepicker";
import Select from "../../shared/Select";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddReport = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [reportName, setReportName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setShow(false);
    setStartDate(currentDate);
  };

  const handleSubmitPress = () => {
    setLoading(true);
    let data = {
      jobId: 1,
      Date: startDate,
      Name:  reportName
    };
    dispatch(saveJobReport(data));
  };

  return (
    <ScrollView style={{ backgroundColor: theme.bgWhite }}>
      <KeyboardAwareScrollView style={GBStyles.container}>
        <View style={{backgroundColor: '#f4f4f4', padding: 12, marginBottom: 20, borderRadius: 8}}>
        <Text style={{ fontSize: 16}}>Job - <Text style={{fontWeight: '700'}}>J1234</Text></Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Report Id" mand labelName="Report Id" handleChangeText={setReportName} value={'RM-458458468854-RP'} />
        </View>
        <View style={{ marginBottom: 20 }}>
        <Input
          labelName="Report Date"
          placeholder="DD/MM/YYYY"
          appendIconName="Calendar"
          appendIconColor={theme.textBlue}
          appendIconSize={16}
          value={startDate.toLocaleDateString()}
          handlePress={() => setShow(true)}
          mand
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
          <Input placeholder="Name" labelName="Name" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Serial No" labelName="Serial No" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Select
            selectedValue={''}
            disabled={false}
            onChange={() => console.log('Selected')}
            placeholder="Select NOK Bearing"
            label="NOK Bearing"
            modalTitle="Select NOK Bearing"
            // items={{ Id: "Id", Name: "Name" }}
            modalObj={{ id: "Id", name: "Name" }}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Shaft NDE Min" labelName="Shaft NDE Min" keyboardType="numeric" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Shaft NDE Max" labelName="Shaft NDE Max" keyboardType="numeric" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Housing NDE Min" labelName="Housing NDE Min" keyboardType="numeric" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Housing NDE Max" labelName="Housing NDE Max" keyboardType="numeric" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Shaft DE Min" labelName="Shaft DE Min" keyboardType="numeric" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Shaft DE Max" labelName="Shaft DE Max" keyboardType="numeric" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Housing DE Min" labelName="Housing DE Min" keyboardType="numeric" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Housing DE Max" labelName="Housing DE Max" keyboardType="numeric" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Select
            selectedValue={''}
            disabled={false}
            onChange={() => console.log('Selected')}
            placeholder="Select Lubrication Type"
            label="Lubrication Type"
            modalTitle="Select Lubrication Type"
            // items={{ Id: "Id", Name: "Name" }}
            modalObj={{ id: "Id", name: "Name" }}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Select
            selectedValue={''}
            disabled={false}
            onChange={() => console.log('Selected')}
            placeholder="Select Lubrication Grade"
            label="Lubrication Grade"
            modalTitle="Select Lubrication Grade"
            // items={{ Id: "Id", Name: "Name" }}
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
          <Input placeholder="Insulate Resistance" labelName="Insulate Resistance" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Input placeholder="Voltage Tested" labelName="Voltage Tested" handleChangeText={setReportName} />
        </View>
        <View style={{ marginBottom: 24 }}>
          <Input placeholder="Comments" labelName="Comments" multiline={true} handleChangeText={setReportName} />
        </View>

        



        <Row>
          <Button
            text="Save"
            style={{ flex: 1, marginRight: 8 }}
            onPress={handleSubmitPress}
          />
          <Button
            text="Cancel"
            type="Secondary"
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() => navigation.navigate("ReportView")}
          />
        </Row>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

export default AddReport;
