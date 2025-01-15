import { Dimensions, StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  chatCard: {
    backgroundColor: globalStyles.secondaryColor, // Use a light background for visibility
    padding: 15,
    marginBottom: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    width: width - 50,
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
    backgroundColor: globalStyles.accentColor,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
