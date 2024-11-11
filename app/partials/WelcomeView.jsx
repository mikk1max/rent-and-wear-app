import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles } from "../utils/style";

const { width } = Dimensions.get("window");

export default function WelcomeView({ navigation }) {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={require("../../assets/images/welcome-background-min.jpg")}
        style={styles.backImage}
      >
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Let's Get Started!</Text>
          <View
            style={{ flex: 1, justifyContent: "space-between", padding: 20 }}
          >
            <Text style={styles.logo}>LOGO</Text>
            <View style={styles.moveButtons}>
              <TouchableOpacity
                style={styles.guestBtn}
                onPress={() => navigation.navigate("MainApp")}
              >
                <Text style={styles.guestBtnText}>I'm just a guest</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logBtn}
                // onPress={() => navigation.navigate("AnotherView")}
              >
                <Text style={styles.logBtnText}>I've an account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 25,
  },
  backImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  title: {
    fontFamily: "WorkSans_900Black",
    fontSize: 35,
    textAlign: "center",
    color: globalStyles.accentColor,
    marginTop: 50,
    marginBottom: 80,
  },
  logo: {
    fontFamily: "WorkSans_900Black",
    fontSize: 45,
    color: globalStyles.accentColor,
    backgroundColor: globalStyles.secondaryColor,
    padding: 20,
    borderColor: globalStyles.accentColor,
    borderWidth: 2,
    textAlign: "center",
    marginHorizontal: 70,
  },
  moveButtons: {
    width: width - 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  guestBtn: {
    backgroundColor: globalStyles.secondaryColor,
    borderColor: globalStyles.primaryColor,
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  guestBtnText: {
    color: globalStyles.textOnSecondaryColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  logBtn: {
    backgroundColor: globalStyles.accentColor,
    borderColor: globalStyles.accentColor,
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  logBtnText: {
    color: globalStyles.textOnAccentColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
});
