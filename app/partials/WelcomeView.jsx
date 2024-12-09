import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { styles } from "../styles/WelcomeViewStyles";
import { onLogin } from "../utils/auth";

export default function WelcomeView({ navigation }) {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const initializeUser = (user) => {
    console.log("Zainicjalizowano użytkownika:", user);
  };

  return (
    <View style={{ flex: 1 }}>
      <>{Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}</>
      <>{Platform.OS === "android" && <StatusBar barStyle="light-content" />}</>
      <ImageBackground
        source={require("../../assets/images/welcomeBack.jpg")}
        style={styles.backImage}
      >
        <SafeAreaView
          style={[mainStyles.container, { backgroundColor: "transparent" }]}
        >
          <View style={styles.logoAndBtns}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>Rent & Wear</Text>
              <Text style={styles.logoTextAdditional}>clothing rental</Text>
            </View>
            <View style={styles.moveButtons}>
              <TouchableOpacity
                style={styles.guestBtn}
                onPress={() => {
                  onLogin(
                    {
                      email: "guest@example.com",
                      password: "qwerty123",
                    },
                    initializeUser
                  );
                  navigation.navigate("MainApp");
                }}
              >
                <Text style={styles.guestBtnText}>Continue as a Guest</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logBtn}
                onPress={() => navigation.navigate("LogIn")}
              >
                <Text style={styles.logBtnText}>Log in / Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
