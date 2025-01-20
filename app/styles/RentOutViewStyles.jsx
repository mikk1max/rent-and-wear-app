import { StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";

export const styles = StyleSheet.create({
  categoryContainer: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  titleCategory: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
    backgroundColor: "transparent",
  },
  allCategoriesTextBtn: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: globalStyles.textOnSecondaryColor,
  },
  announcementsContainer: {
    // flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    // gap: 15,
    rowGap: 35,
    columnGap: 15,
    marginTop: 15,
  },
  announcementsContainerIfOne: {},
  announcementsContainerIfNone: {},

  createAnnouncementButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    zIndex: 10,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },
  createAnnouncementText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 20,
    color: globalStyles.textOnPrimaryColor,
  },
});
