import React, { useState } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import SearchBar from "../components/SearchBar";
import Swiper from "../components/Swiper";
import IconButton from "../components/IconButton";
import { useFonts, WorkSans_900Black } from "@expo-google-fonts/work-sans";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const RentNowView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIcon, setActiveIcon] = useState(null); // State to track active button

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleButtonPress = (iconName) => {
    setActiveIcon(iconName); // Set active button
    console.log(`${iconName} button pressed`);
  };

  const icons = ["shirt", "user-tie", "mitten", "hat-wizard", "glasses"];

  const [fontsLoaded] = useFonts({
    WorkSans_900Black,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      <Swiper style={{ height: 200 }} />

      {/* /Categories buttons starts/ */}
      <View style={styles.categoryContainer}>
        <Text style={styles.titleCategory} color={"red"}>
          Category
        </Text>
        <TouchableOpacity>
          <Text style={styles.allCategoriesTextBtn} color={"red"}>
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        {icons.map((iconName) => (
          <IconButton
            key={iconName}
            iconName={iconName}
            onPress={() => handleButtonPress(iconName)}
            containerWidth={width - 60}
            isActive={activeIcon === iconName} // Pass active state
          />
        ))}
      </View>
      {/* /Categories buttons ended/ */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 25,
    justifyContent: "flex-start",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
  },
  categoryContainer: {
    alignItems: "flex-start",
    // marginTop: 20, // Space above the title
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10, // space above the button container
  },
  titleCategory: {
    // flex: 1,
    fontFamily: "WorkSans_900Black",
    fontWeight: "bold",
    fontSize: 16,
    color: "#323f4b",
    backgroundColor: "transparent",
  },
  allCategoriesTextBtn: {
    fontFamily: "Poppins_500Medium",
    fontWeight: 500,
    fontSize: 12,
    color: "#5e596e",
  },
});

export default RentNowView;
