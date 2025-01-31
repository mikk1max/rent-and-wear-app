import { StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";

export const styles = StyleSheet.create({
  divider: {
    marginVertical: 10,
    width: "100%",
    height: 2,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  imagesContainer: {
    width: "100%",
    height: "auto",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
  },

  imagesLabel: {
    width: "50%",
    alignSelf: "center",
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
    marginTop: 10,
  },

  imagesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignContent: "center",
    gap: 10,
  },

  deleteImageButton: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    justifyContent: "center",
    alignItems: "center",
  },

  addImageIcon: {
    // backgroundColor: "red",
  },

  inputs: {
    width: "100%",
    height: "auto",
    // margin: 10,
    marginVertical: 10,
    gap: 10,
    // backgroundColor: "lightyellow"
  },

  inputContainer: {
    // flexDirection: "column",
    // flexWrap: "wrap",
    width: "100%",
    height: "auto",
    gap: 5,
  },

  inputLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  textInputError: {
    // width: "100%",
    // height: "auto",
    // marginLeft: "5%",
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 30,
    marginBottom: -30,
    borderRadius: globalStyles.BORDER_RADIUS,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.redColor,
    backgroundColor: "lightpink",
  },

  textInput: {
    // flexWrap: "wrap",
    // width: "100%",
    height: 50,
    // marginLeft: "5%",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
    backgroundColor: globalStyles.secondaryColor,
  },

  categoryListButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    padding: 10,
    // marginLeft: 1, // ?????????????
    backgroundColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  categoryListButtonTextWithIcon: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },

  categoryListButtonText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnPrimaryColor,
  },

  categoryListScroll: {
    // height: "25%",
    // flex: 1,
    // overflow: "hidden",
  },

  categoryList: {
    zIndex: -1,
    marginTop: -20,
    padding: 10,
    paddingTop: 25,
    // gap: 5,
    height: 200,
    // flex: 1,
    // overflow: "hidden",
    backgroundColor: globalStyles.secondaryColor,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
  },

  categoryListItemWithBorder: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    gap: 10,
    paddingBottom: 7,
    marginBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.textOnSecondaryColor,
  },

  categoryListItemWithoutBorder: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    gap: 10,
  },

  categoryListItemText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
    marginTop: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  createButton: {
    width: "50%",
    height: "auto",
    padding: 10,
    justifyContent: "center",
    // borderRadius: globalStyles.BORDER_RADIUS,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  createText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: globalStyles.textOnPrimaryColor,
  },

  cancelButton: {
    width: "50%",
    height: "auto",
    padding: 10,
    justifyContent: "center",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    // borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.redColor,
  },

  cancelText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: globalStyles.textOnRedColor,
  },

  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background with opacity
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
