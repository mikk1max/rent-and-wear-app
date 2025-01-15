import { StyleSheet, Platform, StatusBar } from "react-native";

export const globalStyles = {
  primaryColor: "#083D77",
  textOnPrimaryColor: "#F1F5F2",
  secondaryColor: "#D2DDE1",
  textOnSecondaryColor: "#1098F7",
  accentColor: "#083D77",
  textOnAccentColor: "#F1F5F2",
  backgroundColor: "#F1F5F2",

  redColor: "#DC143C",
  blueColor: "#1338BE",

  BORDER_RADIUS: 15,
};

export const styles = StyleSheet.create({
  whiteBack: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingHorizontal: 25,
    justifyContent: "flex-start",
    alignItems: "center",

    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === "android" ? 20 : 0,
  },
  scrollBase: {
    flex: 1,
    borderRadius: globalStyles.BORDER_RADIUS,
    overflow: "hidden",
  },
  logo: {
    width: 240,
    height: 70,
    borderRadius: globalStyles.BORDER_RADIUS,
  },
});
