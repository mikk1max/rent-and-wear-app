import React from "react";
import { View, Platform, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import NavigationStack from "./app/components/NavigationStack";

import { styles } from "./app/utils/style";

export default function App() {
  return (
    <View style={[styles.whiteBack, ,]}>
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>
    </View>
  );
}
