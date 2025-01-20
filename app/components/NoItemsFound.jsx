import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../utils/style";

const { width, height } = Dimensions.get("window");

const NoItemsFound = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/NoItemsFound.png")}
        style={styles.image}
      />
      <Text style={styles.title}>No Items Found</Text>
      <Text style={styles.subtitle}>
      {`Change your filters or try more later ;)`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: width,
    // height: height - 20 - 50 - 20 - 20 - 45 - 20 - 20 - 180 - 20 - 50 - 20,
    backgroundColor: globalStyles.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: globalStyles.primaryColor,
    marginVertical: 10
  },
  subtitle: {
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: globalStyles.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default NoItemsFound;
