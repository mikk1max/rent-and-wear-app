import NavigationBar from "./NavigationBar";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserProfileView from "../partials/UserProfileView";
import SendsGetsView from "../partials/SendsGetsView";
import SettingsView from "../partials/SettingsView";
import { globalStyles } from "../utils/style";
import WelcomeView from "../partials/WelcomeView";
import RentNowView from "../partials/RentNowView";
import AddressesView from "../partials/AddressesView";
import AuthLoginView from "../partials/AuthLoginView";
import AuthRegistrationView from "../partials/AuthRegistrationView";
import AnnouncementView from "../partials/AnnouncementView";
import CreateAnnouncementView from "../partials/CreateAnnouncementView";
import { useUser } from "./UserProvider";
import AllCategories from "./AllCategories";
import ChatView from "../partials/ChatView";
import AllChatsView from "../partials/AllChatsView";
import RentItNowView from "../partials/RentItNowView";

const Stack = createStackNavigator();

const stackOptions = {
  headerShown: true,
  headerBackTitle: " ",
  headerTitleStyle: { fontSize: 24 },
  headerTintColor: globalStyles.textOnPrimaryColor,
  headerLeftContainerStyle: {
    paddingLeft: 10,
  },
  headerRightContainerStyle: {
    paddingRight: 10,
  },
  headerStyle: {
    backgroundColor: globalStyles.primaryColor,
  },
};

export default function Navigation() {
  const { user } = useUser();

  return (
    // *Welcome screen
    <Stack.Navigator
      initialRouteName={user ? "MainApp" : "Welcome"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeView} />
      <Stack.Screen name="LogIn" component={AuthLoginView} />
      <Stack.Screen name="Registration" component={AuthRegistrationView} />
      <Stack.Screen
        name="MainApp"
        component={NavigationBar}
        options={{ gestureEnabled: false }}
      />
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
      <Stack.Screen
        name="AddressesView"
        component={AddressesView}
        options={{ title: "Addresses", ...stackOptions }}
      />
      <Stack.Screen
        name="RentNowView"
        component={RentNowView}
        // options={{ title: "Settings", ...stackOptions }}
      />
      <Stack.Screen
        name="AnnouncementView"
        component={AnnouncementView}
        options={({ route }) => ({
          ...stackOptions, // Ваши стандартные опции
          title: route.params.title, // Переопределение title с параметра маршрута
        })}
      />
      <Stack.Screen
        name="Categories"
        component={AllCategories}
        options={{ ...stackOptions }}
      />
      <Stack.Screen
        name="Chats"
        component={AllChatsView}
        options={{ ...stackOptions }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatView}
        options={{ ...stackOptions }}
      />
      <Stack.Screen
        name="CreateAnnouncementView"
        component={CreateAnnouncementView}
        options={{ title: "Create Announcement", ...stackOptions }}
      />
      <Stack.Screen
        name="RentItNowView"
        component={RentItNowView}
        options={({ route }) => ({
          ...stackOptions, // Ваши стандартные опции
          title: `Rent ${route.params.title}`, // Переопределение title с параметра маршрута
        })}
      />
    </Stack.Navigator>
  );
}
