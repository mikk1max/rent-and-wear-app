import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Alert, RefreshControl } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform
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

const UserProfileView = () => {
  const [userProfileImg, setUserProfileImg] = useState(null);
  const { user, setUser } = useUser();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const fontsLoaded = useCustomFonts();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

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

  const checkPermissions = async () => {
    try {
      const snapshot = await get(ref(db, "announcements"));
      if (snapshot.exists()) {
        console.log("Access confirmed:", snapshot.val());
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
  }

  return (
    <SafeAreaView style={mainStyles.whiteBack} key={i18n.language}>
      <View style={[mainStyles.container, {marginTop: Platform.OS === "android" ? 15 : 0,}]}>
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
              onPress={!user.isVerified && (() => onConfirmEmail())}
              activeOpacity={0.9}
              disabled={user.isVerified && true}
            >
              <View style={styles.verificationContent}>
                {user.isVerified !== undefined && user.isVerified !== null && (
                  <Icon
                    name={user.isVerified ? "verification" : "not-verified"}
                    width={15}
                    height={15}
                    fillColor="white"
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

        <ScrollView
          style={[mainStyles.scrollBase, { marginVertical: 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 15 }}>
            <TouchableOpacity
              style={styles.buttonBase}
              onPress={() => navigation.navigate("AddressesView")}
              activeOpacity={0.9}
            >
              <Icon name="addresses" {...iconParams} />
              <Text style={styles.buttonText}>
                {t("userProfile.addresses")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonBase]}
              onPress={() => navigation.navigate("SettingsView")}
              activeOpacity={0.9}
            >
              <Icon name="settings" {...iconParams} />
              <Text style={styles.buttonText}>{t("userProfile.settings")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonBase}
              onPress={toggleDropdown}
              activeOpacity={0.9}
            >
              <Icon name="language" {...iconParams} />
              <Text style={styles.buttonText}>{t("userProfile.language")}</Text>
            </TouchableOpacity>

            {isDropdownVisible && (
              <LanguageSwitcher toggleDropdown={toggleDropdown} />
            )}

            <TouchableOpacity
              style={[styles.buttonBase]}
              onPress={() => navigation.navigate("Chats")}
              activeOpacity={0.9}
            >
              <Icon name="chat" {...iconParams} colorStroke="transparent" />
              <Text style={styles.buttonText}>Chats</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", gap: 15 }}>
              <TouchableOpacity
                style={[styles.buttonBase, styles.buttonRent]}
                onPress={() => navigation.navigate("SendsView")}
                activeOpacity={0.9}
              >
                <Icon name="sends" width={65} height={65} fillColor="white" />
                <Text style={styles.buttonRentText}>
                  {t("userProfile.sends")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonBase, styles.buttonRent]}
                onPress={() => navigation.navigate("GetsView")}
                activeOpacity={0.9}
              >
                <Icon name="gets" width={65} height={65} fillColor="white" />
                <Text style={styles.buttonRentText}>
                  {t("userProfile.gets")}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.buttonBase, styles.buttonLogOut]}
              onPress={handleLogout}
              activeOpacity={0.9}
            >
              <Icon name="logout" {...iconParams} />
              <Text style={styles.buttonText}>{t("userProfile.logout")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserProfileView;
