import React, {useRef, useEffect} from 'react';
import {Animated, StyleSheet, View, Dimensions, Image} from 'react-native';
import splashImage from '../assets/images/splash-screen.gif';
import splashImagePNG from '../assets/images/splash-screen.png';

const CustomSplashScreen = (props) => {
  const {loading, ...attributes} = props;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
  }, []);
  return (
      <Animated.View 
      style={[
        styles.modalBackground,
      ]}>
        <Image
              source={splashImagePNG}
              style={styles.overlayImage}
              width= {Dimensions.get("window").width}
              height= {Dimensions.get("window").height}
              resizeMethod="auto"
              resizeMode="cover"
      />
      <Image
              source={splashImage}
              style={styles.overlayImage}
              width= {Dimensions.get("window").width}
              height= {Dimensions.get("window").height}
              resizeMethod="auto"
              resizeMode="cover"
      />
      </Animated.View>
  );
};

export default CustomSplashScreen;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    zIndex:1000,
    position: 'absolute',
    left: 0,
    top:0,
    right:0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '#384E63'
  },
  overlayImage: {
    zIndex:1000,
    position: 'absolute',
   }
});