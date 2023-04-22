import React from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";

const Icon = createIconSetFromIcoMoon(
  require("../assets/fonts/selection.json"),
  "IcoMoon",
  "icomoon.ttf"
);

const IconComp = ({ name, size, color, onPress, ...rest }) => {
  const [fontsLoaded] = useFonts({
    IcoMoon: require("../assets/fonts/icomoon.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View>
      <Icon name={name} size={size} color={color} onPress={onPress} {...rest} />
    </View>
  );
};
export default IconComp;
