import React, { useState } from "react";
import { SearchBar } from "react-native-elements";
import { StyleSheet } from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles } from "../utils/style";
import 'react-native-get-random-values'

const SearchBarComp = ({ onSearch }) => {
  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch(search);
    onSearch(search);
  };

  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) return null;
  
  return (
    <SearchBar
      placeholder="Search"
      onChangeText={updateSearch}
      value={search}
      round
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      searchIcon={{ size: 25, color: globalStyles.accentColor }}
      clearIcon={{ size: 25, color: globalStyles.accentColor }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    paddingHorizontal: 0,
    padding: 0,
    margin: 0,
  },
  inputContainer: {
    width: "100%",
    height: 45,
    backgroundColor: globalStyles.secondaryColor,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  input: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
  },
});

export default SearchBarComp;
