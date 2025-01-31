import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  TextInput,
  StatusBar,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { Divider } from "react-native-elements";
import OpinionCard from "../components/OpinionCard";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { ref, onValue, update, get, set, push } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";

import Icon from "../components/Icon";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";

import { Barcode } from "expo-barcode-generator";
import { cutAdvertiserNameInDetails } from "../utils/func";

import {styles} from "../styles/SendDetailsViewStyles";


const SendDetailsView = ({ route }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const { id } = route.params;

  const [currentImRenting, setCurrentImRenting] = useState(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [currentBorrower, setCurrentBorrower] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [trackingNumber, setTrackingNumber] = useState();
  const [currentOpinion, setCurrentOpinion] = useState();

  const [isBarcodeVisible, setBarcodeVisible] = useState(false);

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

  const type = user.imRenting[id].type;
  const statusInfo = [
    "",
    t("sendsDetails.statusInfo.pendingConfirmation"),
    t("sendsDetails.statusInfo.reserved", {
      dueDate: getDateInXDays(
        new Date(parseInt(currentImRenting?.startDate)),
        -2
      ).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
    }),
    t("sendsDetails.statusInfo.inProgress"),
    t("sendsDetails.statusInfo.shipped"),
    t("sendsDetails.statusInfo.inUse"),
    t("sendsDetails.statusInfo.returned"),
    t("sendsDetails.statusInfo.completed"),
    t("sendsDetails.statusInfo.canceled"),
  ];

  useEffect(() => {
    const announcementRef = ref(
      db,
      `announcements/${user.imRenting[id].announcementId}`
    );
    const unsubscribe = onValue(
      announcementRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCurrentAnnouncement({
            id: user.imRenting[id].announcementId,
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
      let imRenting = null;
      if (currentAnnouncement.rentalData) {
        imRenting = currentAnnouncement.rentalData[id];
      }
      if (currentAnnouncement.reservationData && !imRenting) {
        imRenting = currentAnnouncement.reservationData[id];
      }
      setCurrentImRenting({ id, ...imRenting });
    }
  }, [currentAnnouncement]);

  useEffect(() => {
    const usersRef = ref(db, `users/${currentImRenting?.borrowerId}`);
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCurrentBorrower({
            id: currentImRenting.borrowerId,
            ...data,
          });
        } else {
          setCurrentBorrower(null);
        }
      },
      (error) => {
        console.error("Błąd podczas pobierania danych:", error);
      }
    );

    return () => unsubscribe();
  }, [currentImRenting]);

  useEffect(() => {
    if (currentImRenting) {
      let address = "";
      address += currentImRenting.destinationAddress.street;
      address += " " + currentImRenting.destinationAddress.buildingNumber;
      if (currentImRenting.destinationAddress.flatOrApartmentNumber) {
        address +=
          " / " + currentImRenting.destinationAddress.flatOrApartmentNumber;
      }
      if (currentImRenting.destinationAddress.floorNumber) {
        address +=
          ` (${t("sendsDetails.rentDetails.addressDetails.floor")} ` +
          currentImRenting.destinationAddress.floorNumber +
          ")";
      }
      setDeliveryAddress(address);
    }
  }, [currentImRenting]);

  const onChatPress = () => {
    const announcementId = currentAnnouncement.id;
    const advertiserId = currentAnnouncement.advertiserId;
    const buyerId = currentImRenting.borrowerId;
    const userId = user.id;

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
              ((chat.advertiserId === advertiserId &&
                chat.userId === buyerId) ||
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

    const dataPath = type === "Rent" ? "rentalData" : "reservationData";

    try {
      update(ref(db, `${basePath}/${dataPath}/${currentImRenting.id}/status`), {
        statusCode: code,
        statusName: name,
      });

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const acceptRent = () => {
    if (type === "Rent") {
      console.log("Status - Rended");
      updateStatus(3, "Rented");
    } else if (type === "Book") {
      console.log("Status - Reserved");
      updateStatus(2, "Reserved");
    }
  };

  const generateTrackingNumber = () => {
    let trNumber = "";
    for (let i = 0; i < 10; i++) {
      trNumber += Math.floor(Math.random() * 9 + 0);
    }
    console.log(trNumber);
    setTrackingNumber(parseInt(trNumber));
  };

  const addTrackingNumberInDB = () => {
    const trackingNumberRef = ref(
      db,
      `announcements/${currentAnnouncement.id}/rentalData/${currentImRenting.id}`
    );
    update(trackingNumberRef, { trackingNumber: trackingNumber });
  };

  const confirmShipping = () => {
    console.log("Status - Sent for use");
    addTrackingNumberInDB();
    updateStatus(4, "Sent for use");
  };

  const confirmDelivery = () => {
    console.log("Status - Done");
    updateStatus(7, "Done");
  };

  useEffect(() => {
    if (currentImRenting?.hasOpinion) {
      const opinionRef = ref(
        db,
        `announcements/${currentAnnouncement.id}/opinions/${currentImRenting.opinionId}`
      );
      onValue(opinionRef, (snapshot) => {
        const opinion = { id: currentImRenting.opinionId, ...snapshot.val() };
        setCurrentOpinion(opinion);
      });
    }
  }, [currentImRenting]);

  const toggleModalBarcode = () => {
    setBarcodeVisible(!isBarcodeVisible);
    console.log(`Barcode - ${isBarcodeVisible}`);
  };

  if (!currentImRenting || !currentAnnouncement || !currentBorrower) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <StatusBar backgroundColor={globalStyles.accentColor} barStyle="light-content" />
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
                  {t("sendsDetails.rentDetails.rentNo")}
                </Text>
                <Text style={styles.dateOrNumberTextValue}>
                  {currentImRenting?.id}
                </Text>
              </View>
              <View>
                <Text style={styles.dateOrNumberTextLabel}>
                  {t("sendsDetails.rentDetails.rentDate")}
                </Text>
                <Text style={styles.dateOrNumberTextValue}>
                  {new Date(
                    parseInt(
                      currentImRenting?.id.startsWith("ROR_")
                        ? currentImRenting?.id.substring(4)
                        : currentImRenting?.id
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
                  {t("sendsDetails.rentDetails.status")}
                </Text>
                <Text style={styles.dateOrNumberTextValue}>
                  {t(`statusNames.${currentImRenting.status.statusName}`)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.advertiserInfo}>
            <Text style={styles.advertiserLabel}>{`${t(
              "sendsDetails.rentDetails.borrowerLabel"
            )}:`}</Text>
            <Text style={styles.advertiserValue}>
              {cutAdvertiserNameInDetails(
                `${currentBorrower.name} ${currentBorrower.surname}`
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
              "sendsDetails.rentDetails.statusInfoLabel"
            )}:`}</Text>
            <Text style={styles.statusText}>
              {statusInfo[currentImRenting.status.statusCode]}
            </Text>

            {currentImRenting.status.statusCode === 1 && (
              <TouchableOpacity
                style={styles.acceptRentButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={acceptRent}
              >
                <Text style={styles.acceptRentText}>
                  {t("sendsDetails.rentDetails.actions.acceptRent")}
                </Text>
              </TouchableOpacity>
            )}

            {currentImRenting.status.statusCode === 3 && !trackingNumber && (
              <TouchableOpacity
                style={styles.generateTrackingNumberButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={generateTrackingNumber}
              >
                <Text style={styles.generateTrackingNumberText}>
                  {t("sendsDetails.rentDetails.actions.generateTrackingNumber")}
                </Text>
              </TouchableOpacity>
            )}

            {currentImRenting.status.statusCode === 3 && trackingNumber && (
              <TouchableOpacity
                style={styles.trackingNumberButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={toggleModalBarcode}
              >
                <Text style={styles.trackingNumberText}>{trackingNumber}</Text>
              </TouchableOpacity>
            )}
            {currentImRenting.status.statusCode === 3 && trackingNumber && (
              <TouchableOpacity
                style={styles.confirmShippingButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={confirmShipping}
              >
                <Text style={styles.confirmShippingText}>
                  {t("sendsDetails.rentDetails.actions.confirmShipping")}
                </Text>
              </TouchableOpacity>
            )}

            {currentImRenting.status.statusCode === 6 && (
              <TouchableOpacity
                style={styles.confirmDeliveryButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={confirmDelivery}
              >
                <Text style={styles.confirmDeliveryText}>
                  {t("sendsDetails.rentDetails.actions.confirmDelivery")}
                </Text>
              </TouchableOpacity>
            )}

            {currentImRenting.status.statusCode === 7 && currentOpinion && (
              <View>
                <OpinionCard
                  id={currentOpinion.id}
                  authorId={currentBorrower.id}
                  userId={user.id}
                  rate={currentOpinion.rate}
                  publicationDate={currentOpinion.date}
                  text={currentOpinion.text}
                  moderationStatus={currentOpinion.moderationStatus}
                />
              </View>
            )}
          </View>

          <View style={styles.detailsConstainer}>
            <Text style={styles.detailsLabel}>
              {t("sendsDetails.rentDetails.rentDetailsLabel")}:
            </Text>
            <View style={styles.detailsValue}>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.announcement")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentAnnouncement.title}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.size")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentAnnouncement.size}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.condition")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentAnnouncement.condition}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.inRentFrom")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {new Date(
                    parseInt(currentImRenting.startDate)
                  ).toLocaleDateString(i18n.language, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.inRentTo")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {new Date(
                    parseInt(currentImRenting.endDate)
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
                  {t("sendsDetails.rentDetails.pricePerDay")}:
                </Text>
                <Text
                  style={styles.detailsTextValue}
                >{`$${currentAnnouncement.pricePerDay.toFixed(2)}`}</Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.daysInRent")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {`${currentImRenting.daysInRent} ${
                    i18n.language === "en"
                      ? currentImRenting.daysInRent === 1
                        ? "day"
                        : "days"
                      : i18n.language === "pl"
                      ? currentImRenting.daysInRent === 1
                        ? "dzień"
                        : "dni"
                      : "days"
                  }`}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.amount")}:
                </Text>
                <Text
                  style={styles.detailsTextValue}
                >{`$${currentImRenting.amount.toFixed(2)}`}</Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.paymentMethod")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentImRenting.paymentMethod}
                </Text>
              </View>

              {(currentImRenting.status.statusCode === 4 ||
                currentImRenting.status.statusCode === 5 ||
                currentImRenting.status.statusCode === 6 ||
                currentImRenting.status.statusCode === 7) && (
                <View>
                  <Divider style={styles.divider} />

                  <View style={styles.detailsTextContainer}>
                    <Text style={styles.detailsTextLabel}>
                      {t("sendsDetails.rentDetails.deliveryDetails.deliverer")}:
                    </Text>
                    <Text style={styles.detailsTextValue}>OutPost sp. p.</Text>
                  </View>
                  <View style={styles.detailsTextContainer}>
                    <Text style={styles.detailsTextLabel}>
                      {t("sendsDetails.rentDetails.deliveryDetails.pickupCode")}
                      :
                    </Text>
                    <TouchableOpacity
                      activeOpacity={globalStyles.ACTIVE_OPACITY}
                      onPress={toggleModalBarcode}
                    >
                      <Text style={styles.detailsTextValueTrackingCode}>
                        {currentImRenting.trackingNumber
                          ? currentImRenting.trackingNumber
                          : t(
                              "sendsDetails.rentDetails.barcode.didntGenerateCode"
                            )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.detailsTextContainer}>
                    <Text style={styles.detailsTextLabel}>
                      {t("sendsDetails.rentDetails.deliveryDetails.email")}:
                    </Text>
                    <Text style={styles.detailsTextValue}>
                      {currentImRenting?.destinationAddress?.email}
                    </Text>
                  </View>
                  <View style={styles.detailsTextContainer}>
                    <Text style={styles.detailsTextLabel}>
                      {t(
                        "sendsDetails.rentDetails.deliveryDetails.phoneNumber"
                      )}
                      :
                    </Text>
                    <Text style={styles.detailsTextValue}>
                      {currentImRenting?.destinationAddress?.phoneNumber}
                    </Text>
                  </View>
                </View>
              )}

              <Divider style={styles.divider} />

              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.addressDetails.addressee")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentImRenting?.destinationAddress?.adresse}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.addressDetails.address")}:
                </Text>
                <Text style={styles.detailsTextValue}>{deliveryAddress}</Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.addressDetails.postalCode")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentImRenting.destinationAddress.postalCode}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.addressDetails.city")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentImRenting.destinationAddress.city}
                </Text>
              </View>
              <View style={styles.detailsTextContainer}>
                <Text style={styles.detailsTextLabel}>
                  {t("sendsDetails.rentDetails.addressDetails.country")}:
                </Text>
                <Text style={styles.detailsTextValue}>
                  {currentImRenting.destinationAddress.country}
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
                    {t("sendsDetails.rentDetails.barcode.scanUponSending")}
                  </Text>
                  <Barcode
                    value={
                      currentImRenting.trackingNumber
                        ? `${currentImRenting.trackingNumber}`
                        : trackingNumber
                        ? `${trackingNumber}`
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

export default SendDetailsView;