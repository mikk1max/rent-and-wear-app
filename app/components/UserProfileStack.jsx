import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserProfileView from "../partials/UserProfileView";
import SendsView from "../partials/Sends";
import SettingsView from "../partials/SettingsView";
import { globalStyles } from "../utils/style";
import RentNowView from "../partials/RentNowView";

const Stack = createStackNavigator();

const stackOptions = {
  headerShown: true,
  headerBackTitle: " ",
  headerTitleStyle: { fontSize: 24 },
  headerTintColor: globalStyles.accentColor,
  headerLeftContainerStyle: {
    paddingLeft: 10,
  },
  headerRightContainerStyle: {
    paddingRight: 10,
  },
};

const UserProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserProfileView"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="UserProfileView"
        component={UserProfileView}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sends"
        component={SendsView}
        options={
          { title: "Your ads", ...stackOptions }
          // headerStatusBarHeight: 44,
          // headerBackground: () => {
          //   backgroundColor: globalStyles.accentColor;
          // },
        }
      />
      <Stack.Screen
        name="SettingsView"
        component={SettingsView}
        options={{ title: "Settings", ...stackOptions }}
      />
      <Stack.Screen
        name="RentNowView"
        component={RentNowView}
        // options={{ title: "Settings", ...stackOptions }}
      />
    </Stack.Navigator>
  );
};

export default UserProfileStack;
