import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/Store';
import RootNavigator from './src/navigation/RootNavigator';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import CustomSplashScreen from './src/shared/SplashScreen';
// import splashImage from './assets/images/animate-splash-screen.gif';
import React, { useEffect, useState } from "react";

let persistor = persistStore(store);
export default function App() {
  const [appLoaded, setAppLoaded] = useState(true);
 
  useEffect(() => {
    setTimeout(()=>{
     setAppLoaded(false);
    },5000);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      {appLoaded ? <CustomSplashScreen/> : <RootNavigator />}
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
