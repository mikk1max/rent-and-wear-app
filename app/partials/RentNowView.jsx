import React, { useState, useEffect, useCallback, useContext } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BackHandler, Alert, StatusBar } from "react-native";
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  RefreshControl,
} from "react-native";
import SearchBar from "../components/SearchBar";
import Swiper from "../components/Swiper";
import IconButton from "../components/IconButton";
import { useCustomFonts } from "../utils/fonts";
import ProductCard from "../components/ProductCard";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { styles } from "../styles/RentNowViewStyles";

import { ref, onValue, get } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import { useTranslation } from "react-i18next";
import NoItemsFound from "../components/NoItemsFound";
import { IconContext } from "../components/IconProvider";

const { width } = Dimensions.get("window");

const RentNowView = () => {
  const { t } = useTranslation();
  const fontsLoaded = useCustomFonts();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  if (!fontsLoaded) return null;

  const { user, setUser } = useUser();

  const [announcementPreviews, setAnnouncementPreviews] = useState([[]]);
  useEffect(() => {
    const announcementsRef = ref(db, `announcements`);
    const unsubscribe = onValue(
      announcementsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const announcementPreviewsArray = Object.keys(data || {}).map(
            (key) => ({
              id: key,
              mainImage: data[key]?.images?.[0] || "default_image_url",
              title: data[key]?.title || "Untitled",
              category: data[key]?.category || {},
              pricePerDay: data[key]?.pricePerDay || 0,
              advertiserId: data[key]?.advertiserId || null,
            })
          );
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

  const [searchQuery, setSearchQuery] = useState("");
  const { changeIcon, icons, activeIcon, setActiveIcon } =
    useContext(IconContext);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const getFilteredAnnouncements = (searchQuery, activeIcon) => {
    return announcementPreviews?.filter((announcementPreview) => {
      const matchesSearch = String(announcementPreview.title)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchCategory = activeIcon
        ? announcementPreview.category.subcategoryIcon?.toLowerCase() ===
          activeIcon.toLowerCase()
        : true;

      return matchesSearch && matchCategory;
    });
  };

  const filteredAnnouncements = getFilteredAnnouncements(
    searchQuery,
    activeIcon
  );

  const handleButtonPress = (iconName) => {
    setActiveIcon((prev) => {
      const newActiveIcon = prev === iconName ? null : iconName;
      return newActiveIcon;
    });
  };

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert(`${t("exitApp.title")}`, `${t("exitApp.description")}`, [
          {
            text: `${t("universal.cancelBtn")}`,
            onPress: () => null,
            style: "cancel",
          },
          {
            text: `${t("universal.yesBtn")}`,
            onPress: () => BackHandler.exitApp(),
          },
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

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <StatusBar backgroundColor={globalStyles.backgroundColor} barStyle="dark-content" />
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
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
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
                onPress={() => navigation.navigate("Categories")}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Text style={styles.allCategoriesTextBtn}>
                  {t("rentNow.allCategoriesBtn")}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              {icons &&
                icons.map((iconName) => (
                  <IconButton
                    key={`IconButton_${iconName}`}
                    iconName={iconName}
                    onPress={() => handleButtonPress(iconName)}
                    containerWidth={width - 60}
                    isActive={activeIcon === iconName}
                  />
                ))}
            </View>

            {console.log(activeIcon)}
            <View style={styles.announcementsContainer}>
              {filteredAnnouncements &&
                filteredAnnouncements?.map((announcementPreview) => (
                  <ProductCard
                    key={"RentNowView_ProductCard_" + announcementPreview.id}
                    id={announcementPreview.id}
                    mainImage={announcementPreview.mainImage}
                    title={announcementPreview.title}
                    categoryName={
                      announcementPreview?.category?.subcategoryName ||
                      "Unknown"
                    }
                    categoryIcon={
                      announcementPreview?.category?.subcategoryIcon ||
                      "t-shirt"
                    }
                    pricePerDay={announcementPreview.pricePerDay}
                    currentUserId={user?.id}
                    advertiserId={announcementPreview.advertiserId}
                    containerWidth={width - 60}
                    cardWidth={(width - 50 - 15) / 2}
                  />
                ))}
            </View>

            {filteredAnnouncements.length <= 0 && <NoItemsFound />}
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RentNowView;
