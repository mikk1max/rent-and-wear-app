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
import { useTranslation } from "react-i18next";

export default function WelcomeView({ navigation }) {
  const { t } = useTranslation();

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const initializeUser = (user) => {
    console.log("Zainicjalizowano użytkownika:", user);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={globalStyles.backgroundColor} barStyle="dark-content" />
      <ImageBackground
        source={require("../../assets/images/welcomeBack.jpg")}
        style={styles.backImage}
      >
        <SafeAreaView
          style={[mainStyles.container, { backgroundColor: "transparent" }]}
        >
          <View style={styles.logoAndBtns}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>{t("brand.name")}</Text>
              <Text style={styles.logoTextAdditional}>
                {t("brand.subtitle")}
              </Text>
            </View>
            <View style={styles.moveButtons}>
              <TouchableOpacity
                style={styles.guestBtn}
                onPress={async () => {
                  try {
                    await onLogin(
                      {
                        email: "guest@example.com",
                        password: "qwerty123",
                      },
                      initializeUser
                    );
                    navigation.replace("MainApp");
                  } catch (error) {
                    console.error("Guest login failed:", error);
                  }
                }}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Text style={styles.guestBtnText}>{t("welcome.guestBtn")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logBtn}
                onPress={() => navigation.navigate("LogIn")}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Text style={styles.logBtnText}>{t("welcome.loginBtn")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
