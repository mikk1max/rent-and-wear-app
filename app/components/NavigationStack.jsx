import NavigationBar from "./NavigationBar";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserProfileView from "../partials/UserProfileView";
import SendsGetsView from "../partials/SendsGetsView";
import SettingsView from "../partials/SettingsView";
import { globalStyles } from "../utils/style";
import WelcomeView from "../partials/WelcomeView";

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

export default function Navigation() {
  return (
    // *Welcome screen
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeView} />
      <Stack.Screen name="MainApp" component={NavigationBar} />
      {/* <Stack.Screen name="LogInView" component={LogInView} /> */}

      {/* TODO:UserProfile screen */}
      <Stack.Screen
        name="UserProfileView"
        component={UserProfileView}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="SendsView"
        component={SendsGetsView}
        options={
          { title: "Your sends", ...stackOptions }
          // headerStatusBarHeight: 44,
          // headerBackground: () => {
          //   backgroundColor: globalStyles.accentColor;
          // },
        }
      />
      <Stack.Screen
        name="GetsView"
        component={SendsGetsView}
        options={
          { title: "Your gets", ...stackOptions }
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
        name="LogOut"
        component={WelcomeView}
        options={{ ...stackOptions, headerShown: false }}
      />
    </Stack.Navigator>
  );
}
