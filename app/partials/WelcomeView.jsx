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

import { styles as mainStyles } from "../utils/style";
import { styles } from "../styles/WelcomeViewStyles";

export default function WelcomeView({ navigation }) {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <>{Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}</>
      {/* <>{Platform.OS === "android" && <StatusBar barStyle="light-content" />}</> */}

      <ImageBackground
        source={require("../../assets/images/welcome-background-min.jpg")}
        style={styles.backImage}
      >
        <SafeAreaView
          style={[mainStyles.container, { backgroundColor: "transparent" }]}
        >
          <Text style={styles.title}>Let's Get Started!</Text>
          <View style={styles.logoAndBtns}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
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
