import { StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  datePickerContainer: {
    width: "100%",
    height: "auto",
    padding: 10,
    gap: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
  },

  datePickerPreviousTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    width: 70,
    padding: 5,
    textAlign: "center",
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    color: globalStyles.textOnPrimaryColor,
    backgroundColor: globalStyles.primaryColor,
  },

  datePickerNextTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    width: 70,
    padding: 5,
    textAlign: "center",
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    color: globalStyles.textOnPrimaryColor,
    backgroundColor: globalStyles.primaryColor,
  },

  datePickerSelectedDayTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnAccentColor,
  },

  datePickerSelectedRangeStartTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnAccentColor,
  },

  datePickerSelectedRangeEndTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnAccentColor,
  },

  datePickerSelectedRangeStartStyle: {
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  datePickerSelectedRangeEndStyle: {
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  datePickerSelectedRangeStyle: {
    backgroundColor: globalStyles.accentColor,
  },

  datePickerDisabledDatesTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "gray",
  },

  datePickerTodayTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },

  datePickerTextStyle: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  datePickerDayLabelsWrapper: {
    borderColor: globalStyles.primaryColor,
  },

  datePickerMonthTitleStyle: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  datePickerYearTitleStyle: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  selectedDatesContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  unavailableDate: {
    borderRadius: 5,
    backgroundColor: globalStyles.redColor,
  },

  unavailableDateText: {
    color: globalStyles.textOnRedColor,
  },

  dateDivider: {
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderColor: globalStyles.primaryColor,
  },

  dateResulText: {
    paddingHorizontal: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  dateResetButton: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  dateResetText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  rentalOptionContainer: {
    marginTop: 10,
    gap: 10,
  },

  rentalOptionLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  rentalOptionRentItNowDescription: {
    paddingHorizontal: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  rentalOptionBookItDescription: {
    paddingHorizontal: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  rentalOptionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rentalOptionRentItNowButtonActive: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  rentalOptionRentItNowButtonNotActive: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
  },

  rentalOptionRentItNowTextActive: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  rentalOptionRentItNowTextNotActive: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
  },

  rentalOptionBookItButtonActive: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  rentalOptionBookItButtonNotActive: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
  },

  rentalOptionBookItTextActive: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  rentalOptionBookItTextNotActive: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
  },

  rentalOptionBookItDisabled: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnRedColor,
    color: globalStyles.primaryColor,
  },

  nextStepButton: {
    marginTop: 20,
    width: "100%",
    padding: 10,
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  nextStepText: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnAccentColor,
  },

  addressContainer: {
    marginTop: 10,
    gap: 10,
  },

  addressLabelWithReset: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  addressLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  addressResetButton: {
    padding: 5,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  addressResetText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnPrimaryColor,
  },

  addressListButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  addressListText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnPrimaryColor,
  },

  addressList: {
    zIndex: -1,
    marginTop: -20,
    padding: 10,
    paddingTop: 20,
    height: "auto",
    backgroundColor: globalStyles.secondaryColor,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
  },

  addressListScroll: {},

  addressListItemWithoutBorder: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    gap: 10,
  },

  addressListItemWithBorder: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    gap: 10,
    paddingBottom: 7,
    marginBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.textOnSecondaryColor,
  },

  addressListItemText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  addressOrText: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  addressCreateAnAddressButton: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  addressCreateAnAddressText: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  selectedAddressContainer: {
    zIndex: -1,
    marginTop: -20,
    padding: 10,
    paddingTop: 20,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
  },

  selectedAddressTextWithIcon: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },

  selectedAddressText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnSecondaryColor,
  },

  paymentContainer: {
    marginTop: 10,
    gap: 10,
  },

  paymentLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  paymentMethodButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  paymentMethodCardButtonSelected: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  paymentMethodCardButtonNotSelected: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
  },

  paymentMethodCardTextSelected: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  paymentMethodCardTextNotSelected: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
  },

  paymentMethodBLIKButtonSelected: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  paymentMethodBLIKButtonNotSelected: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
  },

  paymentMethodBLIKTextSelected: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  paymentMethodBLIKTextNotSelected: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
  },

  paymentCardContainer: {
    zIndex: -1,
    marginTop: -25,
    padding: 10,
    paddingTop: 30,
    gap: 10,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
  },

  paymentCardView: {
    alignSelf: "center",
  },

  paymentCardInput: {
    width: "100%",
    borderWidth: 0.5,
    borderRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
    color: globalStyles.primaryColor,
  },

  paymentCardInputText: {
    color: globalStyles.primaryColor,
  },

  paymentCardInfo: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    gap: 10,
    alignItems: "center",
  },

  paymentCardInfoText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  paymentBLIKContainer: {
    zIndex: -1,
    marginTop: -25,
    padding: 10,
    paddingTop: 30,
    gap: 10,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
  },

  paymentBLIKError: {
    width: "100%",
    marginBottom: -20,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.redColor,
    backgroundColor: globalStyles.textOnRedColor,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
  },

  paymentBLIKTextInput: {
    width: "100%",
    padding: 10,
    borderWidth: 0.5,
    borderRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  finishContainer: {
    marginTop: 20,
  },

  finishButton: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  finishText: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnAccentColor,
  },

  finishProgress: {},

  finishProgressText: {
    zIndex: -1,
    marginTop: -25,
    padding: 10,
    paddingTop: 30,
    gap: 10,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderWidth: 2,
    borderColor: globalStyles.accentColor,
    backgroundColor: globalStyles.textOnAccentColor,
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.accentColor,
  },
});
