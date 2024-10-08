import React, { useState } from "react";
import { SearchBar } from "react-native-elements";
import { StyleSheet } from "react-native";

const SearchBarComp = ({ onSearch }) => {
  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch(search);
    onSearch(search); // Trigger search function from parent
  };

  return (
    <SearchBar
      placeholder="Search"
      onChangeText={updateSearch}
      value={search}
      round={true}
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      searchIcon={{ size: 25, color: "#161616" }}
      clearIcon={{ size: 25, color: "#161616" }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    paddingHorizontal: 0,
    height: 45,
    padding: 0,
    margin: 0,
  },
  inputContainer: {
    width: "100%",
    height: 45,
    backgroundColor: "#D3D3D3",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  input: {
    fontFamily: "Work Sans",
    fontSize: 16,
    color: "#323f4b", // Set text color if needed
  },
});

export default SearchBarComp;
