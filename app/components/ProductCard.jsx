import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Card } from "react-native-elements";
import { globalStyles } from "../utils/style";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import Icon from "../components/Icon";

const ProductCard = ({
  id,
  mainImage,
  title,
  categoryName,
  categoryIcon,
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

  const iconOptions = {
    width: 22,
    height: 22,
    fillColor: globalStyles.textOnPrimaryColor,
  };

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
        <View style={styles.icons}>
          <View style={styles.categoryIcon}>
            {categoryIcon && <Icon name={categoryIcon} {...iconOptions} />}
          </View>
          <View style={styles.spacer}></View>
          {isAuthor && (
            <View style={styles.authorIcon}>
              <Icon name="user-fill" {...iconOptions} />
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
          onPress={() =>
            navigation.navigate("AnnouncementView", {
              id: id,
              title: title,
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
    // margin: 5,
    backgroundColor: globalStyles.primaryColor,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
  },

  authorIcon: {
    padding: 7,
    // margin: 5,
    backgroundColor: "green",
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
