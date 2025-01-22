import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Divider } from "react-native-elements";
import { globalStyles } from "../utils/style";
import { useCustomFonts } from "../utils/fonts";
import Icon from "./Icon";
import { useTranslation } from "react-i18next";

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

  const {t} = useTranslation()

  // Fonts
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Default address
  let cardStyle = styles.backgroundView;
  let star = "star-stroke";
  if (isDefault) {
    cardStyle = [styles.backgroundView, styles.backgroundViewDefault];
    star = "star-fill";
  }

  // Flat and floor numbers
  let flatAndFloorNumber = "";
  let flatAndFloorNumberStyle = styles.displayNone;
  
  if (flatOrApartmentNumber && floorNumber) {
    const floorLabel = getFloorLabel(floorNumber);
    flatAndFloorNumber = `${flatOrApartmentNumber}, ${floorLabel}`;
    flatAndFloorNumberStyle = styles.textWithIcon;
  } else if (flatOrApartmentNumber) {
    flatAndFloorNumber = flatOrApartmentNumber;
    flatAndFloorNumberStyle = styles.textWithIcon;
  } else if (floorNumber) {
    flatAndFloorNumber = getFloorLabel(floorNumber);
    flatAndFloorNumberStyle = styles.textWithIcon;
  }
  
  function getFloorLabel(floor) {
    switch (floor) {
      case "0":
        return t("addresses.addressCard.zeroFloor");
      case "1":
        return t("addresses.addressCard.firstFloor");
      case "2":
        return t("addresses.addressCard.secondFloor");
      case "3":
        return t("addresses.addressCard.thirdFloor");
      default:
        return `${floor} ${t("addresses.addressCard.anyFloor")}`;
    }
  }  

  let emailStyle = styles.displayNone;
  if (email != "") {
    emailStyle = styles.textWithIcon;
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
              <Icon name={star} width={20} height={20} fillColor={globalStyles.textOnPrimaryColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openAddressForm(id)}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Icon
                name="edit-pencil"
                width={20}
                height={20}
                fillColor={globalStyles.textOnPrimaryColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openDeleteConfirmation(id)}
              style={[styles.button, styles.buttonDelete]}
              activeOpacity={0.8}
            >
              <Icon name="trash" width={20} height={20} fillColor={globalStyles.textOnPrimaryColor} />
            </TouchableOpacity>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Phone number */}
        <View style={phoneNumberStyle}>
          <Icon name="phone" width={15} height={15} colorStroke={globalStyles.primaryColor} />
          <Text style={styles.text}>{phoneNumber}</Text>
        </View>

        {/* E-mail */}
        <View style={emailStyle}>
          <Icon name="envelope" width={15} height={15} fillColor={globalStyles.primaryColor} />
          <Text style={styles.text}>{email}</Text>
        </View>

        {/* Street + Building bumber */}
        <View style={styles.textWithIcon}>
          <Icon name="location" width={15} height={15} colorStroke={globalStyles.primaryColor}  />
          <Text style={styles.text}>
            {street} {buildingNumber}
          </Text>
        </View>

        {/* Flat number + Floor number */}
        <View style={flatAndFloorNumberStyle}>
          <Icon name="door" width={15} height={15} colorStroke={globalStyles.primaryColor}  />
          <Text style={styles.text}>{flatAndFloorNumber}</Text>
        </View>

        {/* Postal code + City + Country */}
        <View style={styles.textWithIcon}>
          <Icon name="city" width={15} height={15} fillColor={globalStyles.primaryColor} />
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
    color: globalStyles.primaryColor,
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
    backgroundColor: globalStyles.primaryColor,
    borderRadius: 15,
    padding: 7,
  },

  buttonDelete: {
    backgroundColor: globalStyles.redColor,
  },

  divider: {
    marginVertical: 10,
    height: 2,
    backgroundColor: globalStyles.primaryColor,
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
