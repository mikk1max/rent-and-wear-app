import React, { useState } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { ActivityIndicator } from "react-native";
import { Image } from "react-native-elements";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { globalStyles } from "../utils/style";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const dataCardWidth = width - 50 - 100 - 15;
// const dataCardWidth = width - 50 - 100;

const UserProfileView = () => {
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) return null;

  const settingsLink = "settings";
  const onPress = (link) => console.log(link);

  return (
    <View
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
            PlaceholderContent={<ActivityIndicator />}
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
              <Text style={styles.valueText}>Bob</Text>
            </View>
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.titleText}>Surname:</Text>
              <Text style={styles.valueText}>Smith</Text>
            </View>
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.titleText}>E-mail:</Text>
              <Text style={styles.valueText}>b.smith@pollub.pl</Text>
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
              onPress={() => console.log("Link to Settings-page")}
            >
              <FontAwesome6
                name="gears"
                size={25}
                color={globalStyles.textOnPrimaryColor}
              />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => console.log("Link to Addresses-page")}
            >
              <FontAwesome6
                name="house-user"
                size={25}
                color={globalStyles.textOnPrimaryColor}
              />
              <Text style={styles.buttonText}>Addresses</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 15 }}>
              <TouchableOpacity
                style={[styles.button, styles.buttonRent]}
                activeOpacity={0.8}
                onPress={() => console.log("Link to Sends-page")}
              >
                <FontAwesome6
                  name="circle-up"
                  size={25}
                  color={globalStyles.textOnPrimaryColor}
                />
                <Text style={styles.buttonText}>Sends</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonRent]}
                activeOpacity={0.8}
                onPress={() => console.log("Link to Gets-page")}
              >
                <FontAwesome6
                  name="circle-down"
                  size={25}
                  color={globalStyles.textOnPrimaryColor}
                />
                <Text style={styles.buttonText}>Gets</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonLogOut]}
              activeOpacity={0.8}
              onPress={() => console.log("Succesfully logget out!")}
            >
              <FontAwesome6
                name="right-from-bracket"
                size={25}
                color={globalStyles.textOnPrimaryColor}
              />
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingHorizontal: 25,
    justifyContent: "flex-start",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
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
