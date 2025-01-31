import React, { useEffect, useState, useTransition } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useForm, Controller } from "react-hook-form";
import { Divider } from "react-native-elements";
import { ref, onValue, update, get, set, remove } from "firebase/database";
import { db } from "../../firebase.config";
import AddressCard from "../components/AddressCard";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { styles } from "../styles/AddressesViewStyles";
import { useUser } from "../components/UserProvider";
import { useTranslation } from "react-i18next";
import NoAddressesYet from "../components/NoAddressesYet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddressesView = () => {
  const { t } = useTranslation();
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const { user, setUser } = useUser();

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const addressesRef = ref(db, `users/${user.id}/addresses`);
    const unsubscribe = onValue(addressesRef, (snapshot) => {
      const data = snapshot.val();
      setAddresses(
        data ? Object.entries(data).map(([id, addr]) => ({ id, ...addr })) : []
      );
    });

    return () => unsubscribe();
  }, [user.id]);

  const getAddressById = (addresses, addressId) => {
    return addresses.find((address) => address.id === addressId);
  };

  // Funkcja, która ustawia isDefault na false dla bieżącego domyślnego adresu użytkownika
  const findAndUnsetDefaultAddress = async () => {
    try {
      // Referencja do wszystkich adresów użytkownika
      const addressesRef = ref(db, `users/${user.id}/addresses`);
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
          await update(ref(db, `users/${user.id}/addresses/${addressId}`), {
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
        await update(ref(db, `users/${user.id}/addresses/${addressId}`), {
          isDefault: false,
        });
        console.log(`Unset isDefault for address ID: ${addressId}`);
      } catch (error) {
        console.error("Error unsetting default address:", error);
      }
    } else {
      await findAndUnsetDefaultAddress();
      try {
        // Zmieniamy isDefault na true dla wskazanego addressId
        await update(ref(db, `users/${user.id}/addresses/${addressId}`), {
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
  const [formTitle, setFormTitle] = useState(t("addresses.newAddressBtn"));

  const openAddressForm = (addressId) => {
    if (addressId != null) {
      const address = getAddressById(addresses, addressId);
      setCurrentAddress(address ? { ...address } : emptyAddress);
      setCurrentAddressId(addressId || null);

      setFormTitle(
        `${t("addresses.editAddressFor")} ` +
          getAddressById(addresses, addressId).adresse
      );
    } else {
      setCurrentAddress(emptyAddress);
      setCurrentAddressId(null);
      setFormTitle(t("addresses.newAddressBtn"));
    }

    toggleModal();
  };

  // Ustawienie początkowych wartości dla wielu pól
  useEffect(() => {
    if (currentAddress !== null) {
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
    setCurrentAddress(null);
    setCurrentAddressId(null);
    toggleModal();
  };

  // Funkcja do edytowania adresu o danym ID
  const editAddress = async (currentAddress, currentAddressId) => {
    try {
      const addressRef = ref(
        db,
        `users/${user.id}/addresses/${currentAddressId}`
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
      const addressesRef = ref(db, `users/${user.id}/addresses`);
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
        ref(db, `users/${user.id}/addresses/${newAddressId}`),
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
        `users/${user.id}/addresses/${currentAddressId}`
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
    <SafeAreaView style={mainStyles.whiteBack}>
      <StatusBar backgroundColor={globalStyles.primaryColor} barStyle="light-content" />
      <View style={[mainStyles.container, { paddingTop: 0 }]}>
        <View style={[mainStyles.scrollBase, { marginTop: 20 }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.addressesWithButton}>
              <View style={styles.addresses}>
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <AddressCard
                      key={`AddressCard_${address.id}`}
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
                  ))
                ) : (
                  <NoAddressesYet />
                )}
              </View>
              <TouchableOpacity
                onPress={() => openAddressForm()}
                style={styles.newAddressButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Text style={styles.newAddressButtonText}>
                  {t("addresses.newAddressBtn")}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      <Modal
        animationType="slide" // animacja otwierania
        transparent={true} // transparentne tło
        visible={isModalVisible}
        onRequestClose={onCancel} // zamykanie na Androidzie przyciskiem "back"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={[mainStyles.scrollBase, { marginVertical: 40 }]}
            >
              {/* Title */}
              <Text style={[styles.modalFormTitle, { marginTop: 20 }]}>
                {formTitle}
              </Text>
              <Divider style={styles.modalDivider} />

              {/* Adresse */}
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>
                  {`${t("addresses.modalAddEdit.addresseeLabel")}: `}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.adresse && (
                  <Text style={styles.modalTextError}>
                    {errors.adresse.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: `${t(
                      "addresses.modalAddEdit.addresseeValidationR"
                    )}: `,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t(
                        "addresses.modalAddEdit.addresseePlaceholder"
                      )}
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
                <Text style={styles.modalLabel}>{`${t(
                  "addresses.modalAddEdit.phoneLabel"
                )}`}</Text>
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
                      message: `${t(
                        "addresses.modalAddEdit.phoneValidationP"
                      )}`,
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={`${t(
                        "addresses.modalAddEdit.phonePlaceholder"
                      )}`}
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
                <Text style={styles.modalLabel}>{`${t(
                  "addresses.modalAddEdit.emailLabel"
                )}: `}</Text>
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
                      message: t("addresses.modalAddEdit.emailValidationP"),
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t("addresses.modalAddEdit.emailPlaceholder")}
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
                  {`${t("addresses.modalAddEdit.streetLabel")}: `}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.street && (
                  <Text style={styles.modalTextError}>
                    {errors.street.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: t("addresses.modalAddEdit.streetValidationR"),
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t(
                        "addresses.modalAddEdit.streetPlaceholder"
                      )}
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
                  {`${t("addresses.modalAddEdit.buildingLabel")}: `}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.buildingNumber && (
                  <Text style={styles.modalTextError}>
                    {errors.buildingNumber.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: t("addresses.modalAddEdit.buildingValidationR"),
                    pattern: {
                      value: /^[0-9]{1,4}[A-Za-z]?$/,
                      message: t("addresses.modalAddEdit.buildingValidationP"),
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t(
                        "addresses.modalAddEdit.buildingPlaceholder"
                      )}
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
                <Text style={styles.modalLabel}>{`${t(
                  "addresses.modalAddEdit.apartmentLabel"
                )}: `}</Text>
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
                      placeholder={t(
                        "addresses.modalAddEdit.apartmentPlaceholder"
                      )}
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
                <Text style={styles.modalLabel}>{`${t(
                  "addresses.modalAddEdit.floorLabel"
                )}: `}</Text>
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
                      message: t("addresses.modalAddEdit.floorValidationP"),
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t("addresses.modalAddEdit.floorPlaceholder")}
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
                  {`${t("addresses.modalAddEdit.postalCodeLabel")}: `}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.postalCode && (
                  <Text style={styles.modalTextError}>
                    {errors.postalCode.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: t("addresses.modalAddEdit.postalCodeValidationR"),
                    pattern: {
                      value: /^[0-9]{2}-[0-9]{3}$/,
                      message: t(
                        "addresses.modalAddEdit.postalCodeValidationP"
                      ),
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t(
                        "addresses.modalAddEdit.postalCodePlaceholder"
                      )}
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
                  {`${t("addresses.modalAddEdit.cityLabel")}: `}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.city && (
                  <Text style={styles.modalTextError}>
                    {errors.city.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: t("addresses.modalAddEdit.cityValidationR"),
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t("addresses.modalAddEdit.cityPlaceholder")}
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
                  {`${t("addresses.modalAddEdit.countryLabel")}: `}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
                {errors.country && (
                  <Text style={styles.modalTextError}>
                    {errors.country.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  rules={{
                    required: t("addresses.modalAddEdit.countryValidationR"),
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.modalTextInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t(
                        "addresses.modalAddEdit.countryPlaceholder"
                      )}
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
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.modalButtonText}>{`${t(
                    "universal.saveBtn"
                  )}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                  onPress={onCancel}
                >
                  <Text style={styles.modalButtonText}>{`${t(
                    "universal.cancelBtn"
                  )}`}</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
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
          <View style={styles.modalCardMini}>
            <Text style={styles.modalFormTitle}>
              {`${t("addresses.deleteAddressFor")}`} {confirmationTitle}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={confirmAddressDeletion}
              >
                <Text style={styles.modalButtonText}>{`${t(
                  "universal.deleteBtn"
                )}`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalRejectButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={rejectAddressDeletion}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: globalStyles.redColor },
                  ]}
                >
                  {`${t("universal.cancelBtn")}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddressesView;
