import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { globalStyles } from "../utils/style";
import { useTranslation } from "react-i18next";

const { height } = Dimensions.get("window");

const NoConversation = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/NoConversation.png")}
        style={styles.image}
      />
      <Text style={styles.title}>{t("noChats.title")}</Text>
      <Text style={styles.subtitle}>{t("noChats.subtitle")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height - 180,
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
});

export default NoConversation;
