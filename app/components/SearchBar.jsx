import React, { useState } from "react";
import { SearchBar } from "react-native-elements";

const SearchBarComp = ({ onSearch }) => {
  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch(search);
    onSearch(search); // Trigger search function from parent
  };

  return (
    <SearchBar
      placeholder="Type Here..."
      onChangeText={updateSearch}
      value={search}
      round={true}
      containerStyle={{
        backgroundColor: "transparent",
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        paddingHorizontal: 0,
        height: 45,
        padding: 0,
        margin: 0,
      }}
      inputContainerStyle={{
        width: "100%",
        height: 45,
        backgroundColor: "#D3D3D3",
        paddingHorizontal: 10,
        justifyContent: "center",
      }}
    />
  );
};

export default SearchBarComp;
