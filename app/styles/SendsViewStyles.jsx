import { StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  statusContainer: {
    borderRadius: globalStyles.BORDER_RADIUS,
    overflow: "hidden",
    marginVertical: 20,
    marginHorizontal: 25,
  },

  statusScrollView: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
    gap: 10,
  },

  statusButton: {
    padding: 10,
    backgroundColor: globalStyles.secondaryColor,
    borderWidth: 1,
    borderColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  statusButtonActive: {
    backgroundColor: globalStyles.primaryColor,
  },

  statusTextActive: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.textOnPrimaryColor,
  },

  statusTextInactive: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.primaryColor,
  },

  rentsAndReservationsContainer: {
    width: width - 50,
    gap: 20,
  },

  rentOrReservationComponent: {
    borderRadius: globalStyles.BORDER_RADIUS,
    overflow: "hidden",
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
  },

  rentOrReservationImage: {
    height: 150,
    width: "100%",
  },

  rentOrReservationData: {
    padding: 10,
    gap: 10,
    backgroundColor: globalStyles.secondaryColor,
  },

  rentOrReservationText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  rentOrReservationDivider: {
    borderWidth: 1,
    borderColor: globalStyles.textOnSecondaryColor,
  },

  rentOrReservationButton: {
    padding: 10,
    backgroundColor: globalStyles.primaryColor,
  },

  rentOrReservationButtonText: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  noItemsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 100,
    width: width - 50,
  },

  noItemsMessage: {
    borderRadius: globalStyles.BORDER_RADIUS,
    overflow: "hidden",
    backgroundColor: globalStyles.secondaryColor,
    padding: 10,
    color: globalStyles.textOnSecondaryColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  centeredButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noItemsBox: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noItemsBtn: {
    padding: 10,
    color: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    overflow: "hidden",
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
    textAlign: "center",
  },
});
