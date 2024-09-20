import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleTextChange = (text) => {
    setSearchText(text);
    onSearch(text); // Trigger search as user types
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search here..."
        value={searchText}
        onChangeText={handleTextChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 45,
    backgroundColor: "#D3D3D3",
    borderRadius: "50%",
    paddingHorizontal: 50,
    justifyContent: "center",
    marginVertical: 10,
  },
  searchInput: {
    width: "100%",
    height: "100%",
    fontSize: 16,
    fontWeight: "bold",
    color: "#525252",
  },
});

export default SearchBar;
