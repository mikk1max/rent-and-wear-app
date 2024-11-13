import { StyleSheet, Dimensions } from "react-native";
import { globalStyles } from "../utils/style";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  statusContainer: {
    marginVertical: 20,
    maxWidth: width - 50,
  },
  productsContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  statusBtn: {
    padding: 10,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    marginRight: 10,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  activeStatusBtn: {
    backgroundColor: globalStyles.accentColor,
  },
  activeStatusText: {
    color: globalStyles.textOnAccentColor,
  },
  inactiveStatusText: {
    color: "white",
  },

  noItemsContainer: {},

  noItemsMessage: {
    marginTop: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    overflow: "hidden",
    backgroundColor: globalStyles.secondaryColor,
    padding: 10,
    color: globalStyles.textOnSecondaryColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  centeredButtonContainer: {
    flex: 1,
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
    color: globalStyles.accentColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    overflow: "hidden",
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
  },
});
