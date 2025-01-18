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
import { styles } from "../styles/RentNowViewStyles";

import { ref, onValue, update, get, set, remove } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import { useNavigation } from "@react-navigation/native";

import Icon from "../components/Icon";

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
      if (data) {
        const announcementPreviewsArray = Object.keys(data)
          .filter((key) => data[key].advertiserId === user.id)
          .map((key) => ({
            id: key,
            mainImage: data[key].images[0],
            title: data[key].title,
            category: data[key].category,
            pricePerDay: data[key].pricePerDay,
            advertiserId: data[key].advertiserId,
          }));
        setAnnouncementPreviews(announcementPreviewsArray);
      } else {
        setAnnouncementPreviews([]);
      }
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
      String(announcementPreview.title)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };

  const filteredAnnouncements = getFilteredAnnouncements(searchQuery);

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
        return true; // Предотвращает стандартное действие
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      // Удаляем обработчик при выходе с экрана
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
          >
            <View style={styles.announcementsContainer}>
              {filteredAnnouncements?.map((announcementPreview) => (
                <ProductCard
                  key={"RentOutView_ProductCard_" + announcementPreview.id}
                  id={announcementPreview.id}
                  mainImage={announcementPreview.mainImage}
                  title={announcementPreview.title}
                  categoryName={announcementPreview?.category?.subcategoryName}
                  categoryIcon={announcementPreview?.category?.subcategoryIcon}
                  pricePerDay={announcementPreview.pricePerDay}
                  currentUserId={user?.id}
                  advertiserId={announcementPreview.advertiserId}
                  containerWidth={width - 60}
                />
              ))}
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity
          style={stylesTmp.createAnnouncementButton}
          onPress={() => navigation.navigate("CreateAnnouncementView")}
        >
          <Icon name="plus" height={50} width={50}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const stylesTmp = StyleSheet.create({
  createAnnouncementButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    zIndex: 10,
    padding: 5,
    alignItems: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },
});
