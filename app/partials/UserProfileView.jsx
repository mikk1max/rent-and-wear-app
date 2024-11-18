import React, { useState, useEffect } from "react";
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

import { ref, onValue, update } from "firebase/database";
import { db } from "../../firebaseConfig";

import fetchSVG, { fetchImgURL } from "../utils/fetchSVG";
import { SvgUri } from "react-native-svg";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { iconParams, styles } from "../styles/UserProfileViewStyles";

const UserProfileView = () => {
  const [settingsSvg, setSettingsSvg] = useState(null);
  const [addressesSvg, setAddressesSvg] = useState(null);
  const [sendsSvg, setSendsSvg] = useState(null);
  const [getsSvg, setGetsSvg] = useState(null);
  const [logOutSvg, setLogOutSvg] = useState(null);
  const [verificationSvg, setVerificationSvg] = useState(null);
  const [userProfileImg, setUserProfileImg] = useState(null);

  const [user, setUser] = useState([]);

  const navigation = useNavigation();

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  useEffect(() => {
    async function loadSvg() {
      const settingsIcon = await fetchSVG("app-icons/settings.svg");
      const addressesIcon = await fetchSVG("app-icons/addresses.svg");
      const sendsIcon = await fetchSVG("app-icons/sends.svg");
      const getsIcon = await fetchSVG("app-icons/gets.svg");
      const logOutIcon = await fetchSVG("app-icons/logout.svg");
      const verificationSvg = await fetchSVG("app-icons/verification.svg");

      setSettingsSvg(settingsIcon);
      setAddressesSvg(addressesIcon);
      setSendsSvg(sendsIcon);
      setGetsSvg(getsIcon);
      setLogOutSvg(logOutIcon);
      setVerificationSvg(verificationSvg);
    }

    loadSvg();
  }, []);

  // User
  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((key) => ({
          ...data[key],
        }));
        const currentUser = usersArray.find((user) => user.id == 0);
        setUser(currentUser || {});
      }
    });
  }, []);

  useEffect(() => {
    async function loadUrl() {
      if (user && user.id != null) {
        try {
          const url = await fetchImgURL(`user-avatars/${user.id}-min.jpg`);
          setUserProfileImg(url);
        } catch (error) {
          console.error("Error fetching user profile image:", error);
        }
      }
    }
    loadUrl();
  }, [user.id]);

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
            <View>
              <Text style={styles.fullNameText}>
                {user.name} {user.surname}
              </Text>
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.verificationOpacity}
                activeOpacity={0.9}
              >
                <Text style={styles.verificationText}>
                  {user.isVerified && (
                    <SvgUri
                      uri={verificationSvg}
                      width={15}
                      height={15}
                      style={{
                        fill: globalStyles.textOnPrimaryColor,
                      }}
                    />
                  )}
                  {/* <Text
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                  >
            
                  </Text> */}
                  {user.isVerified
                    ? ` Verification completed`
                    : ` Not verified yet`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={[mainStyles.scrollBase, { marginVertical: 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 15 }}>
            <TouchableOpacity
              style={styles.buttonBase}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("SettingsView")}
            >
              <SvgUri uri={settingsSvg} {...iconParams} />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonBase}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("AddressesView")}
            >
              <SvgUri uri={addressesSvg} {...iconParams} />
              <Text style={styles.buttonText}>Addresses</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", gap: 15 }}>
              <TouchableOpacity
                style={[styles.buttonBase, styles.buttonRent]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SendsView")}
              >
                <SvgUri
                  uri={sendsSvg}
                  width={65}
                  height={65}
                  style={{ fill: globalStyles.textOnPrimaryColor }}
                />
                <Text style={styles.buttonRentText}>Sends</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonBase, styles.buttonRent]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("GetsView")}
              >
                <SvgUri
                  uri={getsSvg}
                  width={65}
                  height={65}
                  style={{ fill: globalStyles.textOnPrimaryColor }}
                />
                <Text style={styles.buttonRentText}>Gets</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.buttonBase, styles.buttonLogOut]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("LogOut")}
            >
              <SvgUri uri={logOutSvg} {...iconParams} />
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserProfileView;
