import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
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
  push,
} from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";

import Icon from "../components/Icon";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";

import {
  CreditCardView,
  LiteCreditCardInput,
} from "react-native-credit-card-input";

import { Barcode } from "expo-barcode-generator";
import { cutAdvertiserNameInDetails } from "../utils/func";
import { styles } from "../styles/GetDetailsViewStyles";

const GetDetailsView = ({ route }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const { id } = route.params;

  const [currentRentOrReservation, setCurrentRentOrReservation] =
    useState(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [currentAdvertiser, setCurrentAdvertiser] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("None"); // "None", "Card", "BLIK"
  const [cardFocusedField, setCardFocusedField] = useState();
  const [cardFormData, setCardFormData] = useState();
  const [valueBLIK, setValueBLIK] = useState();
  const [errorBLIK, setErrorBLIK] = useState("This field cannot be empty");
  const [isBarcodeVisible, setBarcodeVisible] = useState(false);
  const [isOpinionFormVisible, setOpinionFormVisible] = useState(false);
  const [valueOpinion, setValueOpinion] = useState();
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

  const type = user.rentalOrReservationData[id].type;
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
    const announcementRef = ref(
      db,
      `announcements/${user.rentalOrReservationData[id].announcementId}`
    );
    const unsubscribe = onValue(
      announcementRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCurrentAnnouncement({
            id: user.rentalOrReservationData[id].announcementId,
            ...data,
          });
        } else {
          setCurrentAnnouncement(null);
        }
      },
      (error) => {
        console.error("Błąd podczas pobierania danych:", error);
      }
    );

    return () => unsubscribe();
  }, [id]);

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
    const usersRef = ref(db, `users/${currentAnnouncement?.advertiserId}`);
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCurrentAdvertiser({
            id: currentAnnouncement.advertiserId,
            ...data,
          });
        } else {
          setCurrentAdvertiser(null);
        }
      },
      (error) => {
        console.error("Błąd podczas pobierania danych:", error);
      }
    );

    return () => unsubscribe();
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
          ` (${t("getsDetails.rentDetails.addressDetails.floor")} ` +
          currentRentOrReservation.destinationAddress.floorNumber +
          ")";
      }
      setDeliveryAddress(address);
    }
  }, [currentRentOrReservation]);

  const onChatPress = () => {
    const announcementId = currentAnnouncement.id;
    const advertiserId = currentAdvertiser.id;
    const userId = user.id;

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
              ((chat.advertiserId === advertiserId && chat.userId === userId) ||
                (chat.advertiserId === userId && chat.userId === advertiserId))
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
            userId: user.id,
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

    const dataPath = type === "Rent" ? "rentalData" : "reservationData";

    try {
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

  const changeBookToRentInCurrentUser = () => {
    const typeRef = ref(
      db,
      `users/${user.id}/rentalOrReservationData/${currentRentOrReservation.id}`
    );
    try {
      update(typeRef, { announcementId: currentAnnouncement.id, type: "Rent" });
      console.log("changeBookToRentInCurrentUser / Type updated successfully");
    } catch (error) {
      console.error(
        "changeBookToRentInCurrentUser / Error updating type:",
        error
      );
    }
  };

  const changeBookToRentInAdvertiser = () => {
    const typeRef = ref(
      db,
      `users/${currentAdvertiser.id}/imRenting/${currentRentOrReservation.id}`
    );
    try {
      update(typeRef, { announcementId: currentAnnouncement.id, type: "Rent" });
      console.log("changeBookToRentInAdvertiser / Type updated successfully");
    } catch (error) {
      console.error(
        "changeBookToRentInAdvertiser / Error updating type:",
        error
      );
    }
  };

  const moveDataFromReservationToRental = () => {
    let data = null;
    const reservationRef = ref(
      db,
      `announcements/${currentAnnouncement.id}/reservationData/${currentRentOrReservation.id}`
    );
    const rentalRef = ref(
      db,
      `announcements/${currentAnnouncement.id}/rentalData/${currentRentOrReservation.id}`
    );
    onValue(reservationRef, (snapshot) => {
      data = snapshot.val();
    });
    set(rentalRef, data);
    remove(reservationRef);
  };

  const cancelThisRent = () => {
    console.log("Status - Canceled");
    updateStatus(8, "Canceled");
  };

  const selectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    console.log(`Selected ${method}`);
  };

  const statusToIcon = (status) => {
    let iconName;
    if (status === "valid") iconName = "circle-accept";
    else if (status === "invalid") iconName = "circle-denied";
    else iconName = "circle-question";
    return iconName;
  };

  const statusToColor = (status) => {
    let color;
    if (status === "valid") color = "green";
    else if (status === "invalid") color = globalStyles.redColor;
    else color = globalStyles.redColor;
    return color;
  };

  useEffect(() => {
    if (valueBLIK) {
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

  const confirmReservation = () => {
    console.log("Status - Rended");
    updateStatus(3, "Rented");
    changeBookToRentInCurrentUser();
    changeBookToRentInAdvertiser();
    moveDataFromReservationToRental();
  };

  const confirmDelivery = () => {
    console.log("Status - In use");
    updateStatus(5, "In use");
  };

  const confirmShipping = () => {
    console.log("Status - Sent back");
    updateStatus(6, "Sent back");
  };

  const toggleModalBarcode = () => {
    setBarcodeVisible(!isBarcodeVisible);
    console.log(`Barcode - ${isBarcodeVisible}`);
  };

  const ratingCompleted = (rating) => {
    console.log(`Rating - ${rating}`);
    setRatingValue(rating);
  };

  const sendOpinion = () => {
    const opinionId = "OPI_" + Date.now();
    const opinion = {
      authorId: user.id,
      rentingId: currentRentOrReservation.id,
      rate: ratingValue,
      date: Date.now(),
      text: valueOpinion,
      moderationStatus: {
        code: 1,
        messege: "Approved",
      },
    };
    const opinionRef = ref(
      db,
      `announcements/${currentAnnouncement.id}/opinions/${opinionId}`
    );
    set(opinionRef, opinion);

    const rentalRef = ref(
      db,
      `announcements/${currentAnnouncement.id}/rentalData/${currentRentOrReservation.id}`
    );
    update(rentalRef, { opinionId: opinionId });

    let numberOfRatings = 0;
    let sumOfRatings = 0;
    const opinionsRef = ref(
      db,
      `announcements/${currentAnnouncement.id}/opinions`
    );
    onValue(opinionsRef, (snapshot) => {
      const opinions = snapshot.val();
      console.log("opinions:");
      console.log(opinions);

      Object.values(opinions).forEach((opinionsItem) => {
        console.log("opinionsItem:");
        console.log(opinionsItem);
        sumOfRatings += opinionsItem.rate;
        numberOfRatings++;
      });
    });

    console.log(`numberOfRatings: ${numberOfRatings}`);
    console.log(`sumOfRatings ${sumOfRatings}`);
    let averageRating = sumOfRatings / numberOfRatings;
    console.log(`averageRating: ${averageRating}`);
    const ratingRef = ref(db, `announcements/${currentAnnouncement.id}/rating`);
    set(ratingRef, averageRating);

    numberOfRatings = 0;
    averageRating = 0;
    sumOfRatings = 0;
    const announcementsRef = ref(db, `announcements`);
    onValue(announcementsRef, (snapshot) => {
      const announcements = snapshot.val();
      console.log("announcements:");
      console.log(announcements);

      Object.values(announcements).forEach((announcement) => {
        console.log("announcement:");
        console.log(announcement);
        if (announcement.advertiserId === currentAdvertiser.id) {
          if (announcement.rating != 0) {
            numberOfRatings++;
            sumOfRatings += announcement.rating;
          }
        }
      });
    });

    console.log(`numberOfRatings: ${numberOfRatings}`);
    console.log(`sumOfRatings ${sumOfRatings}`);
    averageRating = sumOfRatings / numberOfRatings;
    console.log(`averageRating: ${averageRating}`);
    const advertiserRef = ref(db, `users/${currentAdvertiser.id}/rating`);
    set(advertiserRef, averageRating);

    const hasOpinionRef = ref(
      db,
      `announcements/${currentAnnouncement.id}/rentalData/${currentRentOrReservation.id}/hasOpinion`
    );
    set(hasOpinionRef, true);
  };

  if (!currentRentOrReservation || !currentAnnouncement || !currentAdvertiser) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
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
                <Text style={styles.dateOrNumberTextValue}>
                  {currentRentOrReservation?.id}
                </Text>
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
                    `statusNames.${currentRentOrReservation.status.statusName}`
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
                `${currentAdvertiser.name} ${currentAdvertiser.surname}`
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
                        {currentRentOrReservation.trackingNumber
                          ? currentRentOrReservation.trackingNumber
                          : t(
                              "sendsDetails.rentDetails.barcode.didntGenerateCode"
                            )}
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
            animationType="fade"
            transparent={true}
            visible={isBarcodeVisible}
            onRequestClose={toggleModalBarcode}
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
                    value={
                      currentRentOrReservation.trackingNumber
                        ? `${currentRentOrReservation.trackingNumber}`
                        : "0000000000"
                    }
                    options={{
                      format: "MSI",
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

export default GetDetailsView;
