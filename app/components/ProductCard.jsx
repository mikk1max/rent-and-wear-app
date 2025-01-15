import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Card } from "react-native-elements";
import { globalStyles } from "../utils/style";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

const ProductCard = ({
  id,
  mainImage,
  title,
  pricePerDay,
  currentUserId,
  advertiserId,
  containerWidth,
  onChatPress,
}) => {
  // Navigation
  const navigation = useNavigation();

  // Fonts
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Width of card
  const cardWidth = (containerWidth - 1 * 5) / 2;

  let isAuthor = false;
  if (currentUserId === advertiserId) isAuthor = true;

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
        {isAuthor && (
          <View style={styles.cardPlate}>
            <Text style={styles.textOnPlate}>Your announcement</Text>
          </View>
        )}
        {isAuthor && (
          <Card.Image
            style={[styles.cardImageNoPlate, styles.cardImageWithPlate]}
            source={{
              uri: mainImage,
            }}
          />
        )}
        {!isAuthor && (
          <Card.Image
            style={styles.cardImageNoPlate}
            source={{
              uri: mainImage,
            }}
          />
        )}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AnnouncementView", {
              id: id,
            })
          }
          style={styles.cardButton}
        >
          <Text style={styles.textOnButtonName}>{title}</Text>
          <Text style={styles.textOnButtonPrice}>${pricePerDay} / day</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={{backgroundColor: "yellow", padding: 10, height: 40}} onPress={() => onChatPress()}><Text>Chat</Text></TouchableOpacity> */}
      </Card>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
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
  
  cardPlate: {
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
