import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Card } from "react-native-elements";
import { globalStyles } from "../utils/style";
import { useCustomFonts } from "../utils/fonts";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const ProductCard = ({
  productName,
  productPrice,
  productLink,
  containerWidth,
  isOwner,
}) => {
  // Fonts
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Width of card
  const cardWidth = (containerWidth - 1 * 5) / 2;

  const onPress = () => console.log(productLink);

  // Styles
  var plateStyle = null;
  var imageStyle = null;
  if (isOwner) {
    plateStyle = styles.cardPlateWithPlate;
    imageStyle = [styles.cardImageNoPlate, styles.cardImageWithPlate];
  } else {
    plateStyle = styles.cardPlateNoPlate;
    imageStyle = styles.cardImageNoPlate;
  }

  return (
    <View>
      <Card
        containerStyle={{
          height: 200,
          width: cardWidth,
          margin: 0,
          padding: 0,
          borderRadius: 15,
        }}
      >
        <View style={plateStyle}>
          <Text style={styles.textOnPlate}>Your announcement</Text>
        </View>
        <Card.Image
          style={imageStyle}
          source={{
            uri: "https://www.tommyjohn.com/cdn/shop/articles/holey.webp?v=1659548657&width=1500",
          }}
        />

        <TouchableOpacity onPress={onPress} style={styles.cardButton}>
          <Text style={styles.textOnButtonName}>{productName}</Text>
          <Text style={styles.textOnButtonPrice}>${productPrice} / day</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  cardPlateNoPlate: {
    display: "none",
  },

  cardImageNoPlate: {
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

  cardPlateWithPlate: {
    display: "flex",
    height: 25,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalStyles.blueColor,
  },

  textOnPlate: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: globalStyles.textOnPrimaryColor,
  },

  cardImageWithPlate: {
    height: 125,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
