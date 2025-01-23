import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Card } from "react-native-elements";
import { globalStyles } from "../utils/style";
import { useCustomFonts } from "../utils/fonts";
import ProgressBarLine from "./ProgressBarLine";
import { useTranslation } from "react-i18next";

const AdSendCard = ({
  productName,
  productPrice,
  productLink,
  productStatus,
  containerWidth,
  progressValue,
}) => {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const { t } = useTranslation();

  const onPress = () => console.log(`Link to product: ${productLink}`);

  return (
    <Card containerStyle={[styles.cardContainer, { width: containerWidth }]}>
      <Card.Image
        style={styles.cardImage}
        source={{
          uri: "https://www.tommyjohn.com/cdn/shop/articles/holey.webp?v=1659548657&width=1500",
        }}
      />
      <View style={styles.cardContent}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Text style={styles.productName}>{productName}</Text>
          <Text style={styles.productStatus}>{productStatus}</Text>
        </View>

        <Text style={styles.productPrice}>
          {t("card.productPrice", { price: productPrice.toFixed(2) })}
        </Text>
      </View>

      <ProgressBarLine progressValue={progressValue} />

      <TouchableOpacity onPress={onPress} style={styles.cardButton}>
        <Text style={styles.buttonText}>{t("card.viewDetails")}</Text>
      </TouchableOpacity>
    </Card>
  );
};

export default AdSendCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    overflow: "hidden",
    padding: 0,
    margin: 0,
  },
  cardImage: {
    height: 150,
    width: "100%",
  },
  cardContent: {
    padding: 10,
    backgroundColor: globalStyles.backgroundColor,
  },
  productName: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.textColor,
  },
  productPrice: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    color: globalStyles.secondaryTextColor,
    marginTop: 5,
  },
  productStatus: {
    // fontFamily: "Poppins_400Regular",
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.secondaryTextColor,
    // marginTop: 5,
  },
  cardButton: {
    backgroundColor: globalStyles.primaryColor,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  buttonText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnPrimaryColor,
  },

  progressBarStyles: {
    // marginBottom: 10,
  },
});
