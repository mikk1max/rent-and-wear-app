import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "./Icon";
import { globalStyles } from "../utils/style";
import { styles as mainStyles } from "../utils/style";
import { useCustomFonts } from "../utils/fonts";

import {
  ref,
  onValue,
  update,
  get,
  set,
  remove,
  goOnline,
} from "firebase/database";
import { db } from "../../firebase.config";

const AllCategories = ({ route, navigation }) => {
  const fontsLoaded = useCustomFonts();

  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = ref(db, "categories");
        const snapshot = await get(categoriesRef);

        if (snapshot.exists()) {
          const rawData = snapshot.val();

          // Преобразование данных обратно в массив
          const formattedCategories = Object.values(rawData).map(
            (category) => ({
              categoryName: category.categoryName,
              subcategories: Object.values(category.subcategories).map(
                (subcategory) => ({
                  subcategoryName: subcategory.subcategoryName,
                  subcategoryIcon: subcategory.subcategoryIcon,
                })
              ),
            })
          );

          setCategories(formattedCategories);
        } else {
          console.error("No data available.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // console.log(categories);

  const headwear = ["beanie", "cap", "hat"];
  const outerwear = ["coat", "vest"];
  const dresses = [
    "dress",
    "sweater",
    "classic-costume",
    "woman-classic-costume",
    "party-costume",
  ];
  const tops = ["jersey", "t-shirt", "short-sleeves-shirt"];
  const bottoms = ["pants", "shorts", "short-skirt", "sport-pants"];
  const footwear = [
    "formal-shoes",
    "sneakers",
    "high-heel",
    "slippers",
    "socks",
  ];
  const accessories = ["gloves", "belt"];

  const iconOptions = {
    width: 50,
    height: 50,
    fillColor: globalStyles.primaryColor,
  };

  const { changeIcon } = route.params;
  const { recentIcons } = route.params;
  const { changeActiveIcon } = route.params;

  if (!fontsLoaded) return null;

  const handleCategoryPress = (icon) => {
    if (changeIcon && !recentIcons.some((item) => item === icon)) {
      changeIcon(icon);
    }
    changeActiveIcon(icon);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[mainStyles.whiteBack, styles.modal]}>
      <View style={[mainStyles.container, { alignItems: "stretch" }]}>
        <ScrollView
          style={[mainStyles.scrollBase, { paddingVertical: 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {categories &&
            categories.map((categoryItem) => (
              <View
                style={styles.iconsItemBox}
                key={`Category_${categoryItem.categoryName}`}
              >
                <Text style={styles.iconsTitle}>
                  {categoryItem.categoryName}
                </Text>
                <ScrollView
                  style={[mainStyles.scrollBase, styles.iconsScrollContainer]}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                >
                  {categoryItem.subcategories.map((subcategoryItem) => (
                    <TouchableOpacity
                      key={`Subcategory_${categoryItem.categoryName}_${subcategoryItem.subcategoryName}`}
                      style={styles.iconBtn}
                      onPress={() =>
                        handleCategoryPress(subcategoryItem.subcategoryIcon)
                      }
                    >
                      <Icon
                        name={subcategoryItem.subcategoryIcon}
                        {...iconOptions}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modal: {
    flexDirection: "column",
    flex: 1,
  },
  iconsScrollContainer: {
    flex: 0,
  },
  iconsItemBox: {
    marginBottom: 20,
    gap: 10,
  },
  iconsTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
    color: globalStyles.primaryColor,
  },
  iconBtn: {
    backgroundColor: globalStyles.secondaryColor,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    marginHorizontal: 5,
  },
});

export default AllCategories;
