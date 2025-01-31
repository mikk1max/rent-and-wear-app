import React, { useContext, useEffect, useState } from "react";
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

import { ref, get } from "firebase/database";
import { db } from "../../firebase.config";
import { useTranslation } from "react-i18next";
import { IconContext } from "./IconProvider";

const AllCategories = ({ navigation }) => {
  const { changeIcon, icons, setActiveIcon } = useContext(IconContext);
  const { t } = useTranslation();

  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = ref(db, "categories");
        const snapshot = await get(categoriesRef);

        if (snapshot.exists()) {
          const rawData = snapshot.val();

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

  const iconOptions = {
    width: 50,
    height: 50,
    fillColor: globalStyles.primaryColor,
  };

  const handleCategoryPress = (icon) => {
    if (changeIcon && !icons.includes(icon)) {
      changeIcon(icon);
    }
    setActiveIcon(icon);
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
                  {t(`allCategories.${categoryItem.categoryName}`)}
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
                      activeOpacity={globalStyles.ACTIVE_OPACITY}
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
    color: globalStyles.textOnSecondaryColor,
  },
  iconBtn: {
    backgroundColor: globalStyles.secondaryColor,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    marginHorizontal: 5,
  },
});

export default AllCategories;
