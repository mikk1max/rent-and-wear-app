import React, { useState, useEffect, useMemo } from "react";
import { Text, View, StyleSheet, Platform, SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RentNowView from "../partials/RentNowView";
import RentOutView from "../partials/RentOutView";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles, styles as mainStyles } from "../utils/style";
import UserProfileView from "../partials/UserProfileView";
import Icon from "./Icon";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const renderIcon = (route, focused, t) => {
  const textAndIconStyle = {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: focused ? globalStyles.textOnAccentColor : globalStyles.accentColor,
  };

  let iconName = "user-stroke";
  if (route.name === "UserProfile") {
    iconName = focused ? "user-fill" : "user-stroke";
    return <Icon name={iconName} width={32} height={32} fillColor="white" />;
  }

  switch (route.name) {
    case "RentOut":
      return (
        <Text style={textAndIconStyle}>{t("navigationBar.rentOutBtn")}</Text>
      );
    case "RentNow":
      return (
        <Text style={textAndIconStyle}>{t("navigationBar.rentNowBtn")}</Text>
      );
    default:
      return null;
  }
};

const NavigationBar = (route) => {
  const fontsLoaded = useCustomFonts();

  const { t } = useTranslation();

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView
      style={[
        mainStyles.whiteBack,
        {
          paddingBottom: Platform.OS === "android" ? 20 : 0,
        },
      ]}
    >
      <View style={styles.navbarContainer}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => renderIcon(route, focused, t),
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    flex: 1,
    // backgroundColor: "red",
    // marginBottom: Platform.OS == "android" ? 20 : 30,
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
    height: 50,
    paddingBottom: 0,
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
