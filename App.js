import React, { useEffect, useState } from "react";
import { View, Platform, StatusBar, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import NavigationStack from "./app/components/NavigationStack";
import { styles } from "./app/utils/style";
import { UserProvider, useUser } from "./app/components/UserProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./app/utils/i18n";
import ChatView from "./app/partials/ChatView";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <StatusBar />
        <View
          style={[
            styles.whiteBack,
            {
              flex: 1,
            },
          ]}
        >
          <UserProvider>
            {/* <ChatView /> */}
            <NavigationContainer>
              <NavigationStack />
            </NavigationContainer>
          </UserProvider>
        </View>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
