import React from 'react';
import {View, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GBStyles from '../../assets/globalstyles';
import Ripple from 'react-native-material-ripple';
import Icon from '../../shared/IconComp';
import theme from '../../assets/theme';
import Row from '../../shared/Row';
import Document from '../../shared/Document';
import Button from '../../shared/Button';

function ReportView() {
  const navigation = useNavigation();
  return (
    <View style={GBStyles.container}>
      <Document fileDate="05-04-2023" fileName="Report.pdf" fileType="Pdf" />
      <Document fileDate="05-04-2023" fileName="Report.pdf" fileType="Pdf" />
      <Ripple style={GBStyles.upload}>
          <Text style={GBStyles.uploadTitle}>upload report</Text>
          <Text style={GBStyles.uploadHelpText}>
            Please upload PDF, jPG, JPEG, PNG formate files only.
          </Text>
        </Ripple>
      <Button text="Close" type="Secondary"  onPress={() => navigation.navigate('JobDetails')} />
    </View>
  );
}

export default ReportView;
