import React from "react";
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

const AllCategories = ({ route, navigation }) => {
  const fontsLoaded = useCustomFonts();

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
    fillColor: "black",
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
          <View style={styles.iconsItemBox}>
            <Text style={styles.iconsTitle}>Headwear</Text>
            <ScrollView
              style={[mainStyles.scrollBase, styles.iconsScrollContainer]}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              {headwear.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.iconBtn}
                  onPress={() => handleCategoryPress(item)}
                >
                  <Icon name={item} {...iconOptions} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.iconsItemBox}>
            <Text style={styles.iconsTitle}>Outerwear</Text>
            <ScrollView
              style={[mainStyles.scrollBase, styles.iconsScrollContainer]}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              {outerwear.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.iconBtn}
                  onPress={() => handleCategoryPress(item)}
                >
                  <Icon name={item} {...iconOptions} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.iconsItemBox}>
            <Text style={styles.iconsTitle}>Dresses</Text>
            <ScrollView
              style={[mainStyles.scrollBase, styles.iconsScrollContainer]}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              {dresses.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.iconBtn}
                  onPress={() => handleCategoryPress(item)}
                >
                  <Icon name={item} {...iconOptions} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.iconsItemBox}>
            <Text style={styles.iconsTitle}>Tops</Text>
            <ScrollView
              style={[mainStyles.scrollBase, styles.iconsScrollContainer]}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              {tops.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.iconBtn}
                  onPress={() => handleCategoryPress(item)}
                >
                  <Icon name={item} {...iconOptions} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.iconsItemBox}>
            <Text style={styles.iconsTitle}>Bottoms</Text>
            <ScrollView
              style={[mainStyles.scrollBase, styles.iconsScrollContainer]}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              {bottoms.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.iconBtn}
                  onPress={() => handleCategoryPress(item)}
                >
                  <Icon name={item} {...iconOptions} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.iconsItemBox}>
            <Text style={styles.iconsTitle}>Footwear</Text>
            <ScrollView
              style={[mainStyles.scrollBase, styles.iconsScrollContainer]}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              {footwear.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.iconBtn}
                  onPress={() => handleCategoryPress(item)}
                >
                  <Icon name={item} {...iconOptions} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.iconsItemBox}>
            <Text style={styles.iconsTitle}>Accessories</Text>
            <ScrollView
              style={[mainStyles.scrollBase, styles.iconsScrollContainer]}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              {accessories.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.iconBtn}
                  onPress={() => handleCategoryPress(item)}
                >
                  <Icon name={item} {...iconOptions} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
  },
  iconBtn: {
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    marginHorizontal: 5,
  },
});

export default AllCategories;
