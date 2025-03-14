import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Card } from "react-native-elements";
import { globalStyles } from "../utils/style";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import Icon from "../components/Icon";
import { cutTitle } from "../utils/func";
import { useTranslation } from "react-i18next";

const ProductCard = ({
  id,
  mainImage,
  title,
  categoryIcon,
  pricePerDay,
  currentUserId,
  advertiserId,
  cardWidth,
}) => {
  const navigation = useNavigation();

  const { t } = useTranslation();

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  let isAuthor = false;
  if (currentUserId === advertiserId) isAuthor = true;

  const iconOptions = {
    width: 22,
    height: 22,
    fillColor: globalStyles.textOnPrimaryColor,
  };

  return (
    <View style={{ width: cardWidth }}>
      <Card
        pointerEvents="box-none"
        containerStyle={{
          height: 200,
          width: cardWidth,
          margin: 0,
          padding: 0,
          borderRadius: 15,
        }}
      >
        <View style={styles.icons}>
          <View style={styles.categoryIcon}>
            {categoryIcon && <Icon name={categoryIcon} {...iconOptions} />}
          </View>
          <View style={styles.spacer}></View>
          {isAuthor && (
            <View style={styles.authorIcon}>
              <Icon
                name="user-fill"
                {...iconOptions}
                fillColor={globalStyles.textOnAccentColor}
              />
            </View>
          )}
        </View>

        <Card.Image
          style={styles.cardImage}
          source={{
            uri: mainImage,
          }}
        />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AnnouncementView", { id: id, title: title });
          }}
          style={styles.cardButton}
          activeOpacity={globalStyles.ACTIVE_OPACITY}
        >
          <Text style={styles.textOnButtonName}>{cutTitle(title) || ""}</Text>
          <Text style={styles.textOnButtonPrice}>
            ${pricePerDay} / {t("productCard.day")}
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  icons: {
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 36,
    marginBottom: -36,
  },

  spacer: {
    width: "50%",
    backgroundColor: "transparent",
  },

  categoryIcon: {
    padding: 7,
    backgroundColor: globalStyles.primaryColor,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
  },

  authorIcon: {
    padding: 7,
    backgroundColor: globalStyles.accentColor,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
  },

  cardImage: {
    height: 150,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  cardButton: {
    backgroundColor: globalStyles.primaryColor,
    height: 50,
    width: "100%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  textOnButtonName: {
    fontFamily: "WorkSans_900Black",
    fontSize: 15,
    color: globalStyles.textOnPrimaryColor,
  },

  textOnButtonPrice: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.textOnPrimaryColor,
  },
});
