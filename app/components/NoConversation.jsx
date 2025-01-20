import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../utils/style";

const { width, height } = Dimensions.get("window");

const NoConversation = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/NoConversation.png")}
        style={styles.image}
      />
      <Text style={styles.title}>No Chats</Text>
      <Text style={styles.subtitle}>
      You have no any chat rooms yet!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: width,
    height: height - 180,
    // height: "100%",
    backgroundColor: globalStyles.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: globalStyles.primaryColor,
    marginBottom: 10,
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

export default NoConversation;
