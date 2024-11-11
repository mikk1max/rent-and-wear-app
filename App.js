import React from "react";
import { View } from "react-native";
import RentNowView from "./app/partials/RentNowView";
import NavigationBar from "./app/components/NavigationBar";
import { globalStyles } from "./app/utils/style";
import SettingsView from "./app/partials/SettingsView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import WelcomeView from "./app/partials/WelcomeView";
import { NavigationContainer } from "@react-navigation/native";
import NavigationStack from "./app/components/NavigationStack";

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: globalStyles.backgroundColor,
      }}
    >
      {/* <RentNowView /> */}
      {/* <NavigationBar /> */}
      {/* <WelcomeView /> */}
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>

      {/* <SettingsView /> */}
      {/* <GestureHandlerRootView style={{ flex: 1 }}>
        <Sends />
      </GestureHandlerRootView> */}
    </View>
  );
}
