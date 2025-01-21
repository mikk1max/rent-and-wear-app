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

const { width, height } = Dimensions.get("window");

const NoAnnouncementsYet = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/NoAnnouncementsYet.png")}
        style={styles.image}
      />
      <Text style={styles.title}>No Items</Text>
      <Text style={styles.subtitle}>You have no announcements yet!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: width,
    height: height - 20 - 50 - 20 - 20 - 45 - 20,
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

export default NoAnnouncementsYet;
