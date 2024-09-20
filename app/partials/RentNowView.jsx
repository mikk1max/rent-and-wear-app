import React from "react";
import { StyleSheet, View, StatusBar, Image } from "react-native";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { Platform } from "react-native";

const RentNowView = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      <Image
        style={styles.baner}
        source={{
          uri: "https://assets-static.invideo.io/images/large/Creative_Clothing_Advertisement_Ideas_To_Boost_Sales_revised_3_1_cefa9cda88.png",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // container takes up the full height of the screen
    paddingHorizontal: 25,
    justifyContent: "flex-start",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
  },
  baner: {
    width: "100%",
    height: 125,
    marginTop: 10,
    borderRadius: 15,
  },
});

export default RentNowView;
