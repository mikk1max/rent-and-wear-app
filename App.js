import React from "react";
import { View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import NavigationStack from "./app/components/NavigationStack";
import { globalStyles, styles as mainStyles } from "./app/utils/style";
import { UserProvider, useUser } from "./app/components/UserProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./app/utils/i18n";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getLocales } from "expo-localization";
import { IconProvider } from "./app/components/IconProvider";

i18n.changeLanguage(getLocales()[0].languageCode ?? "en");

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <StatusBar />
        <View style={mainStyles.whiteBack}>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </View>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}

const AppContent = () => {
  const { user } = useUser();

  return (
    <IconProvider userId={user?.id}>
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>
    </IconProvider>
  );
};
