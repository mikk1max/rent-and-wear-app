import React, { useState } from "react";
import SearchBar from "react-native-dynamic-search-bar";
import { Dimensions, StyleSheet } from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles } from "../utils/style";

const { width } = Dimensions.get("window");

const SearchBarComp = ({ onSearch, ...props }) => {
  const [search, setSearch] = useState("");
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const updateSearch = (search) => {
    setSearch(search);
    setSpinnerVisible(true);
    onSearch(search);

    setTimeout(() => setSpinnerVisible(false), 500);
  };

  const clearSearch = () => {
    setSearch("");
    onSearch("");
  };

  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) return null;

  const { key, ...restProps } = props;

  return (
    // <SearchBar
    //   placeholder="Search"
    //   placeholderTextColor={"#3B6592"}
    //   onChangeText={updateSearch}
    //   value={search}
    //   round
    //   containerStyle={styles.container}
    //   inputContainerStyle={styles.inputContainer}
    //   inputStyle={styles.input}
    //   searchIcon={{ size: 25, color: globalStyles.primaryColor }}
    //   clearIcon={{ size: 25, color: globalStyles.primaryColor }}
    //   {...restProps}
    // />
    <SearchBar
      placeholder="Search here"
      placeholderTextColor="#3B6592"
      style={[styles.searchBar]}
      value={search}
      onChangeText={updateSearch}
      onClearPress={clearSearch}
      spinnerVisibility={spinnerVisible}
      searchIconImageStyle={{ tintColor: globalStyles.primaryColor }}
      clearIconImageStyle={{ tintColor: globalStyles.primaryColor }}
      spinnerColor={globalStyles.primaryColor}
      textInputStyle={{color: globalStyles.primaryColor}}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    elevation: 0, // Remove shadow on Android
    shadowColor: "transparent", // Remove shadow on iOS

    width: width - 50,
    height: 45,
    backgroundColor: globalStyles.secondaryColor,
  },
  container: {
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    paddingHorizontal: 0,
    padding: 0,
    margin: 0,
    height: 45,
  },
  inputContainer: {
    width: "100%",
    // height: 45,
    backgroundColor: globalStyles.secondaryColor,
    paddingHorizontal: 10,
    justifyContent: "center",
    textAlignVertical: "bottom",
  },
  input: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
    // textAlignVertical: "center",
  },
});

export default SearchBarComp;
