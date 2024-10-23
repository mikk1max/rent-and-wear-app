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
import SearchBar from "../components/SearchBar";
import { useCustomFonts } from "../utils/fonts";
import ProductCard from "../components/ProductCard";
import { globalStyles } from "../utils/style";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const RentOutView = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) return null;

  // Product Cards
  const products = [
    {
      id: 1,
      link: "link to holey underpants",
      name: "Holey underpants",
      price: 5.25,
      isOwner: true,
    },
    {
      id: 2,
      link: "link to black shoes",
      name: "Black shoes",
      price: 1256987.99,
      isOwner: true,
    },
    {
      id: 3,
      link: "link to red hat",
      name: "Red hat",
      price: 0.1,
      isOwner: true,
    },
    {
      id: 4,
      link: "link to blue jeans",
      name: "Blue jeans",
      price: 40.0,
      isOwner: true,
    },
    {
      id: 5,
      link: "link to sweter",
      name: "Sweter",
      price: 8.99,
      isOwner: true,
    },
    {
      id: 6,
      link: "link to pink socks",
      name: "Pink socks",
      price: 1.27,
      isOwner: true,
    },
    {
      id: 7,
      link: "link to spider-man suit",
      name: "Spider-man suit",
      price: 70.89,
      isOwner: true,
    },
  ];
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: globalStyles.backgroundColor }}>
      <View style={styles.container}>
        <SearchBar onSearch={handleSearch} />
        <View
          style={{
            flex: 1,
            borderRadius: 15,
            marginBottom: 20,
            overflow: "hidden",
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Product Cards start */}
            <View
              style={{
                flex: 1,
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 15,
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.name}
                  productName={product.name}
                  productPrice={product.price}
                  productLink={product.link}
                  containerWidth={width - 60}
                  isOwner={product.isOwner}
                />
              ))}
            </View>
          </ScrollView>
        </View>
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
  },
});

export default RentOutView;
