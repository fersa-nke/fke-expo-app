import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import theme from '../../assets/theme';
import GBStyles from '../../assets/globalstyles';
import Ripple from 'react-native-material-ripple';
import Document from '../../shared/Document';
import Input from '../../shared/Input';
import Row from '../../shared/Row';
import Button from '../../shared/Button';

const AddReport = ({navigation}) => {
  return (
    <ScrollView style={{backgroundColor: theme.bgWhite}}>
      <View style={GBStyles.container}>
        <Input
          labelName="Report Name"
          style={{marginBottom: 12}}
        />
        <Document
          fileDate="06-04-2023"
          fileName="Reports.jpeg"
          fileType="Image"
        />
        <Ripple style={GBStyles.upload}>
          <Text style={GBStyles.uploadTitle}>upload report</Text>
          <Text style={GBStyles.uploadHelpText}>
            Please upload PDF, jPG, JPEG, PNG formate files only.
          </Text>
        </Ripple>
        <Row>
            <Button
              text="Save"
              style={{flex: 1, marginRight: 8}}
              onPress={() => navigation.navigate('ReportView')}
            />
            <Button
              text="Cancel"
              type="Secondary"
              style={{flex: 1, marginLeft: 8}}
              onPress={() => navigation.navigate('ReportView')}
            />
          </Row>
      </View>
    </ScrollView>
  );
};

export default AddReport;
