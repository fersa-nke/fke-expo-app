import React, {useState, useRef, createRef} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import theme from '../../assets/theme';
import Icon from '../../shared/IconComp';
import GBStyles from '../../assets/globalstyles';
import Row from '../../shared/Row';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/native';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import IconComp from '../../shared/IconComp';
import { KEYMapper as ReportKEYMapper } from './../../services/UserConfig';

const AllReport = ({list, onHandlePress, ReportEdit, ReportDelete}) => {
  const reports = list;
  const navigation = useNavigation();
  const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null);
  const reportRow = useRef([]);
  const { NAME,
    REPORTDATE 
  } = ReportKEYMapper;


  const onOpen = (index) => {
    console.log(index);
    let currswipeable = reportRow[index];
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== currswipeable) {
        currentlyOpenSwipeable.close();
    }
    setCurrentlyOpenSwipeable(currswipeable);
  };

  const onClose = () => {
    // setCurrentlyOpenSwipeable(null);
  };

  const closeSwipe = () => {
    console.log('close opened swipe');
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.close();
    }
  };



  const renderLeftActions = (Id) => {
    return (
      <Row style={{height: 40, marginTop: "3%", justifyContent: 'center', alignItems: 'center', backgroundColor: "#f2f2f2"}}>
        <Ripple style={{width: 70, height: 40,justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bgBlue}} onPress={()=> {closeSwipe();ReportEdit(Id)}} >
        <IconComp name="Edit" size={24} color={theme.textWhite} />
      </Ripple>
      <Ripple style={{width: 70, height: 40,justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'}}  onPress={()=>{closeSwipe();ReportDelete(Id)}}>
        <IconComp name="Delete" size={24} color={theme.textWhite} />
      </Ripple>
      </Row>
    )
  }
  
  return (
        <>
        {reports?.map((report, index) => (
          <GestureHandlerRootView  key={report.Id}>
          <Swipeable ref={ref => reportRow[index] = ref} renderRightActions={()=>renderLeftActions(report.Id)} onSwipeableOpen={() => onOpen(index)}
          onSwipeableClose={() => onClose(index)}>
          <TouchableOpacity onPress={() => onHandlePress(report.Id)}>
          <View style={[Styles.report]}>
            <Text style={Styles.reportName} numberOfLines={1}>
            {report[NAME]}
            </Text>
            <Text style={Styles.reportDate}>{report[REPORTDATE]}</Text>
          </View>
         </TouchableOpacity>
          </Swipeable>
          </GestureHandlerRootView>
      ))}      
    </>
  );
}

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
