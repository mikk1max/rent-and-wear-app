import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Divider } from "react-native-elements";
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
  isDefault,
  selectAsDefaultAddress,
  openAddressForm,
  openDeleteConfirmation,
}) => {
  // Fonts
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Default address
  let cardStyle = styles.backgroundView;
  let star = "star";
  if (isDefault) {
    cardStyle = [styles.backgroundView, styles.backgroundViewDefault];
    star = "star-half-stroke";
  }

  // Flat and floor numbers
  let flatAndFloorNumber = "";
  let flatAndFloorNumberStyle = styles.displayNone;
  if (flatOrApartmentNumber != "" && floorNumber != "") {
    switch (floorNumber) {
      case "0":
        flatAndFloorNumber = flatOrApartmentNumber + ", ground floor";
        break;
      case "1":
        flatAndFloorNumber = flatOrApartmentNumber + ", 1st floor";
        break;
      case "2":
        flatAndFloorNumber = flatOrApartmentNumber + ", 2nd floor";
        break;
      case "3":
        flatAndFloorNumber = flatOrApartmentNumber + ", 3rd floor";
        break;
      default:
        flatAndFloorNumber =
          flatOrApartmentNumber + ", " + floorNumber + "th floor";
        break;
    }
    flatAndFloorNumberStyle = styles.textWithIcon;
  } else if (flatOrApartmentNumber != "" && floorNumber === "") {
    flatAndFloorNumber = flatOrApartmentNumber;
    flatAndFloorNumberStyle = styles.textWithIcon;
  } else if (flatOrApartmentNumber === "" && floorNumber != "") {
    switch (floorNumber) {
      case "0":
        flatAndFloorNumber = "Ground floor";
        break;
      case "1" || "-1":
        flatAndFloorNumber = floorNumber + "st floor";
        break;
      case "2" || "-2":
        flatAndFloorNumber = floorNumber + "nd floor";
        break;
      case "3" || "-3":
        flatAndFloorNumber = floorNumber + "rd floor";
        break;
      default:
        flatAndFloorNumber = floorNumber + "th floor";
        break;
    }
    flatAndFloorNumberStyle = styles.textWithIcon;
  }

  let emailStyle = styles.displayNone;
  if (email != "") {
    emailStyle = styles.textWithIcon
  }

  let phoneNumberStyle = styles.displayNone;
  if (phoneNumber != "") {
    phoneNumberStyle = styles.textWithIcon;
  }

  // Postal code + City + Country
  const postalCodeCityCountry = postalCode + " " + city + ", " + country;

  return (
    <View>
      <View style={cardStyle}>
        <View style={styles.adresseWithButtons}>
          <Text style={styles.adresse}>{adresse}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => selectAsDefaultAddress(id)}
              style={styles.button}
              activeOpacity={0.8}
            >
              <FontAwesome6
                name={star}
                size={20}
                color={globalStyles.textOnAccentColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openAddressForm(id)}
              style={styles.button}
              activeOpacity={0.8}
            >
              <FontAwesome6
                name="edit"
                size={20}
                color={globalStyles.textOnAccentColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openDeleteConfirmation(id)}
              style={[styles.button, styles.buttonDelete]}
              activeOpacity={0.8}
            >
              <FontAwesome6
                name="trash-can"
                size={20}
                color={globalStyles.textOnAccentColor}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Phone number */}
        <View style={phoneNumberStyle}>
          <FontAwesome6
            name="phone"
            size={15}
            color={globalStyles.textOnSecondaryColor}
            width="7%"
          />
          <Text style={styles.text}>{phoneNumber}</Text>
        </View>

        {/* E-mail */}
        <View style={emailStyle}>
          <FontAwesome6
            name="at"
            size={15}
            color={globalStyles.textOnSecondaryColor}
            width="7%"
          />
          <Text style={styles.text}>{email}</Text>
        </View>

        {/* Street + Building bumber */}
        <View style={styles.textWithIcon}>
          <FontAwesome6
            name="building"
            size={15}
            color={globalStyles.textOnSecondaryColor}
            width="7%"
          />
          <Text style={styles.text}>
            {street} {buildingNumber}
          </Text>
        </View>

        {/* Flat number + Floor number */}
        <View style={flatAndFloorNumberStyle}>
          <FontAwesome6
            name="door-open"
            size={15}
            color={globalStyles.textOnSecondaryColor}
            width="7%"
          />
          <Text style={styles.text}>{flatAndFloorNumber}</Text>
        </View>

        {/* Postal code + City + Country */}
        <View style={styles.textWithIcon}>
          <FontAwesome6
            name="city"
            size={15}
            color={globalStyles.textOnSecondaryColor}
            width="7%"
          />
          <Text style={styles.text}>{postalCodeCityCountry}</Text>
        </View>
      </View>
    </View>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    width: "100%",
    borderRadius: 15,
    padding: 20,
    backgroundColor: globalStyles.secondaryColor,
    color: globalStyles.textOnSecondaryColor,
  },

  backgroundViewDefault: {
    borderWidth: 3,
    borderColor: globalStyles.textOnSecondaryColor,
  },

  adresseWithButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  adresse: {
    width: "60%",
    color: globalStyles.accentColor,
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
  },

  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },

  button: {
    backgroundColor: globalStyles.accentColor,
    borderRadius: 15,
    padding: 7,
  },

  buttonDelete: {
    backgroundColor: globalStyles.redColor,
  },

  divider: {
    marginVertical: 10,
    height: 2,
    backgroundColor: globalStyles.accentColor,
  },

  textWithIcon: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
  },

  text: {
    width: "auto",
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnSecondaryColor,
  },

  displayNone: {
    display: "none",
  },
});
