import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
  Image,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles } from "../utils/style";
import { useForm, Controller } from "react-hook-form";
import { Divider } from "react-native-elements";

import { ref, onValue, update, get } from "firebase/database";
import { db } from "../../firebaseConfig";
import AddressCard from "../components/AddressCard";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const AddressesView = () => {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Addresses
  const [addresses, setAddresses] = useState([[]]);
  const userId = 0;
  useEffect(() => {
    const addressesRef = ref(db, `users/${userId}/addresses`);
    const unsubscribe = onValue(addressesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const addressesArray = Object.values(data); // przekształcamy obiekt adresów na tablicę
        setAddresses(addressesArray);
      } else {
        setAddresses([]); // jeśli brak adresów, ustawiamy pustą tablicę
      }
    });

    // Czyszczenie nasłuchiwania po odmontowaniu komponentu
    return () => unsubscribe();
  }, [userId]);

  // Funkcja, która ustawia isDefault na false dla bieżącego domyślnego adresu użytkownika
  const findAndUnsetDefaultAddress = async () => {
    try {
      // Referencja do wszystkich adresów użytkownika
      const addressesRef = ref(db, `users/${userId}/addresses`);
      const snapshot = await get(addressesRef);
      const data = snapshot.val();

      if (data) {
        // Szukamy adresu, który ma isDefault ustawione na true
        const addressToUnset = Object.entries(data).find(
          ([, address]) => address.isDefault === true
        );

        if (addressToUnset) {
          const [addressId] = addressToUnset;
          // Zmieniamy isDefault na false dla znalezionego adresu
          await update(ref(db, `users/${userId}/addresses/${addressId}`), {
            isDefault: false,
          });
          console.log(`Unset isDefault for address ID: ${addressId}`);
        } else {
          console.log("No default address found");
        }
      } else {
        console.log("No addresses found for this user");
      }
    } catch (error) {
      console.error("Error unsetting default address:", error);
    }
  };

  // Funkcja, która ustawia isDefault na true dla adresu o podanym addressId
  const setOrUnsetDefaultAddress = async (addressId) => {
    if (addresses[addressId].isDefault === true) {
      try {
        // Zmieniamy isDefault na false dla wskazanego addressId
        await update(ref(db, `users/${userId}/addresses/${addressId}`), {
          isDefault: false,
        });
        console.log(`Unset isDefault for address ID: ${addressId}`);
      } catch (error) {
        console.error("Error unsetting default address:", error);
      }
    } else {
      findAndUnsetDefaultAddress();
      try {
        // Zmieniamy isDefault na true dla wskazanego addressId
        await update(ref(db, `users/${userId}/addresses/${addressId}`), {
          isDefault: true,
        });
        console.log(`Set isDefault for address ID: ${addressId}`);
      } catch (error) {
        console.error("Error setting default address:", error);
      }
    }
  };

  // Mark as default address function
  const selectAsDefaultAddress = (addressId) => {};

  const deselectDefaultAddress = (addressId) => {};

  return (
    <View style={{ flex: 1, backgroundColor: globalStyles.backgroundColor }}>
      <View style={styles.container}>
        <View style={styles.scrollView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.addresses}>
              {addresses.map((address) => (
                <AddressCard
                  key={addresses.indexOf(address)}
                  id={addresses.indexOf(address)}
                  adresse={address.adresse}
                  phoneNumber={address.phoneNumber}
                  email={address.email}
                  street={address.street}
                  buildingNumber={address.buildingNumber}
                  flatOrApartmentNumber={address.flatOrApartmentNumber}
                  floorNumber={address.floorNumber}
                  postalCode={address.postalCode}
                  city={address.city}
                  country={address.country}
                  isDefault={address.isDefault}
                  selectAsDefaultAddress={setOrUnsetDefaultAddress}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingHorizontal: 25,
    justifyContent: "flex-start",
  },

  scrollView: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
  },

  addresses: {
    gap: 15,
  },
});

export default AddressesView;
