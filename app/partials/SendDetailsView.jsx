import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { Divider } from "react-native-elements";
import { Rating } from "react-native-ratings";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  ref,
  onValue,
  update,
  get,
  set,
  remove,
  goOnline,
  push,
} from "firebase/database";
import { db, storage } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import Icon from "../components/Icon";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";

import {
  CreditCardView,
  CreditCardInput,
  LiteCreditCardInput,
  CreditCardFormData,
  CreditCardFormField,
  ValidationState,
} from "react-native-credit-card-input";

import { Barcode } from "expo-barcode-generator";
import { cutAdvertiserNameInDetails } from "../utils/func";

const { width } = Dimensions.get("window");

const SendDetailsView = ({ route }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { user, setUser } = useUser();
  const { id } = route.params || {};

  const [currentRentOrReservation, setCurrentRentOrReservation] =
    useState(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [borrower, setBorrower] = useState(null);
  const [owner, setOwner] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("None"); // "None", "Card", "BLIK"
  const [cardFocusedField, setCardFocusedField] = useState();
  const [cardFormData, setCardFormData] = useState();
  const [valueBLIK, setValueBLIK] = useState();
  const [errorBLIK, setErrorBLIK] = useState("This field cannot be empty");
  const [isBarcodeVisible, setBarcodeVisible] = useState(false);
  const [isOpinionFormVisible, setOpinionFormVisible] = useState(false);
  const [valueOpinion, setValueOpinion] = useState();
  const [errorOpinion, setErrorOpinion] = useState(
    "This field cannot be empty"
  );
  const [ratingValue, setRatingValue] = useState(0);

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  if (!db) {
    console.error("Firebase database is not initialized.");
    return;
  }

  const getDateInXDays = (day, days) => {
    let dayInXDays = new Date(day);
    dayInXDays.setDate(dayInXDays.getDate() + days);
    return dayInXDays;
  };

  const type = currentRentOrReservation?.type;
  const statusInfo = [
    "",
    t("getsDetails.statusInfo.pendingConfirmation"),
    t("getsDetails.statusInfo.reserved", {
      remainingAmount: (
        Math.round(currentRentOrReservation?.amount * 0.8 * 100) / 100
      ).toFixed(2),
      dueDate: getDateInXDays(
        new Date(parseInt(currentRentOrReservation?.startDate)),
        -2
      ).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
    }),
    t("getsDetails.statusInfo.inProgress"),
    t("getsDetails.statusInfo.shipped"),
    t("getsDetails.statusInfo.inUse"),
    t("getsDetails.statusInfo.returned"),
    t("getsDetails.statusInfo.completed"),
    t("getsDetails.statusInfo.canceled"),
  ];

  useEffect(() => {
    const announcementsRef = ref(db, "announcements");
    get(announcementsRef)
      .then((snapshot) => {
        const announcements = snapshot.val();
        if (announcements) {
          let foundAnnouncement = null;
          Object.keys(announcements).forEach((announcementId) => {
            const announcement = announcements[announcementId];
            if (announcement?.rentalData?.[id]) {
              foundAnnouncement = { id: announcementId, ...announcement };
            }
          });
          setCurrentAnnouncement(foundAnnouncement);
        }
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania ogłoszeń:", error);
      });
  }, [id]);

  useEffect(() => {
    if (!currentAnnouncement) return;

    // setBorrower(currentAnnouncement.rentalData?.[id]?.borrowerId || "Unknown Borrower");
    setOwner(currentAnnouncement.advertiserId || "Unknown Owner");
  }, [currentAnnouncement]);

  // Pobieranie danych użytkownika z bazy
  useEffect(() => {
    // if (!borrower || borrower === "Unknown Borrower") return;

    const usersRef = ref(
      db,
      `users/${currentAnnouncement?.rentalData?.[id]?.borrowerId}`
    );
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();
        setBorrower(data || null);
      },
      (error) => {
        console.error("Błąd podczas pobierania danych:", error);
      }
    );

    return () => unsubscribe();
  }, [currentAnnouncement]);

  useEffect(() => {
    if (currentAnnouncement) {
      let rentOrReservation = null;
      if (currentAnnouncement.rentalData) {
        rentOrReservation = currentAnnouncement.rentalData[id];
      }
      if (currentAnnouncement.reservationData && !rentOrReservation) {
        rentOrReservation = currentAnnouncement.reservationData[id];
      }
      setCurrentRentOrReservation({ id, ...rentOrReservation });
    }
  }, [currentAnnouncement]);

  useEffect(() => {
    if (currentRentOrReservation) {
      let address = "";
      address += currentRentOrReservation.destinationAddress.street;
      address +=
        " " + currentRentOrReservation.destinationAddress.buildingNumber;
      if (currentRentOrReservation.destinationAddress.flatOrApartmentNumber) {
        address +=
          " / " +
          currentRentOrReservation.destinationAddress.flatOrApartmentNumber;
      }
      if (currentRentOrReservation.destinationAddress.floorNumber) {
        address +=
          " (floor " +
          currentRentOrReservation.destinationAddress.floorNumber +
          ")";
      }
      setDeliveryAddress(address);
    }
  }, [currentRentOrReservation]);

  const onChatPress = () => {
    const announcementId = currentAnnouncement.id;
    const advertiserId = currentAnnouncement.advertiserId;
    const buyerId = currentRentOrReservation.borrowerId;
    const userId = user.id;
  
    // Determine the participant roles
    const isAdvertiser = userId === advertiserId;
    const otherPartyId = isAdvertiser ? buyerId : advertiserId;
  
    const chatRef = ref(db, "chats");
  
    get(chatRef)
      .then((snapshot) => {
        const chats = snapshot.val();
        let chatId = null;
  
        if (chats) {
          for (const key in chats) {
            const chat = chats[key];
  
            if (
              chat.announcementId === announcementId &&
              ((chat.advertiserId === advertiserId && chat.userId === buyerId) ||
                (chat.advertiserId === buyerId && chat.userId === advertiserId))
            ) {
              chatId = key;
              break;
            }
          }
        }
  
        if (chatId) {
          console.log(`Navigating to existing chat with ID: ${chatId}`);
          navigation.navigate("Chat", { chatId });
        } else {
          console.log("No existing chat found, creating a new one...");
  
          const newChat = {
            announcementId,
            advertiserId,
            userId: otherPartyId,
            messages: [],
            timestamp: Date.now(),
          };
  
          const newChatRef = push(chatRef);
          set(newChatRef, newChat).then(() => {
            console.log(`New chat created with ID: ${newChatRef.key}`);
            navigation.navigate("Chat", { chatId: newChatRef.key });
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  };
  

  const updateStatus = (code, name) => {
    const basePath = `announcements/${currentAnnouncement.id}`;

    // Определяем поле для обновления в зависимости от типа
    const dataPath = type === "Rent" ? "rentalData" : "reservationData";

    try {
      // Обновляем statusCode и statusName отдельно
      update(
        ref(
          db,
          `${basePath}/${dataPath}/${currentRentOrReservation.id}/status`
        ),
        {
          statusCode: code,
          statusName: name,
        }
      );

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    if (valueBLIK) {
      // console.log(isNaN(NaN));
      if (!isNaN(valueBLIK)) {
        if (valueBLIK.toString().length < 6) {
          setErrorBLIK("The code should consist of 6 characters");
        } else if (valueBLIK.toString().length === 6) {
          setErrorBLIK(null);
        } else {
          setErrorBLIK("Błąd");
        }
      } else {
        setErrorBLIK("The code should consist of numbers");
      }
    } else {
      setErrorBLIK("The field cannot be empty");
    }
  }, [valueBLIK]);

  const toggleModalBarcode = () => {
    setBarcodeVisible(!isBarcodeVisible); // Funkcja do otwierania i zamykania modalu
    console.log(`Barcode - ${isBarcodeVisible}`);
  };

  if (
    !currentRentOrReservation ||
    !currentAnnouncement ||
    !borrower ||
    !owner
  ) {
    return <Loader />;
  }

  return (
    // <SafeAreaView style={mainStyles.whiteBack}>
    //   <View
    //     style={[
    //       mainStyles.container,
    //       mainStyles.scrollBase,
    //       { paddingTop: 20 },
    //     ]}
    //   >
    //     {console.log("currentRentOrReservation: ")}
    //     {console.log(currentRentOrReservation)}
    //     {console.log("currentAnnouncement: ")}
    //     {console.log(currentAnnouncement)}
    //     {console.log("borrower: ")}
    //     {console.log(borrower)}
    //     {console.log("owner: ")}
    //     {console.log(owner)}
    //     <Text>{`Borrower ID: ${borrower}`}</Text>
    //     <Text>{`Owner ID: ${owner}`}</Text>
    //   </View>
    // </SafeAreaView>

    <SafeAreaView style={mainStyles.whiteBack}>
      {console.log("currentRentOrReservation: ")}
      {console.log(currentRentOrReservation)}
      {console.log("currentAnnouncement: ")}
      {console.log(currentAnnouncement)}
      {console.log("borrower: ")}
      {console.log(borrower)}
      {console.log("owner: ")}
      {console.log(owner)}
      <View
        style={[
          mainStyles.container,
          mainStyles.scrollBase,
          { paddingTop: 20 },
        ]}
      >
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={mainStyles.scrollBase}
        >
          <View style={styles.imageWithDateAndNumberContainer}>
            <Image
              style={styles.image}
              source={{ uri: currentAnnouncement?.images[0] }}
            />
            <View style={styles.dateWithNumberContainer}>
              <View>
                <Text style={styles.dateOrNumberTextLabel}>
                  {t("getsDetails.rentDetails.rentNo")}
                </Text>
                <Text style={styles.dateOrNumberTextValue}>{id}</Text>
              </View>
              <View>
                <Text style={styles.dateOrNumberTextLabel}>
                  {t("getsDetails.rentDetails.rentDate")}
                </Text>
                <Text style={styles.dateOrNumberTextValue}>
                  {new Date(
                    parseInt(
                      currentRentOrReservation?.id.startsWith("ROR_")
                        ? currentRentOrReservation?.id.substring(4)
                        : currentRentOrReservation?.id
                    )
                  ).toLocaleDateString(i18n.language, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View>
                <Text style={styles.dateOrNumberTextLabel}>
                  {t("getsDetails.rentDetails.status")}
                </Text>
                <Text style={styles.dateOrNumberTextValue}>
                  {t(
                    `statusNames.${currentRentOrReservation.status?.statusName}`
                  )}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.advertiserInfo}>
            <Text style={styles.advertiserLabel}>{`${t(
              "getsDetails.rentDetails.advertiserLabel"
            )}:`}</Text>
            <Text style={styles.advertiserValue}>
              {cutAdvertiserNameInDetails(
                `${borrower.name} ${borrower.surname}`
              )}
            </Text>
            <TouchableOpacity
              style={styles.advertiserButton}
              activeOpacity={globalStyles.ACTIVE_OPACITY}
              onPress={onChatPress}
            >
              <Icon
                name="envelope"
                width={30}
                height={30}
                // colorStroke={globalStyles.textOnPrimaryColor}
                fillColor={globalStyles.textOnPrimaryColor}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>{`${t(
              "getsDetails.rentDetails.statusInfoLabel"
            )}:`}</Text>
            <Text style={styles.statusText}>
            {statusInfo[currentRentOrReservation.status.statusCode]}
            </Text>

            {currentRentOrReservation.status.statusCode === 2 && (
              <View style={styles.paymentContainer}>
                <Text style={styles.paymentLabel}>
                  {t("getsDetails.rentDetails.payForRentingLabel")}:
                </Text>
                <View style={styles.paymentMethodButtons}>
                  <TouchableOpacity
                    style={
                      selectedPaymentMethod === "Card"
                        ? styles.paymentMethodCardButtonSelected
                        : styles.paymentMethodCardButtonNotSelected
                    }
                    onPress={() => selectPaymentMethod("Card")}
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
                    disabled={selectedPaymentMethod === "Card" ? true : false}
                  >
                    <Text
                      style={
                        selectedPaymentMethod === "Card"
                          ? styles.paymentMethodCardTextSelected
                          : styles.paymentMethodCardTextNotSelected
                      }
                    >
                      {t("rentItNow.paymentMethodCardText")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      selectedPaymentMethod === "BLIK"
                        ? styles.paymentMethodBLIKButtonSelected
                        : styles.paymentMethodBLIKButtonNotSelected
                    }
                    onPress={() => selectPaymentMethod("BLIK")}
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
                    disabled={selectedPaymentMethod === "BLIK" ? true : false}
                  >
                    <Text
                      style={
                        selectedPaymentMethod === "BLIK"
                          ? styles.paymentMethodBLIKTextSelected
                          : styles.paymentMethodBLIKTextNotSelected
                      }
                    >
                      {t("rentItNow.paymentMethodBLIKText")}
                    </Text>
                  </TouchableOpacity>
                </View>
                {selectedPaymentMethod === "Card" && (
                  <View style={styles.paymentCardContainer}>
                    <CreditCardView
                      focusedField={cardFocusedField}
                      type={cardFormData?.values.type}
                      number={cardFormData?.values.number}
                      expiry={cardFormData?.values.expiry}
                      cvc={cardFormData?.values.cvc}
                      style={styles.paymentCardView}
                    />
                    <LiteCreditCardInput
                      autoFocus
                      style={styles.paymentCardInput}
                      inputStyle={styles.paymentCardInputText}
                      placeholderColor="gray"
                      onChange={setCardFormData}
                      onFocusField={setCardFocusedField}
                    />
                    <View style={styles.paymentCardInfoContainer}>
                      <View style={styles.paymentCardInfo}>
                        <Icon
                          name={
                            cardFormData?.valid
                              ? "circle-accept"
                              : "circle-denied"
                          }
                          width={15}
                          height={15}
                          fillColor={
                            cardFormData?.valid
                              ? "green"
                              : globalStyles.redColor
                          }
                        />
                        <Text
                          style={
                            cardFormData?.valid
                              ? [styles.paymentCardInfoText, { color: "green" }]
                              : [
                                  styles.paymentCardInfoText,
                                  { color: globalStyles.redColor },
                                ]
                          }
                        >
                          {cardFormData?.valid
                            ? `${t("rentItNow.cardValidText")}`
                            : `${t("rentItNow.cardNotValidText")}`}
                        </Text>
                      </View>
                      <View style={styles.paymentCardInfo}>
                        <Icon
                          name={statusToIcon(cardFormData?.status.number)}
                          width={15}
                          height={15}
                          fillColor={statusToColor(cardFormData?.status.number)}
                        />
                        <Text style={styles.paymentCardInfoText}>
                          {`${t("rentItNow.paymentCardInfoTextNum")}: `}
                          <Text
                            style={{ color: globalStyles.textOnSecondaryColor }}
                          >
                            {cardFormData?.values.number}
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.paymentCardInfo}>
                        <Icon
                          name={statusToIcon(cardFormData?.status.expiry)}
                          width={15}
                          height={15}
                          fillColor={statusToColor(cardFormData?.status.expiry)}
                        />
                        <Text style={styles.paymentCardInfoText}>
                          {`${t("rentItNow.paymentCardInfoTextExp")}: `}
                          <Text
                            style={{ color: globalStyles.textOnSecondaryColor }}
                          >
                            {cardFormData?.values.expiry}
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.paymentCardInfo}>
                        <Icon
                          name={statusToIcon(cardFormData?.status.cvc)}
                          width={15}
                          height={15}
                          fillColor={statusToColor(cardFormData?.status.cvc)}
                        />
                        <Text style={styles.paymentCardInfoText}>
                          {`${t("rentItNow.paymentCardInfoTextCVC")}: `}
                          <Text
                            style={{ color: globalStyles.textOnSecondaryColor }}
                          >
                            {cardFormData?.values.cvc}
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.paymentCardInfo}>
                        <Icon
                          name="circle-info"
                          width={15}
                          height={15}
                          fillColor="blue"
                        />
                        <Text style={styles.paymentCardInfoText}>
                          {`${t("rentItNow.paymentCardInfoTextType")}: `}
                          <Text
                            style={{ color: globalStyles.textOnSecondaryColor }}
                          >
                            {cardFormData?.values.type
                              ? cardFormData?.values.type
                              : ""}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {selectedPaymentMethod === "BLIK" && (
                  <View style={styles.paymentBLIKContainer}>
                    {errorBLIK && (
                      <Text style={styles.paymentBLIKError}>{errorBLIK}</Text>
                    )}

                    <TextInput
                      style={styles.paymentBLIKTextInput}
                      // onBlur={setValueBLIK}
                      onChangeText={setValueBLIK}
                      placeholder={t("rentItNow.placeholderBlIK")}
                      placeholderTextColor={"gray"}
                      value={valueBLIK}
                      maxLength={6}
                      autoCapitalize="none"
                      autoComplete="off"
                      inputMode="numeric"
                      multiline={false}
                      editable={true}
                    />
                  </View>
                )}
              </View>
            )}

            {currentRentOrReservation.status.statusCode === 2 &&
              ((selectedPaymentMethod === "Card" && cardFormData?.valid) ||
                (selectedPaymentMethod === "BLIK" &&
                  valueBLIK &&
                  !errorBLIK)) && (
                <TouchableOpacity
                  style={styles.payForRentingButton}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                  onPress={confirmReservation}
                >
                  <Text style={styles.payForRentingText}>
                    {t("getsDetails.rentDetails.payForRenting")}
                  </Text>
                </TouchableOpacity>
              )}

            {(currentRentOrReservation.status.statusCode === 1 ||
              currentRentOrReservation.status.statusCode === 2 ||
              currentRentOrReservation.status.statusCode === 3) && (
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={cancelThisRent}
              >
                <Text style={styles.cancelText}>
                  {t("getsDetails.rentDetails.cancelThisRent")}
                </Text>
              </TouchableOpacity>
            )}

            {currentRentOrReservation.status.statusCode === 4 && (
              <TouchableOpacity
                style={styles.confirmDeliveryButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={confirmDelivery}
              >
                <Text style={styles.confirmDeliveryText}>
                  {t("getsDetails.rentDetails.delivery.confirmDelivery")}
                </Text>
              </TouchableOpacity>
            )}

            {currentRentOrReservation.status.statusCode === 5 && (
              <TouchableOpacity
                style={styles.confirmShippingButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={confirmShipping}
              >
                <Text style={styles.confirmShippingText}>
                  {t("getsDetails.rentDetails.delivery.confirmShipping")}
                </Text>
              </TouchableOpacity>
            )}

            {currentRentOrReservation.status.statusCode === 7 &&
              !currentRentOrReservation.hasOpinion && (
                <View style={styles.opinionContainer}>
                  <TouchableOpacity
                    style={styles.writeOpinionButton}
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
                    onPress={() => setOpinionFormVisible(!isOpinionFormVisible)}
                  >
                    <View style={styles.writeOpinionLine}>
                      <Text style={styles.writeOpinionText}>
                        {t("getsDetails.rentDetails.opinion.writeOpinion")}
                      </Text>
                      <Icon
                        name={isOpinionFormVisible ? "arrow-up" : "arrow-down"}
                        width={22}
                        height={22}
                      />
                    </View>
                  </TouchableOpacity>
                  {isOpinionFormVisible && (
                    <View style={styles.opinionFormContainer}>
                      <Rating
                        type={"custom"}
                        style={styles.opinionRating}
                        imageSize={35}
                        ratingColor={globalStyles.accentColor}
                        tintColor={globalStyles.backgroundColor}
                        ratingBackgroundColor={globalStyles.secondaryColor}
                        fractions={0}
                        onFinishRating={ratingCompleted}
                        startingValue={ratingValue}
                      />
                      <TextInput
                        style={styles.opinionInput}
                        onChangeText={setValueOpinion}
                        placeholder={t(
                          "getsDetails.rentDetails.opinion.placeholder"
                        )}
                        placeholderTextColor={"gray"}
                        value={valueOpinion}
                        maxLength={1000}
                        autoCapitalize="sentences"
                        autoComplete="off"
                        inputMode="text"
                        multiline={true}
                        editable={true}
                      />
                      {valueOpinion && ratingValue && (
                        <TouchableOpacity
                          style={styles.sendOpinionButton}
                          activeOpacity={globalStyles.ACTIVE_OPACITY}
                          onPress={sendOpinion}
                        >
                          <Text style={styles.sendOpinionText}>
                            {t("getsDetails.rentDetails.opinion.sendOpinion")}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}
          </View>

          <View style={styles.detailsConstainer}>
            <Text style={styles.detailsLabel}>
              {t("getsDetails.rentDetails.rentDetailsLabel")}:
            </Text>
            <View style={styles.detailsValue}>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.announcement")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentAnnouncement.title}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.size")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentAnnouncement.size}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.condition")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentAnnouncement.condition}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.inRentFrom")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {new Date(
                    parseInt(currentRentOrReservation.startDate)
                  ).toLocaleDateString(i18n.language, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.inRentTo")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {new Date(
                    parseInt(currentRentOrReservation.endDate)
                  ).toLocaleDateString(i18n.language, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.pricePerDay")}:
                </Text>
                <Text
                  style={styles.detailsTextValue}
                >{`$${currentAnnouncement.pricePerDay.toFixed(2)}`}</Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.daysInRent")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {`${currentRentOrReservation.daysInRent} ${
                    i18n.language === "en"
                      ? currentRentOrReservation.daysInRent === 1
                        ? "day"
                        : "days"
                      : i18n.language === "pl"
                      ? currentRentOrReservation.daysInRent === 1
                        ? "dzień"
                        : "dni"
                      : "days"
                  }`}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.amount")}:
                </Text>
                <Text
                  style={styles.detailsTextValue}
                >{`$${currentRentOrReservation.amount.toFixed(2)}`}</Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.paymentMethod")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentRentOrReservation.paymentMethod}
                </Text>
              </View>

              {(currentRentOrReservation.status.statusCode === 4 ||
                currentRentOrReservation.status.statusCode === 5 ||
                currentRentOrReservation.status.statusCode === 6 ||
                currentRentOrReservation.status.statusCode === 7) && (
                <View>
                  <Divider style={styles.divider} />

                  <View style={styles.detailsTextContainer}>
                    <Text style={styles.detailsTextLabel}>
                      {t("getsDetails.rentDetails.deliveryDetails.deliverer")}:
                    </Text>
                    <Text style={styles.detailsTextValue}>OutPost sp. p.</Text>
                  </View>
                  <View style={styles.detailsTextContainer}>
                    <Text style={styles.detailsTextLabel}>
                      {t("getsDetails.rentDetails.deliveryDetails.pickupCode")}:
                    </Text>
                    <TouchableOpacity
                      activeOpacity={globalStyles.ACTIVE_OPACITY}
                      onPress={toggleModalBarcode}
                    >
                      <Text style={styles.detailsTextValueTrackingCode}>
                        {`0${currentRentOrReservation?.destinationAddress?.phoneNumber}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.detailsTextContainer}>
                    <Text style={styles.detailsTextLabel}>
                      {t("getsDetails.rentDetails.deliveryDetails.email")}:
                    </Text>
                    <Text style={styles.detailsTextValue}>
                      {currentRentOrReservation?.destinationAddress?.email}
                    </Text>
                  </View>
                  <View style={styles.detailsTextContainer}>
                    <Text style={styles.detailsTextLabel}>
                      {t("getsDetails.rentDetails.deliveryDetails.phoneNumber")}
                      :
                    </Text>
                    <Text style={styles.detailsTextValue}>
                      {
                        currentRentOrReservation?.destinationAddress
                          ?.phoneNumber
                      }
                    </Text>
                  </View>
                </View>
              )}

              <Divider style={styles.divider} />

              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.addressDetails.addressee")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentRentOrReservation?.destinationAddress?.adresse}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.addressDetails.address")}:
                </Text>
                <Text style={styles.detailsTextValue}>{deliveryAddress}</Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.addressDetails.postalCode")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentRentOrReservation.destinationAddress.postalCode}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.addressDetails.city")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentRentOrReservation.destinationAddress.city}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("getsDetails.rentDetails.addressDetails.country")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentRentOrReservation.destinationAddress.country}
                </Text>
              </View>
            </View>
          </View>

          <Modal
            animationType="fade" // animacja otwierania
            transparent={true} // transparentne tło
            visible={isBarcodeVisible}
            onRequestClose={toggleModalBarcode} // zamykanie na Androidzie przyciskiem "back"
          >
            <TouchableOpacity
              activeOpacity={globalStyles.ACTIVE_OPACITY}
              onPress={toggleModalBarcode}
            >
              <View style={styles.barcodeBackground}>
                <View style={styles.barcodeContainer}>
                  <Text style={styles.barcodeLabel}>
                    {t("getsDetails.rentDetails.barcode.scanUponPickup")}
                  </Text>
                  <Barcode
                    value={`0${currentRentOrReservation?.destinationAddress?.phoneNumber}`}
                    options={{
                      format: "MSI",
                      // background: globalStyles.secondaryColor,
                      lineColor: globalStyles.primaryColor,
                      width: 2.5,
                      height: 150,
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SendDetailsView;

const styles = StyleSheet.create({
  imageWithDateAndNumberContainer: {
    flexDirection: "row",
    overflow: "hidden",
    width: "100%",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  image: {
    width: "45%",
    height: "auto",
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  dateWithNumberContainer: {
    flexDirection: "column",
    width: "55%",
    padding: 10,
    gap: 10,
  },

  dateOrNumberTextLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: globalStyles.textOnPrimaryColor,
  },

  dateOrNumberTextValue: {
    paddingLeft: 5,
    fontFamily: "WorkSans_900Black",
    fontSize: 14,
    color: globalStyles.backgroundColor,
  },

  advertiserInfo: {
    zIndex: -1,
    flexDirection: "row",
    width: width - 50,
    flexWrap: "wrap",
    gap: 10,
    padding: 10,
    marginTop: -20,
    paddingTop: 25,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.textOnSecondaryColor,
  },

  advertiserLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  advertiserValue: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.backgroundColor,
  },

  advertiserButton: {
    borderRadius: globalStyles.BORDER_RADIUS,
    padding: 3,
    backgroundColor: globalStyles.accentColor,
  },

  statusContainer: {
    marginTop: 20,
  },

  statusLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  statusText: {
    padding: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.primaryColor,
  },

  cancelButton: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.redColor,
  },

  cancelText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnRedColor,
  },

  detailsConstainer: {
    marginTop: 20,
  },

  detailsLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
    marginBottom: 15,
  },

  detailsValue: {
    width: "100%",
    // paddingHorizontal: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
    // borderWidth: 10,
    // borderColor: globalStyles.secondaryColor,
    padding: 10,
  },

  // detailsTextRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  // },

  divider: {
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  detailsTextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    alignItems: "center",
  },

  detailsTextLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.primaryColor,
  },

  detailsTextValue: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.textOnSecondaryColor,
  },

  detailsTextValueTrackingCode: {
    fontFamily: "WorkSans_900Black",
    fontSize: 15,
    color: globalStyles.textOnAccentColor,
    backgroundColor: globalStyles.accentColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    padding: 5,
  },

  paymentContainer: {
    // marginTop: 10,
    gap: 10,
  },

  paymentLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  paymentMethodButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  paymentMethodCardButtonSelected: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  paymentMethodCardButtonNotSelected: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
  },

  paymentMethodCardTextSelected: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  paymentMethodCardTextNotSelected: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
  },

  paymentMethodBLIKButtonSelected: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  paymentMethodBLIKButtonNotSelected: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
  },

  paymentMethodBLIKTextSelected: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  paymentMethodBLIKTextNotSelected: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
  },

  paymentCardContainer: {
    zIndex: -1,
    marginTop: -25,
    padding: 10,
    paddingTop: 30,
    gap: 10,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
  },

  paymentCardView: {
    alignSelf: "center",
    // marginTop: 15,
  },

  paymentCardInput: {
    width: "100%",
    borderWidth: 0.5,
    borderRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
    color: globalStyles.primaryColor,
    // marginTop: 15,
    // borderColor: "#fff",
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
  },

  paymentCardInputText: {
    color: globalStyles.primaryColor,
  },

  paymentCardInfoContainer: {
    // margin: 20,
    // padding: 20,
    // backgroundColor: "#dfdfdf",
    // borderRadius: 5,
  },

  paymentCardInfo: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    gap: 10,
    alignItems: "center",
  },

  paymentCardInfoText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  paymentBLIKContainer: {
    zIndex: -1,
    marginTop: -25,
    padding: 10,
    paddingTop: 30,
    gap: 10,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
  },

  paymentBLIKError: {
    width: "100%",
    marginBottom: -20,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.redColor,
    backgroundColor: globalStyles.textOnRedColor,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
  },

  paymentBLIKTextInput: {
    width: "100%",
    padding: 10,
    borderWidth: 0.5,
    borderRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  payForRentingButton: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  payForRentingText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnAccentColor,
  },

  confirmDeliveryButton: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  confirmDeliveryText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  confirmShippingButton: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  confirmShippingText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  barcodeBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  barcodeContainer: {
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    padding: 10,
  },

  barcodeLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 20,
    color: globalStyles.primaryColor,
    textAlign: "center",
  },

  opinionContainer: {
    marginTop: 10,
  },

  writeOpinionButton: {
    width: "100%",
    // alignItems: "center",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  writeOpinionLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  writeOpinionText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnAccentColor,
  },

  opinionFormContainer: {
    zIndex: -1,
    width: "100%",
    padding: 10,
    marginTop: -20,
    paddingTop: 30,
    gap: 10,
    backgroundColor: globalStyles.secondaryColor,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
  },

  opinionRating: {
    width: "70%",
    padding: 5,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.backgroundColor,
    borderColor: globalStyles.primaryColor,
    borderWidth: 0.5,
  },

  opinionInput: {
    width: width - 70,
    height: "auto",
    minHeight: 70,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: globalStyles.BORDER_RADIUS,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.backgroundColor,
    color: globalStyles.primaryColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },

  sendOpinionButton: {
    width: "50%",
    alignSelf: "flex-end",
    alignItems: "center",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  sendOpinionText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },
});
