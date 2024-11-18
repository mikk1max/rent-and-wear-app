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
  title: {
    fontFamily: "WorkSans_900Black",
    fontSize: 35,
    textAlign: "center",
    color: globalStyles.accentColor,
    marginTop: 50,
    marginBottom: 80,
  },
  logoAndBtns: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  moveButtons: {
    width: width - 2 * 25,
    flexDirection: "row",
    justifyContent: "space-between",
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
