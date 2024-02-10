import React from "react";
import theme from "../assets/theme";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

const NoData = ({ title, description, image }) => {
  return (
    <View style={Styles.container}>
        <Image
            source={image}
            style={{ marginBottom: 20, alignSelf: "center" }}
            height={120}
            width={100}
            resizeMethod="auto"
            resizeMode="cover"
          />
      <Text style={Styles.title}>{title}</Text>
      <Text style={Styles.desc}>{description}</Text>
    </View>
  );
};
const Styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height / 1.3,
    backgroundColor: theme.bgWhite,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.textBlack,
    marginBottom: 10,
  },
  desc: { fontSize: 14, color: theme.textGray, textAlign: "center" },
});

export default NoData;
