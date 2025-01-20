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

const GetDetailsView = ({ route }) => {
  const navigation = useNavigation();

  const { user, setUser } = useUser();

  const [currentRentOrReservation, setCurrentRentOrReservation] =
    useState(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [currentAdvertiser, setCurrentAdvertiser] = useState(null);

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const { id } = route.params;

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

  useEffect(() => {
    const fetchDetails = async () => {
      const announcementsRef = ref(db, "announcements");
      const usersRef = ref(db, "users");

      try {
        // Загрузка всех объявлений
        const announcementsSnapshot = await get(announcementsRef);
        if (!announcementsSnapshot.exists()) {
          console.log("Announcements not found");
          return;
        }
        const announcements = announcementsSnapshot.val();

        let foundRentOrReservation = null;
        let foundAnnouncement = null;

        // Ищем `id` в rentalData и reservationData
        for (const announcementId in announcements) {
          const announcement = announcements[announcementId];
          const rentalData = announcement.rentalData || {};
          const reservationData = announcement.reservationData || {};

          if (rentalData[id]) {
            foundRentOrReservation = { ...rentalData[id], id };
            foundAnnouncement = announcement;
            break;
          }
          if (reservationData[id]) {
            foundRentOrReservation = { ...reservationData[id], id };
            foundAnnouncement = announcement;
            break;
          }
        }

        if (!foundRentOrReservation || !foundAnnouncement) {
          console.log("No matching rental or reservation found");
          return;
        }

        setCurrentRentOrReservation(foundRentOrReservation);

        const { category, condition, images, pricePerDay, publicationDate, rating, size, title, advertiserId } = foundAnnouncement;
        setCurrentAnnouncement({
          category,
          condition,
          image: images?.[0] || null,
          pricePerDay,
          publicationDate,
          rating,
          size,
          title,
        });

        console.log("Found announcement:", foundAnnouncement);

        // Загружаем пользователя по `advertiserId`
        const advertiserSnapshot = await get(ref(usersRef, advertiserId));
        if (!advertiserSnapshot.exists()) {
          console.log("Advertiser not found");
          return;
        }
        const advertiser = advertiserSnapshot.val();
        setCurrentAdvertiser({ ...advertiser, id: advertiserId });

        console.log("Advertiser data:", advertiser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);


  // console.log(currentRentOrReservation);
  // console.log(currentAnnouncement);
  // console.log(currentAdvertiser);

  return (
    <View>
      <Text>GetDetailsView</Text>
    </View>
  );
};

export default GetDetailsView;

const styles = StyleSheet.create({});
