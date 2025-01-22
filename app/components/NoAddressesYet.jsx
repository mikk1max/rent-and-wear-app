import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../utils/style";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

const NoAddressesYet = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/NoAddressesYet.png")}
        style={styles.image}
      />
      <Text style={styles.title}>{t("noAddresses.title")}</Text>
      <Text style={styles.subtitle}>{t("noAddresses.subtitle")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: width,
    height: height - 250,
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

export default NoAddressesYet;
