/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './../components/Authentication/Login';
import Jobs from './../components/Jobs/Jobs';
import Ribbon from '../shared/Ribbon';
import AddJob from './../components/Jobs/AddJob';
import { HeaderLeft, HeaderRight } from '../shared/Header';
import JobDetails from './../components/Jobs/JobDetails';
import AddReport from './../components/Reports/AddReport';
import { useSelector, connect } from 'react-redux';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const Stack = createNativeStackNavigator();
const RootNavigator = () => {
  const isLogin = useSelector((state)=> state.userReducer.isLogin);
  const userdata = useSelector((state)=> state.userReducer);
  console.log('user data------------------>',userdata);
  return (
    <>
      <Ribbon />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={ isLogin ? 'Jobs' : 'Login'}
          screenOptions={{ headerTitleAlign: 'center' }}>
            {isLogin ?  <>
            <Stack.Screen
              name="Jobs"
              component={Jobs}
              options={{
                headerLeft: HeaderLeft,
                headerRight: HeaderRight,
                title: null,
              }}
            />
            <Stack.Screen
              name="AddJob"
              component={AddJob}
              options={{
                title: 'ADD JOB',
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
                title: 'ADD REPORT',
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
            </>  : <>
              <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
            </>}
          
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RootNavigator;
