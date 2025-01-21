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
  RefreshControl,
  StyleSheet,
} from "react-native";
import SearchBar from "../components/SearchBar";
import Swiper from "../components/Swiper";
import IconButton from "../components/IconButton";
import { useCustomFonts } from "../utils/fonts";
import ProductCard from "../components/ProductCard";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { styles } from "../styles/RentOutViewStyles";

import { ref, onValue, update, get, set, remove } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import { useNavigation } from "@react-navigation/native";

import Icon from "../components/Icon";
import NoAnnouncementsYet from "../components/NoAnnouncementsYet";

// Get the screen dimensions
const { width } = Dimensions.get("window");

export default function RentOutView() {
  const navigation = useNavigation();

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Pobieranie bieżącego użytkownika
  const { user, setUser } = useUser();
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

  const [announcementPreviews, setAnnouncementPreviews] = useState([[]]);
  useEffect(() => {
    const announcementsRef = ref(db, `announcements`);
    const unsubscribe = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        console.warn("No announcements found");
        setAnnouncementPreviews([]);
        return;
      }
    
      const announcementPreviewsArray = Object.keys(data)
        .filter((key) => data[key]?.advertiserId === user?.id)
        .map((key) => ({
          id: key,
          mainImage: data[key]?.images?.[0] || "default_image_url",
          title: data[key]?.title || "Untitled",
          category: data[key]?.category || { subcategoryName: "Unknown" },
          pricePerDay: data[key]?.pricePerDay || 0,
          advertiserId: data[key]?.advertiserId || null,
        }));
      setAnnouncementPreviews(announcementPreviewsArray);
    });
    

    return () => unsubscribe();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const getFilteredAnnouncements = (searchQuery) => {
    return announcementPreviews.filter((announcementPreview) =>
      announcementPreview?.title &&
      announcementPreview.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredAnnouncements = getFilteredAnnouncements(searchQuery);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh data
      setReloadKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View
        style={[
          mainStyles.container,
          { marginTop: Platform.OS === "android" ? 15 : 0 },
        ]}
        key={reloadKey}
      >
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={mainStyles.scrollBase}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.announcementsContainer}>
              {filteredAnnouncements &&
                filteredAnnouncements?.map((announcementPreview) => {
                  if (!announcementPreview.category) {
                    console.warn(
                      `Ogłoszenie ${announcementPreview.id} nie ma kategorii`
                    );
                    return null;
                  }
                  
                  return (
                    <ProductCard
                      key={"RentOutView_ProductCard_" + announcementPreview.id}
                      id={announcementPreview.id}
                      mainImage={
                        announcementPreview.mainImage || "default_image_url"
                      }
                      title={announcementPreview.title}
                      categoryName={
                        announcementPreview?.category?.subcategoryName ||
                        "Unknown"
                      }
                      categoryIcon={
                        announcementPreview?.category?.subcategoryIcon ||
                        "default_icon"
                      }
                      pricePerDay={announcementPreview.pricePerDay}
                      currentUserId={user?.id}
                      advertiserId={announcementPreview.advertiserId}
                      cardWidth={
                        filteredAnnouncements.length === 1
                          ? width - 50
                          : (width - 50 - 15) / 2
                      }
                    />
                  );
                })}
            </View>
            {filteredAnnouncements.length <= 0 && <NoAnnouncementsYet />}
          </ScrollView>
        </View>
        <TouchableOpacity
          style={[styles.createAnnouncementButton]}
          onPress={() => navigation.navigate("CreateAnnouncementView")}
        >
          <Icon name="plus" height={50} width={50} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
