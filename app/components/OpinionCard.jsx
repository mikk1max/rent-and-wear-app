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
import { db } from "../../firebase.config";

import fetchSVG, { fetchImgURL } from "../utils/fetchSVG";
import { G, SvgUri } from "react-native-svg";

import { globalStyles, styles as mainStyles } from "../utils/style";
// import { iconParams, styles } from "../styles/UserProfileViewStyles";
import { Divider, Rating } from "react-native-elements";

const OpinionCard = ({
  id,
  authorId,
  userId,
  rate,
  publicationDate,
  text,
  moderationStatus,
}) => {
  const [author, setAuthor] = useState([]);

  // Pobieranie autora opinii z bazy
  useEffect(() => {
    const authorRef = ref(db, `users/${authorId}`);
    const unsubscribe = onValue(
      authorRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAuthor({ authorId, ...data });
        } else {
          setAuthor(null);
        }
        // setLoading(false); // Ustawienie ładowania na false po zakończeniu pobierania
      },
      (error) => {
        console.error("Błąd podczas pobierania danych:", error);
        // setLoading(false); // Nawet w przypadku błędu przerywamy ładowanie
      }
    );

    return () => unsubscribe();
  }, [authorId]);

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

  let opinOnModerationStyle = styles.opinOnModeration;
  let opinOnModerationTextStyle = styles.opinOnModerationText;
  if (moderationStatus.code == 2) {
    opinOnModerationStyle = [styles.opinOnModeration, styles.opinBlocked];
    opinOnModerationTextStyle = [
      styles.opinOnModerationText,
      styles.opinBlockedText,
    ];
  }

  return moderationStatus.code == 1 ? (
    <View style={styles.opinion}>
      <View style={styles.opinAuthorNameWithPlate}>
        <Text style={styles.opinAuthorName}>
          {author.name} {author.surname}
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
  ) : moderationStatus.code != 1 && isAuthor ? (
    <View style={opinOnModerationStyle}>
      <Text style={opinOnModerationTextStyle}>{moderationStatus.messege}</Text>
      <View style={styles.opinion}>
        <View style={styles.opinAuthorNameWithPlate}>
          <Text style={styles.opinAuthorName}>
            {author.name} {author.surname}
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
    <></>
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

  opinBlocked: {
    backgroundColor: "lightpink",
  },

  opinOnModerationText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: "blue",
    marginLeft: 10,
  },

  opinBlockedText: {
    color: "red",
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
    // gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  opinAuthorName: {
    flexDirection: "column",
    flexWrap: "wrap",
    width: "70%",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
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
});
