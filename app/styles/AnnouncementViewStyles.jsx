import { StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";

export const styles = StyleSheet.create({
  mainSection: {
    flex: 1,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    padding: 20,
  },

  divider: {
    marginVertical: 10,
    width: "100%",
    height: 2,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  // annMainImage: {
  //   width: "100%",
  //   height: 200,
  //   // borderRadius: 15,
  //   borderTopLeftRadius: globalStyles.BORDER_RADIUS,
  //   borderTopRightRadius: globalStyles.BORDER_RADIUS,
  // },

  annSwiperContainer: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    overflow: "hidden",
  },

  annSwiper: {},

  annSlide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  annSlideImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  annImageFooter: {
    alignSelf: "center",
    marginBottom: 20,
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
    color: "white",
  },

  annDateWithTitle: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    // paddingTop: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingBottom: 10,
    padding: 10,
    marginTop: -15,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
    borderRadius: globalStyles.BORDER_RADIUS,

    backgroundColor: globalStyles.secondaryColor,
  },

  annTitle: {
    fontFamily: "WorkSans_900Black",
    fontSize: 22,
    color: globalStyles.accentColor,
  },

  annPublicationDateAndCategory: {
    fontFamily: "WorkSans_900Black",
    fontSize: 15,
    color: globalStyles.textOnSecondaryColor,
  },

  annPriceWithRating: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 10,
  },

  annPrice: {
    fontFamily: "WorkSans_900Black",
    fontSize: 20,
    color: globalStyles.primaryColor,
  },

  annRating: {
    alignSelf: "center",
  },

  annSizeWithCondition: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 10,
    gap: 10,
  },

  annSizes: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },

  annSizesLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    color: globalStyles.textOnSecondaryColor,
  },

  annSize: {
    fontFamily: "WorkSans_900Black",
    fontSize: 17,
    color: globalStyles.textOnPrimaryColor,
    backgroundColor: globalStyles.primaryColor,
    padding: 5,
    borderRadius: globalStyles.BORDER_RADIUS,
    width: 45,
    textAlign: "center",
  },

  annCondition: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },

  annConditionLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    color: globalStyles.textOnSecondaryColor,
  },

  annConditionValue: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    backgroundColor: globalStyles.primaryColor,
    color: globalStyles.textOnPrimaryColor,
    padding: 5,
    borderRadius: globalStyles.BORDER_RADIUS,
    textAlign: "center",
  },

  annDescription: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    // justifyContent: "space-between",
    // alignContent: "center",
    padding: 10,
    gap: 10,
  },

  annDescriptionLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    color: globalStyles.textOnSecondaryColor,
  },

  annDescriptionValue: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.textOnSecondaryColor,
  },

  advertiser: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    padding: 10,
    gap: 10,
  },

  advLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    color: globalStyles.textOnSecondaryColor,
  },

  advImageWithData: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
    justifyContent: "flex-start",
    gap: 20,
  },

  advImage: {
    width: 100,
    height: 100,
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  advData: {
    flexDirection: "column",
    width: "auto",
    height: "auto",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 10,
  },

  advName: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
  },

  advRating: {},

  advRegistrationDate: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.textOnSecondaryColor,
  },

  advRentAndWear: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
  },

  opinions: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    padding: 10,
    gap: 15,
  },

  opinLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    color: globalStyles.textOnSecondaryColor,
  },

  opinWriteOpinionButton: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
    justifyContent: "space-around",
    padding: 5,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  opinWriteOpinionButtonText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnAccentColor,
  },

  opinWriteOpinionButtonIcon: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnAccentColor,
  },

  opinList: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    gap: 10,
  },

  annBookRentButtons: {
    // flex: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    // padding: 10,
    marginTop: 10,
    justifyContent: "space-between",
  },

  annBookRentButton: {
    width: "45%",
    height: "auto",
    padding: 10,
    alignItems: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  annBookRentButtonText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnAccentColor,
  },
});
