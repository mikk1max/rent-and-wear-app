import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Card } from "react-native-elements";
import { globalStyles } from "../utils/style";
import { useCustomFonts } from "../utils/fonts";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const AddressCard = ({
  id,
  adresse,
  phoneNumber,
  email,
  street,
  buildingNumber,
  flatOrApartmentNumber,
  floorNumber,
  postalCode,
  city,
  country,
  containerWidth,
}) => {
  // Fonts
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Width of card
  // const cardWidth = (containerWidth - 1 * 5);
  const cardWidth = 200;

  const onPress = () => console.log("Edytuj adres-" + id);

  return (
    <View style={[styles.backgroundView, { width: cardWidth }]}>
      <Text>Adressee</Text>
			<Text>{adresse}</Text>
			<Text>Phone number</Text>
			<Text>{phoneNumber}</Text>
			<Text>E-mail</Text>
			<Text>{email}</Text>
			<Text>Street</Text>
			<Text>{street}</Text>
			<Text>Building number</Text>
			<Text>{buildingNumber}</Text>
			<Text>Flat/Apartment number</Text>
			<Text>{flatOrApartmentNumber}</Text>
			<Text>Floor number</Text>
			<Text>{floorNumber}</Text>
			<Text>Postal code</Text>
			<Text>{postalCode}</Text>
			<Text>City</Text>
			<Text>{city}</Text>
			<Text>Country</Text>
			<Text>{country}</Text>
    </View>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  backgroundView: {
    flrx: 1,
    marginTop: 50,
		marginLeft: 20,
		borderRadius: 15,
		padding: 10,
    backgroundColor: "lightblue",
  },
});
