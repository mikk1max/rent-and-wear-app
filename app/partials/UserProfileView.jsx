import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Alert } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase.config";
import {
  fetchSvgURL,
  fetchImgURL,
  getRandomAvatarUrl,
} from "../utils/fetchSVG";
import { SvgUri } from "react-native-svg";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { iconParams, styles } from "../styles/UserProfileViewStyles";
import { useUser } from "../components/UserProvider";
import { onLogin, onLogout } from "../utils/auth";

import Addresses from "../../assets/icons/addresses.svg";
import { Svg, Path, SvgProps } from "react-native-svg";

const UserProfileView = () => {
  const [svgs, setSvgs] = useState({});
  const [userProfileImg, setUserProfileImg] = useState(null);
  const { user, setUser } = useUser();
  const navigation = useNavigation();
  const fontsLoaded = useCustomFonts();

  useEffect(() => {
    async function loadSvgs() {
      const icons = [
        "settings",
        "addresses",
        "sends",
        "gets",
        "logout",
        "verification",
        "not-verified",
      ];
      const svgPromises = icons.map((icon) =>
        fetchSvgURL(`app-icons/${icon}.svg`).then((svg) => ({ [icon]: svg }))
      );
      const svgs = await Promise.all(svgPromises);
      setSvgs(Object.assign({}, ...svgs));
    }
    loadSvgs();
  }, []);

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

  useEffect(() => {
    const fetchProfileImg = async () => {
      try {
        const url = await fetchImgURL(`user-avatars/${user.id}.jpg`);
        setUserProfileImg(url);
      } catch {
        const randomUrl = await getRandomAvatarUrl();
        setUserProfileImg(randomUrl);
      }
    };

    if (user?.id) {
      fetchProfileImg();
    }
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

  if (!fontsLoaded || !user) {
    return null;
  }

  const handleLogout = () => {
    onLogout()
      .then(() => {
        navigation.navigate("Welcome");
      })
      .catch((error) => console.error("Logout failed:", error.message));
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View style={mainStyles.container}>
        <View style={styles.userCard}>
          <Image
            source={{
              uri: userProfileImg,
            }}
            style={styles.userCardIMG}
          />
          <View style={styles.userCardINFO}>
            <Text style={styles.fullNameText}>
              {user.name} {user.surname}
            </Text>
            <Text style={styles.emailText}>{user.email}</Text>
            <TouchableOpacity style={styles.verificationOpacity}>
              <View style={styles.verificationContent}>
                {user.isVerified !== undefined && user.isVerified !== null && (
                  <SvgUri
                    uri={
                      user.isVerified
                        ? svgs["verification"]
                        : svgs["not-verified"]
                    }
                    width={15}
                    height={15}
                    style={styles.verificationIcon}
                  />
                )}
                <Text style={styles.verificationText}>
                  {user.isVerified
                    ? " Verification completed"
                    : " Not verified yet"}
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
              onPress={() => navigation.navigate("SettingsView")}
            >
              <SvgUri uri={svgs.settings} {...iconParams} />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonBase}
              onPress={() => navigation.navigate("AddressesView")}
            >
              {/* <SvgUri uri={svgs.addresses} {...iconParams} /> */}
              <Addresses {...iconParams} />
              <Text style={styles.buttonText}>Addresses</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", gap: 15 }}>
              <TouchableOpacity
                style={[styles.buttonBase, styles.buttonRent]}
                onPress={() => navigation.navigate("SendsView")}
              >
                <SvgUri
                  uri={svgs.sends}
                  width={65}
                  height={65}
                  style={{ fill: "white" }}
                />
                <Text style={styles.buttonRentText}>Sends</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonBase, styles.buttonRent]}
                onPress={() => navigation.navigate("GetsView")}
              >
                <SvgUri
                  uri={svgs.gets}
                  width={65}
                  height={65}
                  style={{ fill: "white" }}
                />
                <Text style={styles.buttonRentText}>Gets</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.buttonBase, styles.buttonLogOut]}
              onPress={handleLogout}
            >
              <SvgUri uri={svgs.logout} {...iconParams} />
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserProfileView;
