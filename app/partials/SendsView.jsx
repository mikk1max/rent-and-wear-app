import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

// import fetchSVG, { fetchImgURL } from "../utils/fetchSVG";
import { G, SvgUri } from "react-native-svg";

import { globalStyles, styles as mainStyles } from "../utils/style";
// import { iconParams, styles } from "../styles/AnnouncementViewStyles";
import { Divider, Rating } from "react-native-elements";
import OpinionCard from "../components/OpinionCard";
import Swiper from "react-native-swiper";
import ImageViewing from "react-native-image-viewing";

import {
  ref,
  onValue,
  update,
  get,
  set,
  remove,
  goOnline,
} from "firebase/database";
import { db, storage } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

import {
  fetchSvgURL,
  fetchImgURL,
  getRandomAvatarUrl,
} from "../utils/fetchSVG";

import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "../components/Icon";

import CalendarPicker from "react-native-calendar-picker";

import {
  CreditCardView,
  CreditCardInput,
  LiteCreditCardInput,
  CreditCardFormData,
  CreditCardFormField,
  ValidationState,
} from "react-native-credit-card-input";
import { color } from "react-native-elements/dist/helpers";

import * as Progress from "react-native-progress";
// import { statusCodes } from "@react-native-google-signin/google-signin";

const { height } = Dimensions.get("window");

const SendsView = () => {
  const navigation = useNavigation();

  const { user, setUser } = useUser();

  const [currentRentsAndReservations, setCurrentRentsAndReservations] =
    useState([]);
  const [statuses, setStatuses] = useState([[]]);
  const [activeStatus, setActiveStatus] = useState("All");

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Pobieranie bieżącego użytkownika
  useEffect(() => {
    if (!user) return;

    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const currentUserEntry = Object.entries(data).find(
          ([key, userData]) => userData.email === user.email
        );

        if (currentUserEntry) {
          const [key, userData] = currentUserEntry;
          setUser({ ...userData, id: key }); // Dodaj klucz jako "id"
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Pobieranie statusów
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

  // Pobieranie wszystkich wypożyczeń i rezerwacji nalezących do użytkownika
  useEffect(() => {
    const fetchCurrentRentsAndReservations = async () => {
      const announcementsRef = ref(db, "announcements");

      try {
        // Получаем данные из announcements
        const announcementsSnapshot = await get(announcementsRef);
        if (!announcementsSnapshot.exists()) {
          console.log("Announcements data not found");
          return;
        }
        const announcements = announcementsSnapshot.val();

        const rentalOrReservationData = user.imRenting || {};
        const results = [];

        // Перебираем rentalOrReservationData
        for (const rentalOrReservationId in rentalOrReservationData) {
          const { announcementId, type } =
            rentalOrReservationData[rentalOrReservationId];
          const announcement = announcements[announcementId];

          if (!announcement) {
            console.log(`Announcement with ID ${announcementId} not found`);
            continue;
          }

          // Определяем, из какого объекта берем данные: rentalData или reservationData
          const dataKey = type === "Rent" ? "rentalData" : "reservationData";
          const data = announcement[dataKey]?.[rentalOrReservationId];

          if (!data) {
            console.log(
              `Data with ID ${rentalOrReservationId} not found in ${dataKey}`
            );
            continue;
          }

          // Формируем объект для массива
          results.push({
            id: rentalOrReservationId,
            announcementId,
            amount: data.amount,
            daysInRent: data.daysInRent,
            status: data.status,
            image: announcement.images?.[0] || null, // Берем первый элемент из массива images
            announcementTitle: announcement.title,
          });
        }

        // Сохраняем результат в состоянии
        setCurrentRentsAndReservations(results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Вызываем функцию загрузки данных
    fetchCurrentRentsAndReservations();
  }, [user]); // Обновляем данные, если изменится user

  const filteredRentsAndReservations = currentRentsAndReservations.filter(
    (rentOrReservation) =>
      activeStatus === "All" ||
      rentOrReservation.status.statusName === activeStatus
  );

  // console.log(currentRentsAndReservations);
  // console.log(statuses);

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View style={styles.statusContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statusScroll}
        >
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
                    prevStatus == status.statusName ? "All" : status.statusName
                  )
                }
              >
                <Text
                  style={
                    activeStatus === status.statusName
                      ? styles.statusTextActive
                      : styles.statusTextInactive
                  }
                >
                  {status.statusName}
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
          {/* <View style={[mainStyles.scrollBase, styles.statusContainer]}> */}

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
                    <Text
                      style={styles.rentOrReservationText}
                    >{`$${rentOrReservation.amount} for ${rentOrReservation.daysInRent} days`}</Text>
                    <Divider style={styles.rentOrReservationDivider} />
                    <Text
                      style={styles.rentOrReservationText}
                    >{`Status: ${rentOrReservation.status.statusName}`}</Text>
                    <Progress.Bar
                      progress={rentOrReservation.status.statusCode / 8}
                      height={20}
                      width={330}
                      color={globalStyles.accentColor}
                      borderColor={globalStyles.primaryColor}
                      unfilledColor={globalStyles.textOnPrimaryColor}
                      // borderWidth={2}
                      borderRadius={globalStyles.BORDER_RADIUS}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.rentOrReservationButton}
                    onPress={() =>
                      navigation.navigate("SendDetailsView", {
                        id: rentOrReservation.id,
                      })
                    }
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
                  >
                    <Text style={styles.rentOrReservationButtonText}>
                      Details
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

            {filteredRentsAndReservations.length === 0 && (
              <View style={styles.noItemsContainer}>
                <Text style={styles.noItemsMessage}>
                  No sends found! Please check your filters.
                </Text>
                <View style={styles.centeredButtonContainer}>
                  <TouchableOpacity
                    style={styles.noItemsBox}
                    onPress={() =>
                      navigation.navigate("MainApp", { screen: "RentOut" })
                    }
                  >
                    <Icon
                      name="open-box"
                      width={150}
                      height={150}
                      fillColor={globalStyles.primaryColor}
                    />
                    <Text style={styles.noItemsBtn}>No items found</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* <Image
              source={{ uri: currentRentsAndReservations[0]?.image }}
              style={{ width: 500, height: 500 }}
            /> */}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>

    // "@react-native-google-signin/google-signin": "^13.1.0",
  );
};

export default SendsView;

const styles = StyleSheet.create({
  statusContainer: {
    borderRadius: globalStyles.BORDER_RADIUS,
    overflow: "hidden",
    marginVertical: 20,
    marginHorizontal: 25,
  },

  statusScroll: {
    // overflow: "hidden"
  },

  statusScrollView: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
    gap: 10,
    // borderRadius: globalStyles.BORDER_RADIUS,
    // backgroundColor: "red"
    // overflow: "hidden",
  },

  statusButton: {
    padding: 10,
    backgroundColor: globalStyles.secondaryColor,
    borderWidth: 1,
    borderColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    // marginRight: 10,
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
    flexDirection: "column",
    width: "100%",
    height: "auto",
    justifyContent: "center",
    // marginTop: 20,
    gap: 20,
    marginBottom: 50,
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
    // textAlign: "center",
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
    // height: height/2
  },

  noItemsMessage: {
    // marginTop: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    overflow: "hidden",
    backgroundColor: globalStyles.secondaryColor,
    padding: 10,
    color: globalStyles.textOnSecondaryColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  centeredButtonContainer: {
    // flex: 1,
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
  },
});
