import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { globalStyles } from "../utils/style";
import { useTranslation } from "react-i18next";

const NoItemsFound = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/NoItemsFound.png")}
        style={styles.image}
      />
      <Text style={styles.title}>{t("noItemsFound.title")}</Text>
      <Text style={styles.subtitle}>{t("noItemsFound.subtitle")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginVertical: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
});

export default NoItemsFound;
