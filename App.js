import React, { useEffect, useState } from "react";
import { View, Platform, StatusBar, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import NavigationStack from "./app/components/NavigationStack";
import { styles } from "./app/utils/style";
import { UserProvider, useUser } from "./app/components/UserProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./app/utils/i18n";

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <View
        style={[
          styles.whiteBack,
          {
            flex: 1,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          },
        ]}
      >
        <StatusBar
          // barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
          backgroundColor="#FFFFFF"
        />
        <UserProvider>
          <NavigationContainer>
            <NavigationStack />
          </NavigationContainer>
        </UserProvider>
      </View>
    </I18nextProvider>
  );
}
