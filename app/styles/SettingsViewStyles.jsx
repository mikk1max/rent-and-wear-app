import { StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";

export const styles = StyleSheet.create({
  mainSection: {
    flex: 1,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    padding: 20,
  },

  imageContainer: {
    alignItems: "center",
    gap: 15,
    // marginBottom: 30,
  },

  userProfileImg: {
    width:150,
    height: 150,
    borderRadius: globalStyles.BORDER_RADIUS,

    // marginRight: 15,
    // borderTopLeftRadius: 15,
    // borderBottomLeftRadius: 15,
  },

  imageText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.blueColor,
  },

  divider: {
    marginVertical: 20,
    height: 2,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  label: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
  },

  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  SaveCancelBtns: {
    flexDirection: "row",
  },

  buttonsHidden: {
    display: "none",
  },

  buttonEdit: {
    width: 70,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
    padding: 5,
    alignItems: "center",
  },

  buttonSave: {
    width: "50%",
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
    padding: 7,
    alignItems: "center",
  },

  buttonCancel: {
    width: "50%",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.redColor,
    padding: 7,
    alignItems: "center",
  },

  buttonText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.textOnPrimaryColor,
  },

  inputContainer: {
    gap: 10,
    // border: "black",
    // borderWidth: 1,
    // borderRadius: 15,
    // padding: 10,
    // marginBottom: 25,
  },

  textInput: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    backgroundColor: "lightyellow",
    color: "black",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  textInputBlocked: {
    color: "darkslategray",
    backgroundColor: "lightcyan",
  },

  textErrorContainer: {
    backgroundColor: "#FFCCCF",
    paddingTop: 7,
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginBottom: -25,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
  },

  textError: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.redColor,
  },
});
