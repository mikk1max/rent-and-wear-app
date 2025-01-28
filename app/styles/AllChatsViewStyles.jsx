import { Dimensions, StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  chatCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: globalStyles.secondaryColor, // Use a light background for visibility
    padding: 15,
    marginBottom: 10,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    width: width - 50 - 60,
    gap: 5
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: globalStyles.textOnSecondaryColor,
    marginBottom: 5,
  },
  chatPreview: {
    fontSize: 14,
    color: "#777", // Lighter color for preview text
    marginTop: 5,
  },
  noChatsText: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    marginTop: 30,
  },

  filterButtonsContainer: {
    flexDirection: "row",
    marginVertical: 20,
    width: "100%",
    gap: 10,
  },
  filterButton: {
    padding: 10,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    width: (width - 50 - 20) / 3,
    justifyContent: "center",
    alignItems: "center",
  },
  activeFilterButton: {
    backgroundColor: globalStyles.primaryColor,
  },
  filterButtonText: {
    color: globalStyles.textOnSecondaryColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  activeFilterButtonText: {
    color: globalStyles.textOnPrimaryColor,
    fontSize: 16,
    fontWeight: "bold",
  }
});
