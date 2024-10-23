import React from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import RentNowView from "../partials/RentNowView";
import RentOutView from "../partials/RentOutView";
import UserProfileView from "../partials/UserProfileView";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles } from "../utils/style";

const Tab = createBottomTabNavigator();

const renderIcon = (route, focused) => {
  const iconStyle = {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: focused ? globalStyles.textOnAccentColor : globalStyles.accentColor,
  };

  switch (route.name) {
    case "UserProfile":
      return (
        <FontAwesome6
          name="user"
          size={24}
          color={focused ? globalStyles.textOnAccentColor : globalStyles.accentColor}
        />
      );
    case "RentOut":
      return <Text style={iconStyle}>Rent out</Text>;
    case "RentNow":
      return <Text style={iconStyle}>Rent now</Text>;
    default:
      return null;
  }
};

const NavigationBar = () => {
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <View style={styles.navbarContainer}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => renderIcon(route, focused),
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveBackgroundColor: globalStyles.accentColor,
            tabBarStyle: styles.tabBarStyle,
            tabBarItemStyle: [
              styles.tabBarItemStyle,
              route.name === "UserProfile" && styles.userProfileTabStyle,
            ],
          })}
        >
          <Tab.Screen name="RentNow" component={RentNowView} />
          <Tab.Screen
            name="UserProfile"
            component={UserProfileView}
            style={styles.tabStyle}
          />
          <Tab.Screen
            name="RentOut"
            component={RentOutView}
            style={styles.tabStyle}
          />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    flex: 1,
    marginBottom: Platform.OS == "android" ? 20 : 30,
  },
  tabBarStyle: {
    width: "86%",
    alignSelf: "center",
    borderRadius: 150,
    overflow: "hidden",
    borderWidth: 1,
    borderTopColor: globalStyles.accentColor,
    borderTopWidth: 1,
    borderColor: globalStyles.accentColor,
    boxShadow: "none",
    shadowColor: "transparent",
  },
  tabBarItemStyle: {
    borderRightWidth: 1,
    borderColor: "transparent",
  },
  userProfileTabStyle: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: globalStyles.accentColor,
  },
});

export default NavigationBar;
