/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './../components/Authentication/Login';
import Jobs from './../components/Jobs/Jobs';
import Ribbon from '../shared/Ribbon';
import AddJob from './../components/Jobs/AddJob';
import { HeaderLeft, HeaderRight } from '../shared/Header';
import JobDetails from './../components/Jobs/JobDetails';
import AddReport from './../components/Reports/AddReport';
import ReportView from './../components/Reports/ReportView';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, Text } from 'react-native';
import Container from 'toastify-react-native';
import CustomSplashScreen from './../shared/SplashScreen';
import  { getAPIMapper ,getKEYMapper} from "./../redux/Master/MasterActions";
import SearchJobsResult from './../components/Jobs/SearchJobsResult';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const Stack = createNativeStackNavigator();
const RootNavigator = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state)=> state.userReducer.isLogin);
  const [appLoaded, setAppLoaded] = useState(false);
  const fetchAPIMapper = () => dispatch(getAPIMapper());
  const fetchKEYMapper = () => dispatch(getKEYMapper());
  const keyMapper = useSelector((state)=> state.masterReducer.keyMapperConfig);
  const apiMapper = useSelector((state)=> state.masterReducer.apiMapperConfig);
  const jobTitle = useSelector((state)=> state.jobsReducer.jobTitle);
  const reportTitle = useSelector((state)=> state.reportsReducer.reportTitle);


  useEffect(() => {
    if(isLogin) {
      console.log('apiMapper loaded------------->', apiMapper.length);
      fetchAPIMapper().then(() => {
        setTimeout(()=>{
          setAppLoaded(false);
        },1000);
      });
      fetchKEYMapper();
    }
    else {
      setTimeout(()=>{
        setAppLoaded(false);
      },4000);
    }
    
  }, []);
  return (
    <><SafeAreaView style={{flex: 1}}>
     {appLoaded ? <CustomSplashScreen /> : <>
     <Ribbon />
      <NavigationContainer>
      <Container position="top" />
        <Stack.Navigator
          initialRouteName={ isLogin ? 'Jobs' : 'Login'}
          screenOptions={{ headerTitleAlign: 'center', headerTitleStyle: {textTransform: 'uppercase'} }}>
            {isLogin ?  <>
            <Stack.Screen
              name="Jobs"
              component={Jobs}
              options={{
                headerLeft: HeaderLeft,
                headerRight: () => <HeaderRight showSeach={true} />,
                title: null,
              }}
            />
            <Stack.Screen
              name="SearchJobs"
              component={SearchJobsResult}
              options={{
                title: `MRO JOBS`,
                headerRight: () => <HeaderRight showSeach={true} />,
                headerTitleStyle: {
                  fontSize: 16,
                  fontWeight: '700',
                },
              }}
            />
            <Stack.Screen
              name="AddJob"
              component={AddJob}
              options={{
                title: `${jobTitle}`,
                headerRight: () => <HeaderRight isAddPage={true} />,
                headerTitleStyle: {
                  fontSize: 16,
                  fontWeight: '700',
                },
              }}
            />
            <Stack.Screen
              name="EditJob"
              component={AddJob}
              options={{
                title: `${jobTitle}`,
                headerRight: () => <HeaderRight isAddPage={true} />,
                headerTitleStyle: {
                  fontSize: 16,
                  fontWeight: '700',
                },
              }}
            />
            <Stack.Screen
              name="AddReport"
              component={AddReport}
              options={{
                title: 'Add Report',
                headerTitleStyle: {
                  fontSize: 16,
                  fontWeight: '700',
                },
              }}
            />
            <Stack.Screen
              name="EditReport"
              component={AddReport}
              options={{
                title: 'Edit Report',
                headerTitleStyle: {
                  fontSize: 16,
                  fontWeight: '700',
                },
              }}
            />
            <Stack.Screen
              name="JobDetails"
              component={JobDetails}
              options={{
                title: null,
                headerTransparent: true,
                headerBackVisible: true,
              }}
            />
            <Stack.Screen
              name="ReportView"
              component={ReportView}
              options={{
                title: `${reportTitle}`
              }}
            />
            </>  : <>
              <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
            </>}
          
        </Stack.Navigator>
      </NavigationContainer>
     </>}
     
      </SafeAreaView>
    </>
  );
};

export default RootNavigator;
