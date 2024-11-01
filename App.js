import React from "react";
import { View } from "react-native";
import RentNowView from "./app/partials/RentNowView";
import NavigationBar from "./app/components/NavigationBar";
import { globalStyles } from "./app/utils/style";
import SettingsView from "./app/partials/SettingsView";
import Sends from "./app/partials/Sends";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: globalStyles.backgroundColor,
      }}
    >
      {/* <RentNowView /> */}
      <NavigationBar />
      {/* <SettingsView /> */}
      {/* <GestureHandlerRootView style={{ flex: 1 }}>
        <Sends />
      </GestureHandlerRootView> */}
    </View>
  );
}
