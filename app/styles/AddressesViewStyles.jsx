import { StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";

export const styles = StyleSheet.create({
  addresses: {
    gap: 15,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // lekko przyciemnione tło,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  modalCard: {
    width: "100%",
    paddingHorizontal: 25,
    height: "85%",
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    alignItems: "center",
    backgroundColor: globalStyles.backgroundColor,
  },
  modalCardMini: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 25,
    borderRadius: globalStyles.BORDER_RADIUS,
    alignItems: "center",
    backgroundColor: globalStyles.backgroundColor,
    justifyContent: "center",
    gap: 15,
  },

  modalFormTitle: {
    fontFamily: "WorkSans_900Black",
    fontSize: 22,
    color: globalStyles.primaryColor,
  },

  modalDivider: {
    marginVertical: 10,
    height: 2,
    backgroundColor: globalStyles.primaryColor,
  },

  modalInputContainer: {
    gap: 5,
    marginBottom: 10,
  },

  modalLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
  },

  modalTextInput: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.primaryColor,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    padding: 10,
  },

  modalTextError: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.redColor,
    backgroundColor: "#FFCCCF",
    paddingTop: 7,
    paddingHorizontal: 10,
    paddingBottom: 22,
    marginBottom: -25,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
  },

  modalButtons: {
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modalSaveButton: {
    width: "50%",
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
    padding: 7,
    alignItems: "center",
  },

  modalCancelButton: {
    width: "50%",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.redColor,
    padding: 7,
    alignItems: "center",
  },

  modalButtonText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnPrimaryColor,
  },

  addressesWithButton: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 15,
  },

  newAddressButton: {
    backgroundColor: globalStyles.primaryColor,
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  newAddressButtonText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.textOnPrimaryColor,
  },

  modalDeleteButton: {
    width: "50%",
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.redColor,
    padding: 7,
    justifyContent: "center",
    alignItems: "center",
  },

  modalRejectButton: {
    width: "50%",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.redColor,
    borderWidth: 3,
    padding: 7,
    backgroundColor: globalStyles.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
});
