import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  ImageBackground,
  View,
  useWindowDimensions,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import Button from '../../shared/Button';
import theme from '../../assets/theme';
import GBStyles from '../../assets/globalstyles';
import Ripple from 'react-native-material-ripple';
import Row from '../../shared/Row';
import Icon from '../../shared/IconComp';
import ListItem from '../../shared/ListItem';
import qrCode from '../../assets/images/barcode.png';
import Document from '../../shared/Document';
import Report from '../Reports/Report';
import {useNavigation} from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";

const DetailsView = () => {
  
  const selectedJobId = useSelector((state) => state.jobsReducer.selectedJobId);
  const jobs = useSelector((state) => state.jobsReducer.jobs);
  const [job, setJob] = useState();
  
    useEffect(() => {
     if(selectedJobId && jobs && jobs.length > 0) {
      const filterJob = jobs.filter(j => j.Id === selectedJobId)[0];
      console.log('fetched job details', selectedJobId , filterJob);
      setJob(filterJob);
     }
    }, []);
  
  return (
    <ScrollView style={{backgroundColor: theme.bgWhite}}>
      {job && <View style={[GBStyles.container, {flex: 1}]}>
        <ListItem
          valueStyle={{fontWeight: '400'}}
          label="Reason for Change"
          value={job['Reasons List'] ? job['Reasons List'][0]?.Name : ''}
        />
        <ListItem label="Data Matrix Code" value={job.DataMatirx} />
        <ListItem label="Brand" value={job['Brand List'] ? job['Brand List'][0]?.Name : ''} />
        <ListItem label="Model" value={job['Model List'] ? job['Model List'][0]?.Name: ''} />
        <ListItem label="Wind Farm" value={job['Wind Farm']} />
        <ListItem label="Shaft Position" value={job['Shaft Position List'] ? job['Shaft Position List'][0]?.Name: ''} />
        <ListItem label="Part Type" value={job['Part Type List'] ? job['Part Type List'][0]?.Name: ''} />
      </View> }
    </ScrollView>
  );
};

const ReportsView = () => {
  const navigation = useNavigation();
  return (
    <ScrollView>
      <View style={GBStyles.container}>
        <Report
          reportName="Report 1"
          reportDate="05-04-2023"
          onPress={() => navigation.navigate('ReportView')}
        />
        <Report
          reportName="Report 2"
          reportDate="05-04-2023"
          onPress={() => navigation.navigate('ReportView')}
        />
        <Report
          reportName="Report 3"
          reportDate="05-04-2023"
          onPress={() => navigation.navigate('ReportView')}
        />
      </View>
      <Ripple
        style={GBStyles.addReportBtn}
        onPress={() => navigation.navigate('AddReport')}>
        <Row>
          <Icon name="AddReport" size={18} color={theme.textBlue} />
          <Text style={[GBStyles.pageTitle, GBStyles.addReportBtnText]}>
            Add report
          </Text>
        </Row>
      </Ripple>
    </ScrollView>
  );
};

const renderTabs = SceneMap({
  details: DetailsView,
  reports: ReportsView,
});

const JobDetails = ({route}) => {
  const { id, viewType } = route.params;
  const layout = useWindowDimensions();

  console.log('viewType ________________>', viewType);
  const [index, setIndex] = useState(viewType == 'reports' ? 1 : 0);
  const [routes] = useState([
    {key: 'details', title: 'DETAILES'},
    {key: 'reports', title: 'REPORTS'},
  ]);

  return (
    <>
      <ImageBackground
        source={qrCode}
        style={{width: '100%', height: 190, position: 'relative'}}
        resizeMethod="auto"
        resizeMode="contain">
        <View style={Styles.overlay}>
          <Text style={Styles.detailTitle}>Salesforce Developer</Text>
          <Row justifyContent="flex-start">
            <Text style={Styles.detailDesc}>02-04-2023 | </Text>
            <Icon name="Operator" size={14} color={theme.textWhite} />
            <Text style={Styles.detailDesc}> John Doe</Text>
          </Row>
        </View>
      </ImageBackground>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderTabs}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </>
  );
};

const Styles = StyleSheet.create({
  overlay: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 130,
  },
  detailTitle: {
    fontSize: 18,
    color: theme.textWhite,
    fontWeight: '800',
  },
  detailDesc: {
    fontSize: 14,
    color: theme.textWhite,
    fontWeight: '500',
  },
});

export default JobDetails;
