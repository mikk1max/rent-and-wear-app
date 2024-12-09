import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

import { ref, onValue, update } from "firebase/database";
import { db } from "../../firebaseConfig";

import fetchSVG, { fetchImgURL } from "../utils/fetchSVG";
import { G, SvgUri } from "react-native-svg";

import { globalStyles, styles as mainStyles } from "../utils/style";
// import { iconParams, styles } from "../styles/UserProfileViewStyles";
import { Divider, Rating } from "react-native-elements";

const OpinionCard = ({
  id,
  authorId,
  userId,
  authorFirstName,
  authorLastName,
  rate,
  publicationDate,
  text,
  isOnModeration,
}) => {
  //////////////////////
  const displayedOpinionPublicationDate = new Date(
    publicationDate
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let isAuthor = false;
  if (authorId === userId) isAuthor = true;

  return isOnModeration ? (
    <View style={styles.opinOnModeration}>
      <Text style={styles.opinOnModerationText}>On Moderation...</Text>
      <View style={styles.opinion}>
        <View style={styles.opinAuthorNameWithPlate}>
          <Text style={styles.opinAuthorName}>
            {authorFirstName} {authorLastName}
          </Text>
          {isAuthor && <Text style={styles.opinPlate}>Your opinion</Text>}
        </View>
        <View style={styles.opinRateWithDate}>
          <Rating
            type={"custom"}
            style={styles.opinRate}
            imageSize={20}
            ratingColor={globalStyles.redColor}
            tintColor={globalStyles.secondaryColor}
            ratingBackgroundColor={globalStyles.primaryColor}
            startingValue={rate}
            readonly
          />
          <Text style={styles.opinDate}>{displayedOpinionPublicationDate}</Text>
        </View>
        <Text style={styles.opinText}>{text}</Text>
      </View>
    </View>
  ) : (
    <View style={styles.opinion}>
      <View style={styles.opinAuthorNameWithPlate}>
        <Text style={styles.opinAuthorName}>
          {authorFirstName} {authorLastName}
        </Text>
        {isAuthor && <Text style={styles.opinPlate}>Your opinion</Text>}
      </View>
      <View style={styles.opinRateWithDate}>
        <Rating
          type={"custom"}
          style={styles.opinRate}
          imageSize={20}
          ratingColor={globalStyles.redColor}
          tintColor={globalStyles.secondaryColor}
          ratingBackgroundColor={globalStyles.primaryColor}
          startingValue={rate}
          readonly
        />
        <Text style={styles.opinDate}>{displayedOpinionPublicationDate}</Text>
      </View>
      <Text style={styles.opinText}>{text}</Text>
    </View>
  );
};

export default OpinionCard;

const styles = StyleSheet.create({
  opinOnModeration: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    padding: 10,
    gap: 5,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: "lightblue",
  },

  opinOnModerationText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: "blue",
    marginLeft: 10,
  },

  opinion: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    padding: 10,
    gap: 5,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
  },

  opinAuthorNameWithPlate: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
    gap: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  opinAuthorName: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.accentColor,
  },

  opinPlate: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    padding: 5,
    borderRadius: globalStyles.BORDER_RADIUS,
    // alignSelf: "center",
    color: globalStyles.textOnPrimaryColor,
    backgroundColor: globalStyles.primaryColor,
  },

  opinRateWithDate: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
    justifyContent: "flex-start",
    // alignItems: "center",
    gap: 10,
  },

  opinRate: {},

  opinDate: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.primaryColor,
  },

  opinText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.textOnSecondaryColor,
  },

  displayNone: {
    display: "none",
  },
});
