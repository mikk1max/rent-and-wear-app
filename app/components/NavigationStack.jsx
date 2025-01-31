import React, { Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { globalStyles } from "../utils/style";
import { useUser } from "./UserProvider";
import GetsView from "../partials/GetsView";
import SendsView from "../partials/SendsView";
import SendDetailsView from "../partials/SendDetailsView";
import GetDetailsView from "../partials/GetDetailsView";
import ResetPassword from "./ResetPassword";

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

const Loader = React.lazy(() => import("./Loader"));
const NavigationBar = React.lazy(() => import("./NavigationBar"));
const UserProfileView = React.lazy(() => import("../partials/UserProfileView"));
const SettingsView = React.lazy(() => import("../partials/SettingsView"));
const WelcomeView = React.lazy(() => import("../partials/WelcomeView"));
const RentNowView = React.lazy(() => import("../partials/RentNowView"));
const AddressesView = React.lazy(() => import("../partials/AddressesView"));
const AuthLoginView = React.lazy(() => import("../partials/AuthLoginView"));
const AuthRegistrationView = React.lazy(() =>
  import("../partials/AuthRegistrationView")
);
const AnnouncementView = React.lazy(() =>
  import("../partials/AnnouncementView")
);
const CreateAnnouncementView = React.lazy(() =>
  import("../partials/CreateAnnouncementView")
);
const AllCategories = React.lazy(() => import("./AllCategories"));
const ChatView = React.lazy(() => import("../partials/ChatView"));
const AllChatsView = React.lazy(() => import("../partials/AllChatsView"));
const RentItNowView = React.lazy(() => import("../partials/RentItNowView"));

export default function Navigation() {
  const { user } = useUser();
  const { t } = useTranslation();

  return (
    <Suspense fallback={<Loader />}>
      <Stack.Navigator
        initialRouteName={user ? "MainApp" : "Welcome"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="SettingsView"
          component={SettingsView}
          options={{ title: t("viewTitles.settings"), ...stackOptions }}
        />
        <Stack.Screen
          name="LogOut"
          component={WelcomeView}
          options={{ ...stackOptions, headerShown: false }}
        />
        <Stack.Screen
          name="AddressesView"
          component={AddressesView}
          options={{ title: t("viewTitles.addresses"), ...stackOptions }}
        />
        <Stack.Screen name="RentNowView" component={RentNowView} />
        <Stack.Screen
          name="AnnouncementView"
          component={AnnouncementView}
          options={({ route }) => ({
            ...stackOptions,
            title: route.params.title,
          })}
        />
        <Stack.Screen
          name="Categories"
          component={AllCategories}
          options={{ ...stackOptions, title: t("viewTitles.categories") }}
        />
        <Stack.Screen
          name="Chats"
          component={AllChatsView}
          options={{ ...stackOptions, title: t("viewTitles.chats") }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatView}
          options={{ title: t("viewTitles.chat"), ...stackOptions }}
        />
        <Stack.Screen
          name="CreateAnnouncementView"
          component={CreateAnnouncementView}
          options={{
            title: t("viewTitles.createAnnouncement"),
            ...stackOptions,
          }}
        />
        <Stack.Screen
          name="RentItNowView"
          component={RentItNowView}
          options={({ route }) => ({
            ...stackOptions,
            title: t("viewTitles.rentItem", { item: route.params.title }),
          })}
        />
        <Stack.Screen
          name="GetsView"
          component={GetsView}
          options={{ title: t("viewTitles.myGets"), ...stackOptions }}
        />
        <Stack.Screen
          name="SendsView"
          component={SendsView}
          options={{ title: t("viewTitles.mySends"), ...stackOptions }}
        />
        <Stack.Screen
          name="SendDetailsView"
          component={SendDetailsView}
          options={({ route }) => ({
            ...stackOptions,
            title: t("viewTitles.sendDetails", { id: route.params.id }),
          })}
        />
        <Stack.Screen
          name="GetDetailsView"
          component={GetDetailsView}
          options={({ route }) => ({
            ...stackOptions,
            title: t("viewTitles.getDetails", { id: route.params.id }),
          })}
        />
        <Stack.Screen name="Welcome" component={WelcomeView} />
        <Stack.Screen name="LogIn" component={AuthLoginView} />
        <Stack.Screen name="Registration" component={AuthRegistrationView} />
        <Stack.Screen
          name="MainApp"
          component={NavigationBar}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="UserProfileView"
          component={UserProfileView}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ ...stackOptions, title: t("viewTitles.passwordReset") }}
        />
      </Stack.Navigator>
    </Suspense>
  );
}
