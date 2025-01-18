import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
} from "react-native";
import SearchBar from "../components/SearchBar";
import Swiper from "../components/Swiper";
import IconButton from "../components/IconButton";
import { useCustomFonts } from "../utils/fonts";
import ProductCard from "../components/ProductCard";

import { styles as mainStyles } from "../utils/style";
import { styles } from "../styles/RentNowViewStyles";

import {
  ref,
  onValue,
  update,
  get,
  set,
  remove,
  push,
} from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import { useTranslation } from "react-i18next";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const RentNowView = () => {
  const { t } = useTranslation();
  const fontsLoaded = useCustomFonts();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  if (!fontsLoaded) return null;

  const [icons, setIcons] = useState([
    "t-shirt",
    "dress",
    "shorts",
    "coat",
    "sneakers",
  ]);

  const { user, setUser } = useUser();
  // console.log(user);

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
    const unsubscribe = onValue(
      announcementsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const announcementPreviewsArray = Object.keys(data).map((key) => ({
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
      },
      (error) => {
        console.error("Firebase error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // console.log(announcementPreviews);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeIcon, setActiveIcon] = useState(null);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const getFilteredAnnouncements = (searchQuery) => {
    return announcementPreviews?.filter((announcementPreview) =>
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

  const changeIcon = (icon) => {
    console.log(icons);
    if (!icon) return;
    const updatedIcons = [icon, ...icons.slice(0, -1)];
    setIcons(updatedIcons);
    handleButtonPress(icon);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const announcementsRef = ref(db, `announcements`);
      const snapshot = await get(announcementsRef);
      const data = snapshot.val();

      if (data) {
        const announcementPreviewsArray = Object.keys(data).map((key) => ({
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
      setSearchQuery("");
      setReloadKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const onChatPress = (announcementPreview) => {
    if (!user || !user.uid) {
      Alert.alert("Login Required", "You need to log in to start a chat.");
      return;
    }

    if (user.uid === announcementPreview.advertiserId) {
      Alert.alert(
        "Cannot Start Chat",
        "You cannot start a chat with yourself. Please select another announcement."
      );
      return;
    }

    const { id: announcementId, advertiserId } = announcementPreview;
    const userId = user.uid;

    const chatRef = ref(db, "chats");

    get(chatRef)
      .then((snapshot) => {
        const chats = snapshot.val();
        let chatId = null;

        if (chats) {
          for (const key in chats) {
            const chat = chats[key];

            if (
              chat.announcementId === announcementId &&
              ((chat.advertiserId === advertiserId && chat.userId === userId) ||
                (chat.advertiserId === userId && chat.userId === advertiserId))
            ) {
              chatId = key;
              break;
            }
          }
        }

        if (chatId) {
          console.log(`Navigating to existing chat with ID: ${chatId}`);
          navigation.navigate("Chat", { chatId });
        } else {
          console.log("No existing chat found, creating a new one...");

          const newChat = {
            announcementId,
            advertiserId,
            userId: null, // No user yet (the user will be assigned once they send the first message)
            messages: [],
            timestamp: Date.now(),
          };

          const newChatRef = push(chatRef);
          set(newChatRef, newChat).then(() => {
            console.log(`New chat created with ID: ${newChatRef.key}`);
            navigation.navigate("Chat", { chatId: newChatRef.key });
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Swiper style={{ height: 180 }} />

            <View style={styles.categoryContainer}>
              <Text style={styles.titleCategory}>
                {t("rentNow.categoryTitle")}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Categories", {
                    recentIcons: icons,
                    changeIcon: changeIcon,
                    changeActiveIcon: setActiveIcon,
                  })
                }
              >
                <Text style={styles.allCategoriesTextBtn}>
                  {t("rentNow.allCategoriesBtn")}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              {icons &&
                icons?.map((iconName) => (
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
              {filteredAnnouncements &&
                filteredAnnouncements?.map((announcementPreview) => (
                  <ProductCard
                    key={"RentNowView_ProductCard_" + announcementPreview.id}
                    id={announcementPreview.id}
                    mainImage={announcementPreview.mainImage}
                    title={announcementPreview.title}
                    categoryName={
                      announcementPreview?.category?.subcategoryName
                    }
                    categoryIcon={
                      announcementPreview?.category?.subcategoryIcon
                    }
                    pricePerDay={announcementPreview.pricePerDay}
                    currentUserId={user?.id}
                    advertiserId={announcementPreview.advertiserId}
                    containerWidth={width - 60}
                    onChatPress={() => onChatPress(announcementPreview)}
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
