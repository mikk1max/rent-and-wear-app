import React, { useState, useEffect } from "react";
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { Divider } from "react-native-elements";

import { ref, onValue, get } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";

import Icon from "../components/Icon";

import * as Progress from "react-native-progress";
import { useTranslation } from "react-i18next";

import { styles } from "../styles/GetsViewStyles";

const { width } = Dimensions.get("window");

const GetsView = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user } = useUser();

  const [currentRentsAndReservations, setCurrentRentsAndReservations] =
    useState([]);
  const [statuses, setStatuses] = useState([[]]);
  const [activeStatus, setActiveStatus] = useState("All");

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  useEffect(() => {
    const statusesRef = ref(db, `statuses`);
    const unsubscribe = onValue(
      statusesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const statusesArray = Object.keys(data).map((key) => ({
            id: key,
            statusName: data[key].statusName,
            statusCode: data[key].statusCode,
          }));
          setStatuses(statusesArray);
        } else {
          setStatuses([]);
        }
      },
      (error) => {
        console.error("Firebase error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCurrentRentsAndReservations = async () => {
      const announcementsRef = ref(db, "announcements");

      try {
        const announcementsSnapshot = await get(announcementsRef);
        if (!announcementsSnapshot.exists()) {
          console.log("Announcements data not found");
          return;
        }
        const announcements = announcementsSnapshot.val();

        const rentalOrReservationData = user.rentalOrReservationData || {};
        const results = [];

        for (const rentalOrReservationId in rentalOrReservationData) {
          const { announcementId, type } =
            rentalOrReservationData[rentalOrReservationId];
          const announcement = announcements[announcementId];

          if (!announcement) {
            console.log(`Announcement with ID ${announcementId} not found`);
            continue;
          }

          const dataKey = type === "Rent" ? "rentalData" : "reservationData";
          const data = announcement[dataKey]?.[rentalOrReservationId];

          if (!data) {
            console.log(
              `Data with ID ${rentalOrReservationId} not found in ${dataKey}`
            );
            continue;
          }

          results.push({
            id: rentalOrReservationId,
            announcementId,
            amount: data.amount,
            daysInRent: data.daysInRent,
            status: data.status,
            image: announcement.images?.[0] || null,
            announcementTitle: announcement.title,
          });
        }

        setCurrentRentsAndReservations(results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCurrentRentsAndReservations();
  }, [user]);

  const filteredRentsAndReservations = currentRentsAndReservations.filter(
    (rentOrReservation) =>
      activeStatus === statuses[0].statusName ||
      rentOrReservation.status.statusName === activeStatus
  );

  const returnProgressValue = (statusCode) => {
    if (statusCode === 8) {
      return 1;
    } else {
      return statusCode / 7;
    }
  };

  const returnProgressColor = (statusCode) => {
    if (statusCode === 8) {
      return globalStyles.redColor;
    } else if (statusCode === 7) {
      return "green";
    } else {
      return globalStyles.accentColor;
    }
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <StatusBar backgroundColor={globalStyles.primaryColor} barStyle="light-content" />
      <View style={styles.statusContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.statusScrollView}>
            {statuses.map((status) => (
              <TouchableOpacity
                key={`GetsView_StatusScroll_${status.statusCode}`}
                style={[
                  styles.statusButton,
                  activeStatus === status.statusName &&
                    styles.statusButtonActive,
                ]}
                onPress={() =>
                  setActiveStatus((prevStatus) =>
                    prevStatus == status.statusName
                      ? statuses[0].statusName
                      : status.statusName
                  )
                }
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Text
                  style={
                    activeStatus === status.statusName
                      ? styles.statusTextActive
                      : styles.statusTextInactive
                  }
                >
                  {t(`statusNames.${status.statusName}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={[mainStyles.container, mainStyles.scrollBase]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={mainStyles.scrollBase}
        >
          <View style={styles.rentsAndReservationsContainer}>
            {filteredRentsAndReservations.length > 0 &&
              filteredRentsAndReservations.map((rentOrReservation) => (
                <View
                  key={rentOrReservation.id}
                  style={styles.rentOrReservationComponent}
                >
                  <Image
                    source={{ uri: rentOrReservation.image }}
                    style={styles.rentOrReservationImage}
                  />
                  <View style={styles.rentOrReservationData}>
                    <Text style={styles.rentOrReservationText}>
                      {rentOrReservation.announcementTitle}
                    </Text>
                    <Divider style={styles.rentOrReservationDivider} />
                    <Text style={styles.rentOrReservationText}>{`$${
                      rentOrReservation.amount
                    } ${t("sendsGets.for")} ${rentOrReservation.daysInRent}${t(
                      "sendsGets.day"
                    )}`}</Text>
                    <Divider style={styles.rentOrReservationDivider} />
                    <Text style={styles.rentOrReservationText}>{`Status: ${t(
                      `statusNames.${
                        rentOrReservation?.status?.statusName ||
                        t("statusNames.Error")
                      }`
                    )}`}</Text>
                    <Progress.Bar
                      progress={returnProgressValue(
                        rentOrReservation.status.statusCode
                      )}
                      height={20}
                      width={width - 50 - 10}
                      color={returnProgressColor(
                        rentOrReservation.status.statusCode
                      )}
                      borderColor={globalStyles.primaryColor}
                      unfilledColor={globalStyles.textOnPrimaryColor}
                      borderRadius={globalStyles.BORDER_RADIUS}
                      style={{ alignSelf: "center" }}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.rentOrReservationButton}
                    onPress={() =>
                      navigation.navigate("GetDetailsView", {
                        id: rentOrReservation.id,
                      })
                    }
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
                  >
                    <Text style={styles.rentOrReservationButtonText}>
                      {t("sendsGets.details")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

            {filteredRentsAndReservations.length === 0 && (
              <View style={styles.noItemsContainer}>
                <Text style={styles.noItemsMessage}>
                  {t("sendsGets.noItemsMessage")}
                </Text>
                <View style={styles.centeredButtonContainer}>
                  <TouchableOpacity
                    style={styles.noItemsBox}
                    onPress={() =>
                      navigation.navigate("MainApp", { screen: "RentNow" })
                    }
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
                  >
                    <Icon
                      name="open-box"
                      width={150}
                      height={150}
                      fillColor={globalStyles.primaryColor}
                    />
                    <Text style={styles.noItemsBtn}>
                      {t("sendsGets.NoItems")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default GetsView;
