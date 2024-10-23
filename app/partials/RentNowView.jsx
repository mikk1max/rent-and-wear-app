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
import Swiper from "../components/Swiper";
import IconButton from "../components/IconButton";
import { useCustomFonts } from "../utils/fonts";
import ProductCard from "../components/ProductCard";
import { globalStyles } from "../utils/style";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const RentNowView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIcon, setActiveIcon] = useState(null); // State to track active button

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleButtonPress = (iconName) => {
    setActiveIcon(iconName); // Set active button
    console.log(`${iconName} button pressed`);
  };

  const icons = ["shirt", "user-tie", "mitten", "hat-wizard", "glasses"];

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
            <Swiper style={{ height: 200 }} />

            {/* /Categories buttons starts/ */}
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
                  iconName={iconName}
                  onPress={() => handleButtonPress(iconName)}
                  containerWidth={width - 60}
                  isActive={activeIcon === iconName} // Pass active state
                />
              ))}
            </View>
            {/* /Categories buttons ended/ */}

            {/* Product Cards start */}
            <View
              style={{
                flex: 1,
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 15,
                marginTop: 15,
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
  categoryContainer: {
    alignItems: "center",
    // marginTop: 20, // Space above the title
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10, // space above the button container
  },
  titleCategory: {
    // flex: 1,
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
    backgroundColor: "transparent",
  },
  allCategoriesTextBtn: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: globalStyles.textOnSecondaryColor,
  },
});

export default RentNowView;
