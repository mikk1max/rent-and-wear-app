import React from "react";
import { StyleSheet, View, StatusBar, Dimensions, Image } from "react-native";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { Platform } from "react-native";
import Swiper from "../components/Swiper";

const RentNowView = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      <Swiper />
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
    marginTop: 300,
    borderRadius: 15,
  },
});

export default RentNowView;
