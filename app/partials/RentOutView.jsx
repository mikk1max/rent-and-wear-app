import React, { useState } from "react";
import {View, Dimensions, ScrollView, SafeAreaView, Platform} from "react-native";
import SearchBar from "../components/SearchBar";
import { useCustomFonts } from "../utils/fonts";
import ProductCard from "../components/ProductCard";

import { styles as mainStyles } from "../utils/style";

// Get the screen dimensions
const { width } = Dimensions.get("window");

export default function RentOutView() {
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
    <SafeAreaView style={mainStyles.whiteBack}>
      <View style={mainStyles.container}>
        <SearchBar onSearch={handleSearch} />
        <View style={[mainStyles.scrollBase, { flex: 1, marginTop: Platform.OS ==="android" ? 15 : 20 ,marginVertical: Platform.OS === "ios" ? 20 : 0 }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={mainStyles.scrollBase}
          >
            {/* Product Cards start */}
            <View
              style={{
                flex: 0,
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 15,
                // overflow: "hidden"
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
    </SafeAreaView>
  );
}
