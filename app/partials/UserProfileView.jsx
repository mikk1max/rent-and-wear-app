import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Alert, RefreshControl, StatusBar } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue, off, get } from "firebase/database";
import { db } from "../../firebase.config";
import { fetchImgURL, getRandomAvatarUrl } from "../utils/fetchSVG";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { iconParams, styles } from "../styles/UserProfileViewStyles";
import { useUser } from "../components/UserProvider";
import { onConfirmEmail, onLogin, onLogout } from "../utils/auth";
import Icon from "../components/Icon";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ErrorModal from "../components/ErrorModal";
import { isEmpty } from "lodash";

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

const UserProfileView = () => {
  const [userProfileImg, setUserProfileImg] = useState(null);
  const { user, setUser } = useUser();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const fontsLoaded = useCustomFonts();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [lastVerificationAttempt, setLastVerificationAttempt] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const [refreshing, setRefreshing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  useEffect(() => {
    const fetchProfileImg = async () => {
      try {
        const url = await fetchImgURL(`user-avatars/${user.id}/${user.id}.jpg`);
        setUserProfileImg(url);
      } catch {
        const randomUrl = await getRandomAvatarUrl();
        setUserProfileImg(randomUrl);
      }
    };

    fetchProfileImg();
  }, [user?.id]);

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

  const checkPermissions = async () => {
    try {
      const snapshot = await get(ref(db, "announcements"));
      if (snapshot.exists()) {
        // console.log("Access confirmed:", snapshot.val());
      } else {
        console.log("No data or access denied.");
      }
    } catch (error) {
      console.error("Permission error:", error.message);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  if (!fontsLoaded || !user) {
    return null;
  }

  const handleLogout = () => {
    // Unsubscribe from Firebase listeners
    off(ref(db, "announcements"));

    onLogout()
      .then(() => {
        navigation.navigate("Welcome");
      })
      .catch((error) => console.error("Logout failed:", error.message));
  };

  const hideEmail = (email) => {
    const atIndex = email.indexOf("@");
    if (atIndex === -1) return email;
    if (email.length <= 20) return email;
    const hiddenPart = "*".repeat(3);
    return (
      email.slice(0, 5) +
      hiddenPart +
      email.slice(atIndex - 3, atIndex) +
      email.slice(atIndex)
    );
  };

  const filterFullName = (name, surname) => {
    let fullName = name + " " + surname;
    if (fullName.length <= 20) {
      return fullName;
    }

    return fullName.slice(0, 20) + "...";
  };

  const handleVerifyEmail = async () => {
    const now = Date.now();
    if (
      lastVerificationAttempt &&
      now - lastVerificationAttempt < FIVE_MINUTES_IN_MS
    ) {
      setModalContent({
        title: t("error.waitTitle"),
        message: t("error.waitMessage"),
      });
      setModalVisible(true);
      return;
    }

    try {
      await onConfirmEmail();

      setLastVerificationAttempt(now);

      Alert.alert(
        t("userProfile.verificationSuccess.title"),
        t("userProfile.verificationSuccess.message")
      );
    } catch (error) {
      Alert.alert(
        t("userProfile.verificationError.title"),
        t("userProfile.verificationError.message"),
        [{ text: t("universal.okBtn") }]
      );
      console.error("Verification error:", error.message);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack} key={i18n.language}>
      <StatusBar backgroundColor={globalStyles.backgroundColor} barStyle="dark-content" />
      <View
        style={[
          mainStyles.container,
          { marginTop: Platform.OS === "android" ? 15 : 0 },
        ]}
      >
        <View style={styles.userCard}>
          <Image
            source={{
              uri: userProfileImg,
            }}
            style={styles.userCardIMG}
          />
          <View style={styles.userCardINFO}>
            <Text style={styles.fullNameText}>
              {filterFullName(user.name, user.surname)}
            </Text>
            <Text style={styles.emailText}>{hideEmail(user.email)}</Text>
            <TouchableOpacity
              style={styles.verificationOpacity}
              onPress={
                !user.isVerified && user.email !== "guest@example.com"
                  ? handleVerifyEmail
                  : null
              }
              activeOpacity={globalStyles.ACTIVE_OPACITY}
              disabled={user.isVerified || user.email === "guest@example.com"}
            >
              <View style={styles.verificationContent}>
                {!isEmpty(user) && (
                  <Icon
                    name={user.isVerified ? "verification" : "not-verified"}
                    width={15}
                    height={15}
                    fillColor={globalStyles.textOnPrimaryColor}
                    styles={{ marginRight: 5 }}
                  />
                )}
                <Text style={styles.verificationText}>
                  {user.isVerified
                    ? ` ${t("userProfile.verificationInfo.completed")}`
                    : ` ${t("userProfile.verificationInfo.uncompleted")}`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {user && user.email !== "guest@example.com" ? (
          <ScrollView
            style={[mainStyles.scrollBase, { marginVertical: 20 }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                  setRefreshing(true);
                  try {
                    // Refetch user data
                    const usersRef = ref(db, "users");
                    const snapshot = await get(usersRef);
                    if (snapshot.exists()) {
                      const data = snapshot.val();
                      const currentUserEntry = Object.entries(data).find(
                        ([key, userData]) => userData.email === user.email
                      );

                      if (currentUserEntry) {
                        const [key, userData] = currentUserEntry;
                        setUser({ ...userData, id: key });
                      }
                    }

                    // Refetch profile image
                    const url = await fetchImgURL(
                      `user-avatars/${user.id}/${user.id}.jpg`
                    );
                    setUserProfileImg(url);
                  } catch (error) {
                    console.error("Error refreshing user data:", error);
                  } finally {
                    setRefreshing(false);
                  }
                }}
              />
            }
          >
            <View style={{ gap: 15 }}>
              <TouchableOpacity
                style={[styles.buttonBase]}
                onPress={() => navigation.navigate("Chats")}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Icon name="chat" {...iconParams} colorStroke="transparent" />
                <Text style={styles.buttonText}>{t("userProfile.chats")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buttonBase,
                  { backgroundColor: globalStyles.textOnSecondaryColor },
                ]}
                onPress={() => navigation.navigate("AddressesView")}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Icon name="addresses" {...iconParams} />
                <Text style={styles.buttonText}>
                  {t("userProfile.addresses")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonBase]}
                onPress={() => navigation.navigate("SettingsView")}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Icon name="settings" {...iconParams} />
                <Text style={styles.buttonText}>
                  {t("userProfile.settings")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buttonBase,
                  { backgroundColor: globalStyles.textOnSecondaryColor },
                ]}
                onPress={toggleDropdown}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Icon name="language" {...iconParams} />
                <Text style={styles.buttonText}>
                  {t("userProfile.language")}
                </Text>
              </TouchableOpacity>

              {isDropdownVisible && (
                <LanguageSwitcher toggleDropdown={toggleDropdown} />
              )}

              <View style={{ flexDirection: "row", gap: 15 }}>
                <TouchableOpacity
                  style={[styles.buttonBase, styles.buttonRent]}
                  onPress={() => navigation.navigate("SendsView")}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                >
                  <Icon
                    name="sends"
                    width={65}
                    height={65}
                    fillColor={globalStyles.textOnPrimaryColor}
                  />
                  <Text style={styles.buttonRentText}>
                    {t("userProfile.sends")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonBase, styles.buttonRent]}
                  onPress={() => navigation.navigate("GetsView")}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                >
                  <Icon
                    name="gets"
                    width={65}
                    height={65}
                    fillColor={globalStyles.textOnPrimaryColor}
                  />
                  <Text style={styles.buttonRentText}>
                    {t("userProfile.gets")}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.buttonBase, styles.buttonLogOut]}
                onPress={handleLogout}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Icon name="logout" {...iconParams} />
                <Text style={styles.buttonText}>{t("userProfile.logout")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            style={[mainStyles.scrollBase, { marginVertical: 20 }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                  setRefreshing(true);
                  try {
                    // Refetch user data
                    const usersRef = ref(db, "users");
                    const snapshot = await get(usersRef);
                    if (snapshot.exists()) {
                      const data = snapshot.val();
                      const currentUserEntry = Object.entries(data).find(
                        ([key, userData]) => userData.email === user.email
                      );

                      if (currentUserEntry) {
                        const [key, userData] = currentUserEntry;
                        setUser({ ...userData, id: key });
                      }
                    }

                    // Refetch profile image
                    const url = await fetchImgURL(
                      `user-avatars/${user.id}/${user.id}.jpg`
                    );
                    setUserProfileImg(url);
                  } catch (error) {
                    console.error("Error refreshing user data:", error);
                  } finally {
                    setRefreshing(false);
                  }
                }}
              />
            }
          >
            <View style={{ gap: 15 }}>
              <TouchableOpacity
                style={[
                  styles.buttonBase,
                  { backgroundColor: globalStyles.textOnSecondaryColor },
                ]}
                onPress={toggleDropdown}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Icon name="language" {...iconParams} />
                <Text style={styles.buttonText}>
                  {t("userProfile.language")}
                </Text>
              </TouchableOpacity>

              {isDropdownVisible && (
                <LanguageSwitcher toggleDropdown={toggleDropdown} />
              )}

              <View style={styles.notLogContainer}>
                <Image
                  source={require("../../assets/images/NotLogin.png")}
                  style={styles.image}
                />

                <Text style={styles.title}>{t("userProfile.notLogTitle")}</Text>
                <Text style={styles.subtitle}>
                  {t("userProfile.notLogSubTitle")}
                </Text>

                <TouchableOpacity
                  style={[styles.buttonLOGIN]}
                  onPress={handleLogout}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                >
                  {/* <Icon name="logout" {...iconParams} /> */}
                  <Text style={styles.buttonText}>
                    {t("userProfile.login")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        <ErrorModal
          isVisible={isModalVisible}
          onClose={handleModalClose}
          title={modalContent.title}
          message={modalContent.message}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserProfileView;
