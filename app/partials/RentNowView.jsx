import React, { useState } from "react";
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
    Platform
} from "react-native";
import SearchBar from "../components/SearchBar";
import Swiper from "../components/Swiper";
import IconButton from "../components/IconButton";
import { useCustomFonts } from "../utils/fonts";
import ProductCard from "../components/ProductCard";

import { styles as mainStyles } from "../utils/style";
import { styles } from "../styles/RentNowViewStyles";

// Get the screen dimensions
const { width } = Dimensions.get("window");

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
    isOwner: false,
  },
  {
    id: 3,
    link: "link to red hat",
    name: "Red hat",
    price: 0.1,
    isOwner: false,
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
    isOwner: false,
  },
];

const getFilteredProducts = (searchQuery) => {
  return products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

const RentNowView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIcon, setActiveIcon] = useState(null);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleButtonPress = (iconName) => {
    setActiveIcon((prev) => {
      const newActiveIcon = prev === iconName ? null : iconName;
      console.log(
        `${
          newActiveIcon
            ? `${iconName} button pressed`
            : `${iconName} button unpressed`
        }`
      );
      return newActiveIcon;
    });
  };

  const icons = ["t-shirt", "dress", "shorts", "coat", "sneakers"];

  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) return null;

  const filteredProducts = getFilteredProducts(searchQuery);

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View style={mainStyles.container}>
        <SearchBar onSearch={handleSearch} />
        <View style={[mainStyles.scrollBase, { marginTop: Platform.OS ==="android" ? 15 : 20 ,marginVertical: Platform.OS === "ios" ? 20 : 0 }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Swiper style={{ height: 200 }} />

            <View style={styles.categoryContainer}>
              <Text style={styles.titleCategory}>Category</Text>
              <TouchableOpacity>
                <Text style={styles.allCategoriesTextBtn}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              {icons.map((iconName) => (
                <IconButton
                  key={iconName}
                  filePath={`app-icons/${iconName}.svg`}
                  iconName={iconName}
                  onPress={() => handleButtonPress(iconName)}
                  containerWidth={width - 60}
                  isActive={activeIcon === iconName}
                />
              ))}
            </View>

            <View style={styles.announcementsContainer}>
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
};

export default RentNowView;
