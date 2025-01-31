import { StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  imageWithDateAndNumberContainer: {
    flexDirection: "row",
    overflow: "hidden",
    width: "100%",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  image: {
    width: "45%",
    height: "auto",
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  dateWithNumberContainer: {
    flexDirection: "column",
    width: "55%",
    padding: 10,
    gap: 10,
  },

  dateOrNumberTextLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: globalStyles.textOnPrimaryColor,
  },

  dateOrNumberTextValue: {
    paddingLeft: 5,
    fontFamily: "WorkSans_900Black",
    fontSize: 14,
    color: globalStyles.backgroundColor,
  },

  advertiserInfo: {
    zIndex: -1,
    flexDirection: "row",
    width: width - 50,
    flexWrap: "wrap",
    gap: 10,
    padding: 10,
    marginTop: -20,
    paddingTop: 25,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.textOnSecondaryColor,
  },

  advertiserLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  advertiserValue: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.backgroundColor,
  },

  advertiserButton: {
    borderRadius: globalStyles.BORDER_RADIUS,
    padding: 3,
    backgroundColor: globalStyles.accentColor,
  },

  statusContainer: {
    marginTop: 20,
  },

  statusLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  statusText: {
    padding: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.primaryColor,
  },

  detailsConstainer: {
    marginTop: 20,
  },

  detailsLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
    marginBottom: 15,
  },

  detailsValue: {
    width: "100%",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
    padding: 10,
  },

  divider: {
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  detailsTextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    alignItems: "center",
  },

  detailsTextLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.primaryColor,
  },

  detailsTextValue: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.textOnSecondaryColor,
  },

  detailsTextValueTrackingCode: {
    fontFamily: "WorkSans_900Black",
    fontSize: 15,
    color: globalStyles.textOnAccentColor,
    backgroundColor: globalStyles.accentColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    padding: 5,
  },

  barcodeBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  barcodeContainer: {
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    padding: 10,
  },

  barcodeLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 20,
    color: globalStyles.primaryColor,
    textAlign: "center",
  },

  opinionContainer: {
    marginTop: 10,
  },

  writeOpinionButton: {
    width: "100%",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  writeOpinionLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  writeOpinionText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnAccentColor,
  },

  opinionFormContainer: {
    zIndex: -1,
    width: "100%",
    padding: 10,
    marginTop: -20,
    paddingTop: 30,
    gap: 10,
    backgroundColor: globalStyles.secondaryColor,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
  },

  opinionRating: {
    width: "70%",
    padding: 5,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.backgroundColor,
    borderColor: globalStyles.primaryColor,
    borderWidth: 0.5,
  },

  opinionInput: {
    width: width - 70,
    height: "auto",
    minHeight: 70,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.backgroundColor,
    color: globalStyles.primaryColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },

  sendOpinionButton: {
    width: "50%",
    alignSelf: "flex-end",
    alignItems: "center",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  sendOpinionText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  acceptRentButton: {
    width: "100%",
    padding: 10,
    marginTop: 20,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  acceptRentText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    textAlign: "center",
    color: globalStyles.textOnAccentColor,
  },

  generateTrackingNumberButton: {
    width: "100%",
    padding: 10,
    marginTop: 20,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  generateTrackingNumberText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    textAlign: "center",
    color: globalStyles.textOnPrimaryColor,
  },

  trackingNumberButton: {
    width: "100%",
    marginTop: 20,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
    borderWidth: 0.5,
    borderColor: globalStyles.primaryColor,
  },

  trackingNumberText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    textAlign: "center",
    color: globalStyles.primaryColor,
  },

  confirmShippingButton: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  confirmShippingText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  confirmDeliveryButton: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  confirmDeliveryText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },
});
