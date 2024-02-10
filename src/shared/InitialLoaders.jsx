import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Row from "./Row";
import theme from "../assets/theme";


const FieldInitialLoader = () => {
    const [animateValue] = useState(new Animated.Value(0));
    useEffect(() => {
        fieldNaimated();
      }, []);
      const fieldNaimated = () => {
        Animated.timing(animateValue, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                fieldNaimated();
            }, 1000);
          });
      };
      const translateX = animateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 100],
      });
      const translateX2 = animateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 200],
      });
      const translateX3 = animateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 90],
      });
    return(
          <View style={{ flex: 1, justifyContent: 'space-evenly', overflow: 'hidden' }}>
          <View style={{ backgroundColor: '#ECEFF1', height: 10, width: 150, marginBottom: 10 }}>
              <Animated.View style={{ width: '20%', height: '100%', backgroundColor: 'white', opacity: 0.5, transform: [{ translateX: translateX3 }] }}></Animated.View>
            </View>
            <Animated.View style={{ backgroundColor: '#ECEFF1', height: 35, marginBottom: 24}}>
              <Animated.View style={{ width: '20%', height: '100%', backgroundColor: 'white', opacity: 0.5, transform: [{ translateX: translateX2 }] }}></Animated.View>
            </Animated.View>
          </View>
    )
};

const JobsInitialLoader = () => {
  const [animateValue] = useState(new Animated.Value(0));
  useEffect(() => {
    circleAnimated();
  }, []);
  const circleAnimated = () => {
    Animated.timing(animateValue, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
        setTimeout(() => {
          circleAnimated();
        }, 1000);
      });
  };

  const translateX = animateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 100],
  });
  const translateX2 = animateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 200],
  });
  const translateX3 = animateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 90],
  });
  return (
    <View style={[{ marginBottom: 10 }, Styles.card]}>
          <View style={{ width: 60, height: 70, backgroundColor: '#ECEFF1', overflow: 'hidden', marginRight: 20 }}>
            <Animated.View style={{ width: '30%', opacity: 0.5, height: '100%', backgroundColor: 'white', transform: [{ translateX: translateX }] }}></Animated.View>
          </View>
          <View style={{ flex: 1, justifyContent: 'space-evenly', overflow: 'hidden' }}>
            <Animated.View style={{ backgroundColor: '#ECEFF1', height: 14, marginBottom: 10 }}>
              <Animated.View style={{ width: '20%', height: '100%', backgroundColor: 'white', opacity: 0.5, transform: [{ translateX: translateX2 }] }}></Animated.View>
            </Animated.View>
            <View style={{ backgroundColor: '#ECEFF1', height: 10, width: 150, marginBottom: 20 }}>
              <Animated.View style={{ width: '20%', height: '100%', backgroundColor: 'white', opacity: 0.5, transform: [{ translateX: translateX3 }] }}></Animated.View>
            </View>
            <Row justifyContent={'space-between'}>
            <View style={{ backgroundColor: '#ECEFF1', height: 12, width: 100 }}>
              <Animated.View style={{ width: '20%', height: '100%', backgroundColor: 'white', opacity: 0.5, transform: [{ translateX: translateX }] }}></Animated.View>
            </View>
            <View style={{ backgroundColor: '#ECEFF1', height: 16, width: 16 }}>
              <Animated.View style={{ width: '20%', height: '100%', backgroundColor: 'white', opacity: 0.5, transform: [{ translateX: translateX2 }] }}></Animated.View>
            </View>
            </Row>
          </View>
        
    </View>
  );
};

const Styles = StyleSheet.create({
  card: {
    padding: 16,
    shadowColor: "black",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: 'flex-start'
  },
});

export {JobsInitialLoader, FieldInitialLoader};
