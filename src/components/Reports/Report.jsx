import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import theme from '../../assets/theme';
import Row from '../../shared/Row';
import Ripple from 'react-native-material-ripple';

const AllReport = ({onPress, reportName, reportDate}) => {
  return (
    <Ripple onPress={onPress} style={Styles.report}>
      <Text style={Styles.reportName} numberOfLines={1}>
        {reportName}
      </Text>
      <Text style={Styles.reportDate}>{reportDate}</Text>
    </Ripple>
  );
};

const Styles = StyleSheet.create({
  report: {
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: 'solid',
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.bgWhite,
    overflow: 'hidden',
    marginBottom: 10,
  },
  reportName: {
    fontSize: 14,
    color: theme.textBlack,
    fontWeight: '700',
    marginBottom: 3,
  },
  reportDate: {
    fontSize: 12,
    color: theme.textGray,
  },
});

export default AllReport;
