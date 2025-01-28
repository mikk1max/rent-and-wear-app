import { StyleSheet, Dimensions } from "react-native";
import { globalStyles } from "../utils/style";

const { width } = Dimensions.get("window");
const dataCardWidth = width - 50 - 100 - 15;

export const iconParams = {
  width: 30,
  height: 30,
  fillColor: globalStyles.textOnPrimaryColor,
};

export const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    height: 170,
  },
  userCardIMG: {
    width: 100,
    height: "100%",
    borderRadius: 15,
    marginRight: 15,
    // borderTopLeftRadius: 15,
    // borderBottomLeftRadius: 15,
  },
  userCardINFO: {
    justifyContent: "center",
    height: "100%",
    width: dataCardWidth,
    padding: 0,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: 15,
    justifyContent: "space-evenly",
    paddingHorizontal: 15,
  },
  fullNameText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 28,
    color: globalStyles.textOnSecondaryColor,

  },
  emailText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.primaryColor,
  },

  verificationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  verificationText: {
    fontFamily: "Poppins_500Medium",
    color: globalStyles.textOnPrimaryColor,
  },
  verificationOpacity: {
    padding: 5,
    backgroundColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 20,
    color: globalStyles.textOnPrimaryColor,
  },
  buttonBase: {
    backgroundColor: globalStyles.primaryColor,
    width: width - 2 * 25,
    height: 60,
    borderRadius: globalStyles.BORDER_RADIUS,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 15,
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  buttonLogOut: {
    backgroundColor: globalStyles.redColor,
  },
  buttonRent: {
    width: (width - 2 * 25 - 15) / 2,
    flexDirection: "column",
    height: (width - 2 * 25 - 15) / 2 - 40,
    gap: 0,
    justifyContent: "center",
  },
  buttonRentText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 24,
    color: globalStyles.textOnPrimaryColor,
  },

  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: globalStyles.primaryColor,
    marginBottom: 10,
    alignSelf: "center"
  },
  subtitle: {
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
    alignSelf: "center"
  },

  notLogContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLOGIN: {
    flexDirection: "row",
    backgroundColor: globalStyles.accentColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  // buttonText: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   color: globalStyles.textOnAccentColor,
  // },
});
