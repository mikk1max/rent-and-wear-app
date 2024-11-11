import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { Image } from "react-native-elements";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { globalStyles } from "../utils/style";
import { useNavigation } from "@react-navigation/native";

import { ref, onValue, update } from "firebase/database";
import { db } from "../../firebaseConfig";

import fetchSVG from "../utils/fetchSVG";
import { SvgUri } from "react-native-svg";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const dataCardWidth = width - 50 - 100 - 15;
// const dataCardWidth = width - 50 - 100;

const UserProfileView = () => {
  const [settingsSvg, setSettingsSvg] = useState(null);
  const [addressesSvg, setAddressesSvg] = useState(null);
  const [sendsSvg, setSendsSvg] = useState(null);
  const [getsSvg, setGetsSvg] = useState(null);
  const [logOutSvg, setLogOutSvg] = useState(null);

  useEffect(() => {
    async function loadSvg() {
      const settingsIcon = await fetchSVG("app-icons/settings.svg");
      const addressesIcon = await fetchSVG("app-icons/addresses.svg");
      const sendsIcon = await fetchSVG("app-icons/sends.svg");
      const getsIcon = await fetchSVG("app-icons/gets.svg");
      const logOutIcon = await fetchSVG("app-icons/logout.svg");

      setSettingsSvg(settingsIcon);
      setAddressesSvg(addressesIcon);
      setSendsSvg(sendsIcon);
      setGetsSvg(getsIcon);
      setLogOutSvg(logOutIcon);
    }

    loadSvg();
  }, []);

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const navigation = useNavigation();

  // User
  const [user, setUser] = useState([]);
  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUser(usersArray[0]);
      }
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: globalStyles.backgroundColor,
        justifyContent: "center",
      }}
    >
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            height: 175,
          }}
        >
          <Image
            source={{
              uri: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            }}
            style={{
              width: 100,
              height: "100%",
              borderRadius: 15,
              marginRight: 15,
              // borderTopLeftRadius: 15,
              // borderBottomLeftRadius: 15,
            }}
          />
          <View
            style={{
              justifyContent: "center",
              height: "100%",
              width: dataCardWidth,
              padding: 0,
              backgroundColor: globalStyles.secondaryColor,
              borderRadius: 15,
              // borderTopRightRadius: 15,
              // borderBottomRightRadius: 15,
              gap: 10,
              paddingLeft: 10,
            }}
          >
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.titleText}>Name:</Text>
              <Text style={styles.valueText}>{user.name}</Text>
            </View>
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.titleText}>Surname:</Text>
              <Text style={styles.valueText}>{user.surname}</Text>
            </View>
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.titleText}>E-mail:</Text>
              <Text style={styles.valueText}>{user.email}</Text>
            </View>
          </View>
        </View>
        <ScrollView
          style={{ marginVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 15 }}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("SettingsView")}
            >
              <SvgUri uri={settingsSvg} {...iconParams} />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("AddressesView")}
            >
              <SvgUri uri={addressesSvg} {...iconParams} />
              <Text style={styles.buttonText}>Addresses</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 15 }}>
              <TouchableOpacity
                style={[styles.button, styles.buttonRent]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SendsView")}
              >
                <SvgUri uri={sendsSvg} {...iconParams} />
                <Text style={styles.buttonText}>Sends</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonRent]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("GetsView")}
              >
                <SvgUri uri={getsSvg} {...iconParams} />
                <Text style={styles.buttonText}>Gets</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonLogOut]}
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

const iconParams = {
  width: 30,
  height: 30,
  style: { fill: globalStyles.textOnPrimaryColor },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingHorizontal: 25,
    justifyContent: "flex-start",
    // marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
    alignItems: "center",
  },
  titleText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
    backgroundColor: "transparent",
  },
  valueText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.accentColor,
    backgroundColor: "transparent",
    marginLeft: 10,
  },
  buttonText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 20,
    color: globalStyles.textOnPrimaryColor,
  },
  button: {
    backgroundColor: globalStyles.primaryColor,
    width: width - 50,
    height: 65,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 15,
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  buttonLogOut: {
    backgroundColor: globalStyles.redColor,
  },
  buttonRent: {
    width: (width - 50 - 15) / 2,
  },
});

export default UserProfileView;
