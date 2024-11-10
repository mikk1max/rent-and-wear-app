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
  Modal,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles } from "../utils/style";
import { useForm, Controller } from "react-hook-form";
import { Divider } from "react-native-elements";

import { ref, onValue, update, get, set, remove } from "firebase/database";
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
        const addressesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        })); // przekształcamy obiekt adresów na tablicę
        setAddresses(addressesArray);
      } else {
        setAddresses([]); // jeśli brak adresów, ustawiamy pustą tablicę
      }
    });

    // Czyszczenie nasłuchiwania po odmontowaniu komponentu
    return () => unsubscribe();
  }, [userId]);

  const getAddressById = (addresses, addressId) => {
    return addresses.find(address => address.id === addressId);
  };

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
    if (getAddressById(addresses, addressId).isDefault === true) {
    // if (addresses[addressId].isDefault === true) {
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

  // Formularz
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Modal: Edit card
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Funkcja do otwierania i zamykania modalu
  };

  const emptyAddress = {
    adresse: null,
    phoneNumber: null,
    email: null,
    street: null,
    buildingNumber: null,
    flatOrApartmentNumber: null,
    floorNumber: null,
    postalCode: null,
    city: null,
    country: null,
    isDefault: false,
  };
  const [currentAddress, setCurrentAddress] = useState(emptyAddress);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [formTitle, setFormTitle] = useState("Create new address");

  const openAddressForm = (addressId) => {
    if (addressId != null) {
      setCurrentAddress(getAddressById(addresses, addressId));
      setCurrentAddressId(addressId);
      setFormTitle("Edit address for " + getAddressById(addresses, addressId).adresse);
    } else {
      setCurrentAddress(emptyAddress);
      setCurrentAddressId(null);
      setFormTitle("Create new address");
    }

    toggleModal();
  };

  // Ustawienie początkowych wartości dla wielu pól
  useEffect(() => {
    if (currentAddress) {
      setValue("adresse", currentAddress.adresse || "");
      setValue("phoneNumber", currentAddress.phoneNumber || "");
      setValue("email", currentAddress.email || "");
      setValue("street", currentAddress.street || "");
      setValue("buildingNumber", currentAddress.buildingNumber || "");
      setValue(
        "flatOrApartmentNumber",
        currentAddress.flatOrApartmentNumber || ""
      );
      setValue("floorNumber", currentAddress.floorNumber || "");
      setValue("postalCode", currentAddress.postalCode || "");
      setValue("city", currentAddress.city || "");
      setValue("country", currentAddress.country || "");
    }
  }, [currentAddress, setValue]);

  const onSubmit = (data) => {
    let formAddress = {
      adresse: data.adresse,
      phoneNumber: data.phoneNumber,
      email: data.email,
      street: data.street,
      buildingNumber: data.buildingNumber,
      flatOrApartmentNumber: data.flatOrApartmentNumber,
      floorNumber: data.floorNumber,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      isDefault: false,
    };

    if (currentAddressId != null) {
      formAddress.id = currentAddressId;
      formAddress.isDefault = currentAddress.isDefault;
      editAddress(formAddress, currentAddressId);
    } else {
      createAddress(formAddress);
    }

    toggleModal();
  };

  const onCancel = () => {
    reset();
    toggleModal();
  };

  // Funkcja do edytowania adresu o danym ID
  const editAddress = async (currentAddress, currentAddressId) => {
    try {
      const addressRef = ref(
        db,
        `users/${userId}/addresses/${currentAddressId}`
      );

      // Aktualizujemy adres na nowy
      await update(addressRef, currentAddress);
      console.log(`Address with ID ${currentAddressId} has been updated.`);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  // Funkcja do tworzenia nowego adresu
  const createAddress = async (currentAddress) => {
    try {
      const addressesRef = ref(db, `users/${userId}/addresses`);
      const snapshot = await get(addressesRef);
      const data = snapshot.val();

      let newAddressId;
      if (data) {
        // Pobieramy istniejące ID adresów i znajdujemy maksymalne
        const addressIds = Object.keys(data).map((id) => parseInt(id, 10));
        newAddressId = Math.max(...addressIds) + 1; // Nowy ID to max + 1
      } else {
        // Jeśli nie ma adresów, zaczynamy od ID 0
        newAddressId = 0;
      }

      // Tworzymy nowy adres o ID newAddressId
      await set(
        ref(db, `users/${userId}/addresses/${newAddressId}`),
        currentAddress
      );
      console.log(`New address added with ID ${newAddressId}`);
    } catch (error) {
      console.error("Error creating new address:", error);
    }
  };

  // Modal: Delete
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const toggleModalDelete = () => {
    setIsModalDeleteVisible(!isModalDeleteVisible); // Funkcja do otwierania i zamykania modalu
  };

  const [confirmationTitle, setConfirmationTitle] = useState();
  const openDeleteConfirmation = (addressId) => {
    setCurrentAddressId(addressId);
    setConfirmationTitle(getAddressById(addresses, addressId).adresse);
    toggleModalDelete();
  };

  const deleteAddress = async (currentAddressId) => {
    try {
      const addressRef = ref(
        db,
        `users/${userId}/addresses/${currentAddressId}`
      );

      // Aktualizujemy adres na nowy
      await remove(addressRef);
      console.log(`Address with ID ${currentAddressId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const confirmAddressDeletion = () => {
    deleteAddress(currentAddressId);
    toggleModalDelete();
  };

  const rejectAddressDeletion = () => {
    toggleModalDelete();
  };

  return (
    <View style={{ flex: 1, backgroundColor: globalStyles.backgroundColor }}>
      <View style={styles.container}>
        <View style={styles.scrollView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.addressesWithButton}>
              <View style={styles.addresses}>
                {addresses.map((address) => (
                  <AddressCard
                    key={addresses.indexOf(address)}
                    id={address.id}
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
                    openAddressForm={openAddressForm}
                    openDeleteConfirmation={openDeleteConfirmation}
                  />
                ))}
              </View>
              <TouchableOpacity
                onPress={() => openAddressForm()}
                style={styles.newAddressButton}
                activeOpacity={0.8}
              >
                <Text style={styles.newAddressButtonText}>New address</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      <Modal
        animationType="fade" // animacja otwierania
        transparent={true} // transparentne tło
        visible={isModalVisible}
        onRequestClose={onCancel} // zamykanie na Androidzie przyciskiem "back"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Title */}
              <Text style={styles.modalFormTitle}>{formTitle}</Text>
              <Divider style={styles.modalDivider} />

              {/* Adresse */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>
                  Adresse: <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.adresse && (
                  <Text style={styles.modalTextError}>
                    {errors.adresse.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: "Adresse is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Bob Smith / Macrosoft Sp. z o. o."
                      value={value}
                      autoCapitalize="none"
                      autoComplete="name"
                      inputMode="text"
                      editable={true}
                    />
                  )}
                  name="adresse"
                />
              </View>

              {/* Phone number */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Phone number:</Text>
                {errors.phoneNumber && (
                  <Text style={styles.modalTextError}>
                    {errors.phoneNumber.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    pattern: {
                      value: /^(?:\+48\d{9}|\d{9})$/,
                      message: "Invalid phone number format",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="+48987654321 / 987654321"
                      value={value}
                      autoCapitalize="none"
                      autoComplete="tel"
                      inputMode="tel"
                      editable={true}
                    />
                  )}
                  name="phoneNumber"
                />
              </View>

              {/* E-mail */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>E-mail:</Text>
                {errors.email && (
                  <Text style={styles.modalTextError}>
                    {errors.email.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    pattern: {
                      value:
                        /^(?!\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
                      message: "Invalid e-mail format",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="example@gmail.com"
                      value={value}
                      autoCapitalize="none"
                      autoComplete="email"
                      inputMode="email"
                      editable={true}
                    />
                  )}
                  name="email"
                />
              </View>

              {/* Street */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>
                  Street: <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.street && (
                  <Text style={styles.modalTextError}>
                    {errors.street.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: "Street is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="ul. Nadbystrzycka"
                      value={value}
                      autoCapitalize="words"
                      autoComplete="street-address"
                      inputMode="text"
                      editable={true}
                    />
                  )}
                  name="street"
                />
              </View>

              {/* Building number */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>
                  Building number: <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.buildingNumber && (
                  <Text style={styles.modalTextError}>
                    {errors.buildingNumber.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: "Building number is required",
                    pattern: {
                      value: /^[0-9]{1,4}[A-Za-z]?$/,
                      message: "Invalid building number format",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="38Y"
                      value={value}
                      autoCapitalize="characters"
                      autoComplete="off"
                      inputMode="text"
                      editable={true}
                    />
                  )}
                  name="buildingNumber"
                />
              </View>

              {/* Flar of Apartment number */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Flat or Apartment number:</Text>
                {errors.flatOrApartmentNumber && (
                  <Text style={styles.modalTextError}>
                    {errors.flatOrApartmentNumber.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="m. 22"
                      value={value}
                      autoCapitalize="none"
                      autoComplete="off"
                      inputMode="text"
                      editable={true}
                    />
                  )}
                  name="flatOrApartmentNumber"
                />
              </View>

              {/* Floor number */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Floor number:</Text>
                {errors.floorNumber && (
                  <Text style={styles.modalTextError}>
                    {errors.floorNumber.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    pattern: {
                      value: /^(0|[1-9][0-9]{0,1}|1[0-9]{2}|200|-([1-9]))$/,
                      message: "Invalid floor number format",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="12"
                      value={value}
                      autoCapitalize="none"
                      autoComplete="off"
                      inputMode="numeric"
                      editable={true}
                    />
                  )}
                  name="floorNumber"
                />
              </View>

              {/* Postal code */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>
                  Postal code: <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.postalCode && (
                  <Text style={styles.modalTextError}>
                    {errors.postalCode.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: "Postal code is required",
                    pattern: {
                      value: /^[0-9]{2}-[0-9]{3}$/,
                      message: "Invalid postal code format",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="20-501"
                      value={value}
                      autoCapitalize="none"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      editable={true}
                    />
                  )}
                  name="postalCode"
                />
              </View>

              {/* City */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>
                  City: <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.city && (
                  <Text style={styles.modalTextError}>
                    {errors.city.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: "City is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Lublin"
                      value={value}
                      autoCapitalize="words"
                      autoComplete="off"
                      inputMode="text"
                      editable={true}
                    />
                  )}
                  name="city"
                />
              </View>

              {/* Country */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>
                  Country: <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.country && (
                  <Text style={styles.modalTextError}>
                    {errors.country.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: "Country is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Polska"
                      value={value}
                      autoCapitalize="words"
                      autoComplete="country"
                      inputMode="text"
                      editable={true}
                    />
                  )}
                  name="country"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  activeOpacity={0.8}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  activeOpacity={0.8}
                  onPress={onCancel}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade" // animacja otwierania
        transparent={true} // transparentne tło
        visible={isModalDeleteVisible}
        onRequestClose={rejectAddressDeletion} // zamykanie na Androidzie przyciskiem "back"
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalCard, { gap: 15 }]}>
            <Text style={styles.modalFormTitle}>
              Delete address for {confirmationTitle}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                activeOpacity={0.8}
                onPress={confirmAddressDeletion}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalRejectButton}
                activeOpacity={0.8}
                onPress={rejectAddressDeletion}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: globalStyles.redColor },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // lekko przyciemnione tło,
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "80%",
    padding: 20,
    margin: 20,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: globalStyles.backgroundColor,
  },

  modalFormTitle: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.accentColor,
  },

  modalDivider: {
    marginVertical: 10,
    height: 2,
    backgroundColor: globalStyles.accentColor,
  },

  modalInputContainer: {
    gap: 5,
    marginBottom: 10,
  },

  modalLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.primaryColor,
  },

  modalTextInput: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.textOnSecondaryColor,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: 15,
    padding: 10,
  },

  modalTextError: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.redColor,
    backgroundColor: "#FFCCCF",
    paddingTop: 7,
    paddingHorizontal: 10,
    paddingBottom: 22,
    marginBottom: -25,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modalSaveButton: {
    width: "50%",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: "green",
    padding: 7,
    alignItems: "center",
  },

  modalCancelButton: {
    width: "50%",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: globalStyles.redColor,
    padding: 7,
    alignItems: "center",
  },

  modalButtonText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnPrimaryColor,
  },

  addressesWithButton: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 15,
  },

  newAddressButton: {
    backgroundColor: globalStyles.accentColor,
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 15,
  },

  newAddressButtonText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.textOnAccentColor,
  },

  modalDeleteButton: {
    width: "50%",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: globalStyles.redColor,
    padding: 7,
    alignItems: "center",
  },

  modalRejectButton: {
    width: "50%",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderColor: globalStyles.redColor,
    borderWidth: 3,
    padding: 4,
    backgroundColor: globalStyles.backgroundColor,
    alignItems: "center",
  },
});

export default AddressesView;
