import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Alert } from "react-native";
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import SearchBar from "../components/SearchBar";
import Swiper from "../components/Swiper";
import IconButton from "../components/IconButton";
import { useCustomFonts } from "../utils/fonts";
import ProductCard from "../components/ProductCard";

import { styles as mainStyles } from "../utils/style";
import { styles } from "../styles/RentNowViewStyles";

import { ref, onValue, update, get, set, remove } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const RentNowView = () => {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Ikonki do kategorii
  const icons = ["t-shirt", "dress", "shorts", "coat", "sneakers"];

  // Pobieranie bieżącego użytkownika
  const { user, setUser } = useUser();
  useEffect(() => {
    if (!user) return;

    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const currentUser = Object.values(data).find(
          (userData) => userData.email === user.email
        );
        setUser(currentUser || null);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const [announcementPreviews, setAnnouncementPreviews] = useState([[]]);
  useEffect(() => {
    const announcementsRef = ref(db, `announcements`);
    const unsubscribe = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const announcementPreviewsArray = Object.keys(data).map((key) => ({
          id: key,
          mainImage: data[key].mainImage,
          title: data[key].title,
          pricePerDay: data[key].pricePerDay,
          advertiserId: data[key].advertiserId,
          // ...data[key],
        }));
        setAnnouncementPreviews(announcementPreviewsArray);
      } else {
        setAnnouncementPreviews([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeIcon, setActiveIcon] = useState(null);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const getFilteredAnnouncements = (searchQuery) => {
    return announcementPreviews.filter((announcementPreview) =>
      String(announcementPreview.title)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };

  const filteredAnnouncements = getFilteredAnnouncements(searchQuery);

  const handleButtonPress = (iconName) => {
    setActiveIcon((prev) => {
      const newActiveIcon = prev === iconName ? null : iconName;
      console.log(
        `${
          newActiveIcon
            ? `${iconName} button pressed`
            : `${iconName} button unpressed`
        }`
      );
      return newActiveIcon;
    });
  };

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to go back?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View style={mainStyles.container}>
        <SearchBar onSearch={handleSearch} />
        <View
          style={[
            mainStyles.scrollBase,
            {
              marginTop: Platform.OS === "android" ? 15 : 20,
              marginVertical: Platform.OS === "ios" ? 20 : 0,
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Swiper style={{ height: 200 }} />

            <View style={styles.categoryContainer}>
              <Text style={styles.titleCategory}>Category</Text>
              <TouchableOpacity>
                <Text style={styles.allCategoriesTextBtn}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              {icons.map((iconName) => (
                <IconButton
                  key={iconName}
                  iconName={iconName}
                  onPress={() => handleButtonPress(iconName)}
                  containerWidth={width - 60}
                  isActive={activeIcon === iconName}
                />
              ))}
            </View>

            <View style={styles.announcementsContainer}>
              {filteredAnnouncements.map((announcementPreview) => (
                <ProductCard
                  key={"ProductCard_" + announcementPreview.id}
                  id={announcementPreview.id}
                  mainImage={announcementPreview.mainImage}
                  title={announcementPreview.title}
                  pricePerDay={announcementPreview.pricePerDay}
                  currentUserId={user != null ? user.id : "guest"}
                  advertiserId={announcementPreview.advertiserId}
                  containerWidth={width - 60}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RentNowView;
