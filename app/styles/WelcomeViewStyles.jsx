import { StyleSheet, Dimensions } from "react-native";
import { globalStyles } from "../utils/style";

const { width } = Dimensions.get("window");

const buttonBase = {
  borderWidth: 2,
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: globalStyles.BORDER_RADIUS,
  alignItems: "center",
  justifyContent: "center",
};

const buttonTextBase = {
  fontFamily: "Poppins_500Medium",
  fontSize: 16,
};

export const styles = StyleSheet.create({
  backImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 36,
    textTransform: "uppercase",
    width: "100%",
    color: globalStyles.textOnPrimaryColor,
    textDecorationLine: "line-through",
  },
  logoTextAdditional: {
    width: "100%",
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    letterSpacing: 4,
    color: globalStyles.textOnAccentColor,
    textTransform: "uppercase",
  },
  logoAndBtns: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    alignItems: "center",
    // marginBottom: 40,
  },
  moveButtons: {
    width: width - 50 - 30,
    gap: 20,
    marginTop: 20,
  },
  guestBtn: {
    ...buttonBase,
    backgroundColor: globalStyles.secondaryColor,
    borderColor: globalStyles.primaryColor,
  },
  logBtn: {
    ...buttonBase,
    backgroundColor: globalStyles.accentColor,
    borderColor: globalStyles.accentColor,
  },
  guestBtnText: {
    ...buttonTextBase,
    color: globalStyles.textOnSecondaryColor,
  },
  logBtnText: {
    ...buttonTextBase,
    color: globalStyles.textOnAccentColor,
  },
});
