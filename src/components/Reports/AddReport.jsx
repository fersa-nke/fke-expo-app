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

import DateTimePicker from "@react-native-community/datetimepicker";

const AddReport = () => {
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setShow(false);
    setStartDate(currentDate);
  };

  return (
    <ScrollView style={{ backgroundColor: theme.bgWhite }}>
      <View style={GBStyles.container}>
        <Input placeholder="Report Name" labelName="Report Name" style={{ marginBottom: 20 }} />
        <View style={{ marginBottom: 24 }}>
        <Input
          labelName="Date"
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
        <Row>
          <Button
            text="Save"
            style={{ flex: 1, marginRight: 8 }}
            onPress={() => navigation.navigate("ReportView")}
          />
          <Button
            text="Cancel"
            type="Secondary"
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() => navigation.navigate("ReportView")}
          />
        </Row>
      </View>
    </ScrollView>
  );
};

export default AddReport;
