import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  ImageBackground,
  View,
  Image,
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
import defaultIcon from '../../assets/images/default-mini.png';
import BarCode from '../../assets/images/barcode-mini.png';
import Document from '../../shared/Document';
import Report from '../Reports/Report';
import {useNavigation} from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { KEYMapper as JOBKEYMapper } from './../../services/UserConfig';

const DetailsView = () => {
  
  const selectedJobId = useSelector((state) => state.jobsReducer.selectedJobId);
  const jobs = useSelector((state) => state.jobsReducer.jobs);
  const [job, setJob] = useState();
  
    useEffect(() => {
     if(selectedJobId && jobs && jobs.length > 0) {
      const filterJob = jobs.filter(j => j.Id === selectedJobId)[0];
      console.log(filterJob);
      setJob(filterJob);
     }
    }, []);
  
  return (
    <ScrollView style={{backgroundColor: theme.bgWhite}}>
      {job && <View style={[GBStyles.container, {flex: 1}]}>
    {job[JOBKEYMapper.DATAMATRIX] ?
    <ListItem label="Data Matrix" value={job[JOBKEYMapper.DATAMATRIX]} />
    : <>
        <ListItem label="Batch Number" value={job[JOBKEYMapper.BATCHNUMBER]} />
        <ListItem label="IR Number" value={job[JOBKEYMapper.IRNUMBER]} />
        <ListItem label="OR Number" value={job[JOBKEYMapper.ORNUMBER]} />
        <ListItem label="Bearing Model" value={job[JOBKEYMapper.BEARINGMODEL] ?  job[JOBKEYMapper.BEARINGMODEL][0]?.Name : ''} />
    </>
    }
        <ListItem label="Exchange Type" value={job[JOBKEYMapper.EXCHANGETYPE] ? job[JOBKEYMapper.EXCHANGETYPE][0]?.Name : ''} />
        <ListItem label="Reasons of Chnage" value={job[JOBKEYMapper.REASONS] ? job[JOBKEYMapper.REASONS][0]?.Name : ''} />
        <ListItem label="Wind Farm" value={job[JOBKEYMapper.WINDFARM]} />
        <ListItem label="Wind Turbine" value={job[JOBKEYMapper.WINDTURBINE]} />
        <ListItem label="Generator Model" value={job[JOBKEYMapper.GENERATEMODEL]} />
        <ListItem label="Shaft Position" value={job[JOBKEYMapper.POSITION] ? job[JOBKEYMapper.POSITION][0]?.Name: ''} />
        <ListItem label="Removed Bearing Brand" value={job[JOBKEYMapper.REMOVEDBEARINGBRAND] ? job[JOBKEYMapper.REMOVEDBEARINGBRAND][0]?.Name: ''} />
        <ListItem label="Removed Bearing Type" value={job[JOBKEYMapper.REMOVEDBEARINGTYPE] ? job[JOBKEYMapper.REMOVEDBEARINGTYPE][0]?.Name: ''} />
        <ListItem label="New Bearing Brand" value={job[JOBKEYMapper.NEWBEARINGBRAND] ? job[JOBKEYMapper.NEWBEARINGBRAND][0]?.Name: ''} />
        <ListItem label="New Bearing Type" value={job[JOBKEYMapper.NEWBEARINGTYPE] ? job[JOBKEYMapper.NEWBEARINGTYPE][0]?.Name: ''} />
        <ListItem label="Comments" value={job[JOBKEYMapper.COMMENTS]} />
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
  const selectedJobId = useSelector((state) => state.jobsReducer.selectedJobId);
  const jobs = useSelector((state) => state.jobsReducer.jobs);
  const [job, setJob] = useState();
  
    useEffect(() => {
     if(selectedJobId && jobs && jobs.length > 0) {
      const filterJob = jobs.filter(j => j.Id === selectedJobId)[0];
      setJob(filterJob);
     }
    }, []);

  const [index, setIndex] = useState(viewType == 'reports' ? 1 : 0);
  const [routes] = useState([
    {key: 'details', title: 'DETAILS'},
    {key: 'reports', title: 'REPORTS'},
  ]);


  
  if(!job) {
    return <></>;
  }

  return (
    <>
      {/* <ImageBackground
        source={job[JOBKEYMapper.DATAMATRIX] ? BarCode : defaultIcon}
        style={{width: '100%', height: 100, position: 'relative'}}
        resizeMethod="auto"
        resizeMode="contain"> */}
        {/* <View style={Styles.overlay}>
          <Text style={Styles.detailTitle}>{job[JOBKEYMapper.TITLE]}</Text>
          <Row justifyContent="flex-start">
            <Text style={Styles.detailDesc}>{job[JOBKEYMapper.JOBDATE]} | </Text>
            <Icon name="Operator" size={14} color={theme.textWhite} />
            <Text style={Styles.detailDesc}> {job[JOBKEYMapper.WINDFARM]}</Text>
          </Row>
        </View> */}
        <Row style={[Styles.card]}>
            {job.offline && <Text style={Styles.offline}>Offline</Text> }
            <View style={{ flex: 1, 
          marginRight: 8}}>
        <Image
              
              source={job[JOBKEYMapper.DATAMATRIX] ? BarCode : defaultIcon}
              width={30}
              height={30}
              style={{marginTop: 40 , marginLeft: 10, marginBottom: 5, marginRight: 14 }}
              resizeMethod="auto"
              resizeMode="cover"
            />            
          </View>
        <View
        style={{
          flex: 2,
        }}> 
          <Text style={Styles.cardTitle} numberOfLines={1}>
                {job[JOBKEYMapper.JOBID]}
              </Text>
              <Text style={Styles.cardTitle} numberOfLines={1}>
                {job[JOBKEYMapper.WINDFARM]}
              </Text>
              <Text style={Styles.cardDescription} numberOfLines={2}>
                {job[JOBKEYMapper.JOBDATE]}
              </Text>
              <Row style={Styles.cardFooter} justifyContent="space-between">
                <Row>
                  <Icon name="Operator" size={14} color={theme.textBlue} />
                  <Text style={Styles.operatorName}>{job[JOBKEYMapper.OPERATORNAME]}</Text>
                </Row>
              </Row>
            </View>

          </Row>

      {/* </ImageBackground> */}

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
  card: {
    backgroundColor: theme.bgWhite,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 0,
    paddingTop: 0,
    position: 'relative',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textBlack,
    marginBottom: 0,
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 12,
    marginTop: 2,
    color: theme.textGray,
    fontWeight: '500',
  },
  cardFooter: {
    paddingTop: 4,
    marginTop: 0,
  },
  operatorName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textBlue,
    marginLeft: 4,
  },
  overlay: {
    padding: 16,
    // backgroundColor: 'rgba(0,0,0,0.25)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 50,
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
