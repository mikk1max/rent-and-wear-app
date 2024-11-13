import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Platform, SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import RentNowView from "../partials/RentNowView";
import RentOutView from "../partials/RentOutView";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles } from "../utils/style";
import fetchSVG from "../utils/fetchSVG";
import { SvgUri } from "react-native-svg";
import UserProfileView from "../partials/UserProfileView";

const Tab = createBottomTabNavigator();

const renderIcon = (route, focused) => {
  const [svgUrl, setSvgUrl] = useState(null);

  useEffect(() => {
    async function loadSvg() {
      const url = await fetchSVG(
        focused ? `app-icons/user-fill.svg` : `app-icons/user-stroke.svg`
      );
      setSvgUrl(url);
    }
    loadSvg();
  }, [focused]);

  const textAndIconStyle = {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: focused ? globalStyles.textOnAccentColor : globalStyles.accentColor,
  };

  switch (route.name) {
    case "UserProfile":
      return (
        <SvgUri
          uri={svgUrl}
          width={32}
          height={32}
          style={{ fill: textAndIconStyle.color }}
        />
      );
    case "RentOut":
      return <Text style={textAndIconStyle}>Rent out</Text>;
    case "RentNow":
      return <Text style={textAndIconStyle}>Rent now</Text>;
    default:
      return null;
  }
};

const NavigationBar = () => {
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) return null;

  return (
    // <NavigationContainer>
    <SafeAreaView
      style={{ flex: 1, backgroundColor: globalStyles.backgroundColor }}
    >
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
    </SafeAreaView>
    // </NavigationContainer>
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
