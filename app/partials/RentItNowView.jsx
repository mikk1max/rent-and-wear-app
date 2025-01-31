import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { Divider } from "react-native-elements";

import { ref, onValue, set } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";

import Icon from "../components/Icon";

import CalendarPicker from "react-native-calendar-picker";

import {
  CreditCardView,
  LiteCreditCardInput,
} from "react-native-credit-card-input";

import * as Progress from "react-native-progress";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";

import { styles } from "../styles/RentItNowViewStyles";

const { width } = Dimensions.get("window");

const RentItNowView = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { user } = useUser();

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [key, setKey] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState([]);
  const [rentalOption, setRentalOption] = useState("Rent"); // "Rent" or "Book"
  const [isBookingAvailable, setBookingAvailable] = useState(false);
  const [isNextStepActive, setNextStepActive] = useState(false); // false - button visible, section hidden, true - button hidden, section visible
  const [address, setAddress] = useState();
  const [isAddressListVisible, setAddressListVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("None"); // "None", "Card", "BLIK"

  const [cardFocusedField, setCardFocusedField] = useState();
  const [cardFormData, setCardFormData] = useState();
  const [valueBLIK, setValueBLIK] = useState();
  const [errorBLIK, setErrorBLIK] = useState("This field cannot be empty");

  const [isFinishButtonActive, setFinishButtonActive] = useState(true);
  const [counter, setCounter] = useState(0);

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const { id } = route.params;

  const getToday = () => {
    let today = new Date(Date.now());
    today.setMilliseconds(0);
    today.setSeconds(0);
    today.setMinutes(0);
    today.setHours(12);
    return today;
  };

  const getNextDay = (day) => {
    let nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  };

  const getDateInXDays = (day, days) => {
    let dayInXDays = new Date(day);
    dayInXDays.setDate(dayInXDays.getDate() + days);
    return dayInXDays;
  };

  const getDaysBetweenTwoDates = (date1, date2) => {
    const differenceInMilliseconds = Math.abs(
      date1.getTime() - date2.getTime()
    );
    const differenceInDays = Math.round(
      differenceInMilliseconds / (1000 * 3600 * 24)
    );
    return differenceInDays;
  };

  useEffect(() => {
    const announcementsRef = ref(db, `announcements/${id}`);
    const unsubscribe = onValue(
      announcementsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAnnouncement({ id, ...data });
        } else {
          setAnnouncement(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Błąd podczas pobierania danych:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  let unavailableDates = [];
  if (announcement) {
    if (announcement.rentalData) {
      Object.values(announcement.rentalData).map((rental) => {
        unavailableDates.push({
          startDate: getDateInXDays(new Date(rental.startDate), -2),
          endDate: getDateInXDays(new Date(rental.endDate), 2),
        });
      });
    }
    if (announcement.reservationData) {
      Object.values(announcement.reservationData).map((reservation) => {
        unavailableDates.push({
          startDate: getDateInXDays(new Date(reservation.startDate), -2),
          endDate: getDateInXDays(new Date(reservation.endDate), 2),
        });
      });
    }
  }

  const firstAvailableDate = getDateInXDays(getToday(), 2);
  const lastAvailableDate = getDateInXDays(firstAvailableDate, 90);

  const generateCustomDatesStyles = () => {
    const stylesArray = [];

    unavailableDates.forEach(({ startDate, endDate }) => {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        stylesArray.push({
          date: new Date(currentDate),
          style: styles.unavailableDate,
          textStyle: styles.unavailableDateText,
          allowDisabled: true,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return stylesArray;
  };

  const isRangeValid = (start, end) => {
    if (!start || !end) return true;

    for (let i = 0; i < unavailableDates.length; i++) {
      const { startDate, endDate } = unavailableDates[i];
      if (
        (start <= startDate && end >= startDate) ||
        (start >= startDate && start <= endDate)
      ) {
        return false;
      }
    }
    return true;
  };

  const resetDates = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setKey((prevKey) => prevKey + 1);
  };

  const handleDateChange = (date, type) => {
    if (type === "START_DATE") {
      if (isRangeValid(date, selectedEndDate)) {
        setSelectedStartDate(date);
      } else {
        Alert.alert(`${t("alerts.unavailableDates")}`);
        resetDates();
      }
    } else {
      if (isRangeValid(selectedStartDate, date)) {
        setSelectedEndDate(date);
      } else {
        Alert.alert(`${t("alerts.unavailableDates")}`);
        resetDates();
      }
    }
  };

  const getDisabledDates = () => {
    const disabledDates = [];

    unavailableDates.forEach(({ startDate, endDate }) => {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        disabledDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return disabledDates;
  };

  useEffect(() => {
    if (selectedStartDate) {
      const differenceBetweenTodayAndStartDate = getDaysBetweenTwoDates(
        getToday(),
        selectedStartDate
      );
      if (differenceBetweenTodayAndStartDate >= 3) setBookingAvailable(true);
      else {
        setRentalOption("Rent");
        setBookingAvailable(false);
      }
    } else {
      setRentalOption("Rent");
      setBookingAvailable(false);
    }
  }, [selectedStartDate]);

  const toggleRentalOption = () => {
    if (rentalOption === "Rent") {
      setRentalOption("Book");
      console.log("Changed rental option to Book.");
    } else {
      setRentalOption("Rent");
      console.log("Changed rental option to Rent.");
    }
  };

  const toggleAddressList = () => setAddressListVisible(!isAddressListVisible);

  const selectAddress = (chosenAddress) => {
    setAddress(chosenAddress);
    toggleAddressList();
  };

  useEffect(() => {
    if (address) {
      if (!address.email) {
        setAddress({ ...address, email: user.email });
      }
    }
  }, [address]);

  const getTotalAmount = (startDate, endDate) => {
    const totalAmount =
      (getDaysBetweenTwoDates(startDate, endDate) + 1) *
      announcement.pricePerDay;
    return totalAmount;
  };

  const get20Percent = (startDate, endDate) => {
    const totalAmount = getTotalAmount(startDate, endDate);
    const _20percent = Math.round(totalAmount * 0.2 * 100) / 100;
    return _20percent;
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

  const createRentalOrReservationData = async (dataId, data, dataPath) => {
    const dataRef = ref(
      db,
      `announcements/${announcement.id}/${dataPath}/${dataId}`
    );
    await set(dataRef, data);
    console.log(
      `Set ${data} into announcements/${announcement.id}/${dataPath}/${dataId}`
    );
  };

  const insertDataIntoUser = async (dataId, data) => {
    const dataRef = ref(
      db,
      `users/${user.id}/rentalOrReservationData/${dataId}`
    );
    await set(dataRef, data);
    console.log(
      `Set ${data} into users/${user.id}/rentalOrReservationData/${dataId}`
    );
  };

  const insertDataIntoAdvertiser = async (dataId, data) => {
    const dataRef = ref(
      db,
      `users/${announcement.advertiserId}/imRenting/${dataId}`
    );
    await set(dataRef, data);
    console.log(
      `Set ${data} into users/${announcement.advertiserId}/imRenting/${dataId}`
    );
  };

  const requestRenting = async () => {
    const data = {
      amount: getTotalAmount(selectedStartDate, selectedEndDate),
      borrowerId: user.id,
      daysInRent:
        getDaysBetweenTwoDates(selectedStartDate, selectedEndDate) + 1,
      startDate: selectedStartDate.getTime(),
      endDate: selectedEndDate.getTime(),
      destinationAddress: address,
      paymentMethod: selectedPaymentMethod,
      status: { statusCode: 1, statusName: "Pending" },
    };
    const dataId = "ROR_" + Date.now();
    const dataInUser = { announcementId: announcement.id, type: rentalOption };
    if (rentalOption === "Rent") {
      await createRentalOrReservationData(dataId, data, "rentalData");
    } else if (rentalOption === "Book") {
      await createRentalOrReservationData(dataId, data, "reservationData");
    }
    await insertDataIntoUser(dataId, dataInUser);
    await insertDataIntoAdvertiser(dataId, dataInUser);
  };

  const intervalRef = useRef();

  const interval = () => {
    intervalRef.current = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 50);
  };

  useEffect(() => {
    const intervalId = intervalRef.current;

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (counter >= 100) {
      clearInterval(intervalRef.current);
      setCounter(100);
      Alert.alert(
        `${t("passwordReset.resetPasswordAlert.success")}`,
        `${t("rentItNow.alerts.rentedOrBooked")}`
      );
      navigation.goBack();
    }
  }, [counter]);

  const finishRenting = () => {
    console.log("Finish");
    interval();
    requestRenting();
  };

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
        >
          <View style={styles.datePickerContainer}>
            <CalendarPicker
              key={key}
              startFromMonday={true}
              allowRangeSelection={true}
              allowBackwardRangeSelect={true}
              showDayStragglers={true}
              restrictMonthNavigation={true}
              months={t("calendar.months", { returnObjects: true })}
              weekdays={t("calendar.weekdays", { returnObjects: true })}
              previousTitle={t("calendar.previous")}
              nextTitle={t("calendar.next")}
              selectMonthTitle={t("calendar.selectMonthTitle")}
              selectYearTitle={t("calendar.selectYearTitle")}
              onDateChange={handleDateChange}
              minDate={firstAvailableDate}
              maxDate={lastAvailableDate}
              disabledDates={getDisabledDates()}
              selectedDayColor={globalStyles.accentColor}
              selectedDayTextColor={globalStyles.textOnAccentColor}
              customDatesStyles={generateCustomDatesStyles()}
              width={width - 70}
              previousTitleStyle={styles.datePickerPreviousTitle}
              nextTitleStyle={styles.datePickerNextTitle}
              selectedDayStyle={styles.datePickerSelectedDayStyle}
              selectedDayTextStyle={styles.datePickerSelectedDayTextStyle}
              selectedRangeStartTextStyle={
                styles.datePickerSelectedRangeStartTextStyle
              }
              selectedRangeEndTextStyle={
                styles.datePickerSelectedRangeEndTextStyle
              }
              selectedRangeStartStyle={styles.datePickerSelectedRangeStartStyle}
              selectedRangeEndStyle={styles.datePickerSelectedRangeEndStyle}
              selectedRangeStyle={styles.datePickerSelectedRangeStyle}
              disabledDatesTextStyle={styles.datePickerDisabledDatesTextStyle}
              todayTextStyle={styles.datePickerTodayTextStyle}
              textStyle={styles.datePickerTextStyle}
              dayLabelsWrapper={styles.datePickerDayLabelsWrapper}
              monthTitleStyle={styles.datePickerMonthTitleStyle}
              yearTitleStyle={styles.datePickerYearTitleStyle}
            />
            <Divider style={styles.dateDivider} />
            <Text style={styles.dateResulText}>
              {`${t("rentItNow.from")}: `}
              <Text style={{ color: globalStyles.textOnSecondaryColor }}>
                {selectedStartDate
                  ? selectedStartDate.toLocaleDateString(i18n.language, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : `${t("rentItNow.startDate")}`}
              </Text>
            </Text>
            <Text style={styles.dateResulText}>
              {`${t("rentItNow.to")}: `}
              <Text style={{ color: globalStyles.textOnSecondaryColor }}>
                {selectedEndDate
                  ? selectedEndDate.toLocaleDateString(i18n.language, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : `${t("rentItNow.endDate")}`}
              </Text>
            </Text>
            <Text style={styles.dateResulText}>
              {`${t("rentItNow.total")}: `}
              <Text style={{ color: globalStyles.textOnSecondaryColor }}>
                {selectedStartDate && selectedEndDate
                  ? `$${getTotalAmount(selectedStartDate, selectedEndDate)}`
                  : `${t("rentItNow.totalAmount")}`}
              </Text>{" "}
              <Text style={{ color: globalStyles.accentColor }}>
                {rentalOption === "Book" && selectedStartDate && selectedEndDate
                  ? `($${get20Percent(selectedStartDate, selectedEndDate)} ${t(
                      "rentItNow.amountForBooking"
                    )})`
                  : ""}
              </Text>
            </Text>
            <TouchableOpacity
              style={styles.dateResetButton}
              onPress={resetDates}
              activeOpacity={globalStyles.ACTIVE_OPACITY}
            >
              <Text style={styles.dateResetText}>
                {t("rentItNow.resetDates")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rentalOptionContainer}>
            <Text style={styles.rentalOptionLabel}>
              {`${t("rentItNow.rentalOptionTitle")}: `}
            </Text>
            {rentalOption === "Rent" && (
              <Text style={styles.rentalOptionRentItNowDescription}>
                {`${t("rentItNow.rentTermsSubTitle")}`}
              </Text>
            )}

            {rentalOption === "Book" && (
              <Text style={styles.rentalOptionBookItDescription}>
                {`${t("rentItNow.rentalOptionBookItDescriptionFirst")} `}
                <Text style={{ color: globalStyles.accentColor }}>
                  {selectedStartDate
                    ? selectedStartDate.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : `${t("rentItNow.startDate")}`}
                </Text>
                {`, ${t("rentItNow.rentalOptionBookItDescriptionLast")}`}
              </Text>
            )}

            <View style={styles.rentalOptionButtons}>
              <TouchableOpacity
                style={
                  rentalOption === "Rent"
                    ? styles.rentalOptionRentItNowButtonActive
                    : styles.rentalOptionRentItNowButtonNotActive
                }
                onPress={toggleRentalOption}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                disabled={rentalOption === "Rent" ? true : false}
              >
                <Text
                  style={
                    rentalOption === "Rent"
                      ? styles.rentalOptionRentItNowTextActive
                      : styles.rentalOptionRentItNowTextNotActive
                  }
                >
                  {t("rentItNow.rentItNowBtn")}
                </Text>
              </TouchableOpacity>
              {isBookingAvailable && (
                <TouchableOpacity
                  style={
                    rentalOption === "Book"
                      ? styles.rentalOptionBookItButtonActive
                      : styles.rentalOptionBookItButtonNotActive
                  }
                  onPress={toggleRentalOption}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                  disabled={rentalOption === "Book" ? true : false}
                >
                  <Text
                    style={
                      rentalOption === "Book"
                        ? styles.rentalOptionBookItTextActive
                        : styles.rentalOptionBookItTextNotActive
                    }
                  >
                    {t("rentItNow.bookItBtn")}
                  </Text>
                </TouchableOpacity>
              )}
              {!isBookingAvailable && (
                <Text style={styles.rentalOptionBookItDisabled}>
                  {t("rentItNow.bookItBtn")}
                </Text>
              )}
            </View>
          </View>

          {!isNextStepActive &&
            selectedStartDate &&
            selectedEndDate &&
            rentalOption && (
              <TouchableOpacity
                style={styles.nextStepButton}
                onPress={() => setNextStepActive(true)}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Text style={styles.nextStepText}>
                  {t("rentItNow.nextStepText")}
                </Text>
              </TouchableOpacity>
            )}

          {isNextStepActive && (
            <View style={styles.addressContainer}>
              <View style={styles.addressLabelWithReset}>
                <Text style={styles.addressLabel}>{`${t(
                  "rentItNow.addressLabel"
                )}:`}</Text>
                <TouchableOpacity
                  style={styles.addressResetButton}
                  onPress={() => setAddress(null)}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                >
                  <Text style={styles.addressResetText}>{`${t(
                    "rentItNow.addressResetText"
                  )}`}</Text>
                </TouchableOpacity>
              </View>

              {user?.addresses && (
                <TouchableOpacity
                  style={styles.addressListButton}
                  onPress={toggleAddressList}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                >
                  <Text style={styles.addressListText}>
                    {address
                      ? `${address?.adresse}, ${address?.street} ${address?.buildingNumber}`
                      : `${t("rentItNow.addressListText")}`}
                  </Text>
                  <Icon
                    name={isAddressListVisible ? "arrow-up" : "arrow-down"}
                    width={22}
                    height={22}
                  />
                </TouchableOpacity>
              )}

              {user?.addresses && isAddressListVisible && (
                <View style={styles.addressList}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    style={styles.addressListScroll}
                    showsVerticalScrollIndicator={true}
                  >
                    {user?.addresses?.map((addressItem) => (
                      <TouchableOpacity
                        key={`RentItView_AddressList_${addressItem?.adresse}_${addressItem?.street}_${addressItem?.phoneNumber}`}
                        style={
                          addressItem ===
                          user.addresses[user.addresses.length - 1]
                            ? styles.addressListItemWithoutBorder
                            : styles.addressListItemWithBorder
                        }
                        onPress={() => selectAddress(addressItem)}
                        activeOpacity={globalStyles.ACTIVE_OPACITY}
                      >
                        <Text style={styles.addressListItemText}>
                          {`→  ${addressItem?.adresse}, ${addressItem?.street} ${addressItem?.buildingNumber}`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {address && !isAddressListVisible && (
                <View style={styles.selectedAddressContainer}>
                  <View style={styles.selectedAddressTextWithIcon}>
                    <Icon
                      name="user-stroke"
                      width={15}
                      height={15}
                      colorStroke={globalStyles.primaryColor}
                    />
                    <Text style={styles.selectedAddressText}>
                      {address?.adresse}
                    </Text>
                  </View>

                  {address?.phoneNumber && (
                    <View style={styles.selectedAddressTextWithIcon}>
                      <Icon
                        name="phone"
                        width={15}
                        height={15}
                        colorStroke={globalStyles.primaryColor}
                      />
                      <Text style={styles.selectedAddressText}>
                        {address?.phoneNumber}
                      </Text>
                    </View>
                  )}

                  <View style={styles.selectedAddressTextWithIcon}>
                    <Icon
                      name="envelope"
                      width={15}
                      height={15}
                      fillColor={globalStyles.primaryColor}
                    />
                    <Text style={styles.selectedAddressText}>
                      {address?.email}
                    </Text>
                  </View>

                  <View style={styles.selectedAddressTextWithIcon}>
                    <Icon
                      name="location"
                      width={15}
                      height={15}
                      colorStroke={globalStyles.primaryColor}
                    />
                    <Text style={styles.selectedAddressText}>
                      {address?.street} {address?.buildingNumber}
                    </Text>
                  </View>

                  {(address?.flatOrApartmentNumber || address?.floorNumber) && (
                    <View style={styles.selectedAddressTextWithIcon}>
                      <Icon
                        name="door"
                        width={15}
                        height={15}
                        colorStroke={globalStyles.primaryColor}
                      />
                      <Text style={styles.selectedAddressText}>
                        {address?.flatOrApartmentNumber && address?.floorNumber
                          ? `${address.flatOrApartmentNumber}, `
                          : address?.flatOrApartmentNumber
                          ? address.flatOrApartmentNumber
                          : ""}
                        {address?.flatOrApartmentNumber &&
                        address?.floorNumber === "0"
                          ? "ground floor"
                          : !address?.flatOrApartmentNumber &&
                            address?.floorNumber === "0"
                          ? "Ground floor"
                          : address?.floorNumber === "1" ||
                            address?.floorNumber === "-1"
                          ? `${address.floorNumber}st floor`
                          : address?.floorNumber === "2" ||
                            address?.floorNumber === "-2"
                          ? `${address.floorNumber}nd floor`
                          : address?.floorNumber === "3" ||
                            address?.floorNumber === "-3"
                          ? `${address.floorNumber}rd floor`
                          : address?.floorNumber
                          ? `${address.floorNumber}th floor`
                          : ""}
                      </Text>
                    </View>
                  )}

                  <View style={styles.selectedAddressTextWithIcon}>
                    <Icon
                      name="city"
                      width={15}
                      height={15}
                      fillColor={globalStyles.primaryColor}
                    />
                    <Text style={styles.selectedAddressText}>
                      {address?.postalCode} {address?.city}, {address?.country}
                    </Text>
                  </View>
                </View>
              )}

              {user?.addresses && !address && (
                <Text style={styles.addressOrText}>
                  {t("rentItNow.addressOrText")}
                </Text>
              )}

              {!address && (
                <TouchableOpacity
                  style={styles.addressCreateAnAddressButton}
                  onPress={() => navigation.navigate("AddressesView")}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                >
                  <Text style={styles.addressCreateAnAddressText}>
                    {t("rentItNow.addressCreateAnAddressText")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {isNextStepActive && (
            <View style={styles.paymentContainer}>
              <Text style={styles.paymentLabel}>{`${t(
                "rentItNow.paymentLabel"
              )}: `}</Text>
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
                  <View>
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
                          cardFormData?.valid ? "green" : globalStyles.redColor
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

          {isFinishButtonActive &&
            selectedStartDate &&
            selectedEndDate &&
            rentalOption &&
            address &&
            ((selectedPaymentMethod === "Card" && cardFormData?.valid) ||
              (selectedPaymentMethod === "BLIK" &&
                valueBLIK &&
                !errorBLIK)) && (
              <View style={styles.finishContainer}>
                {counter === 0 && (
                  <TouchableOpacity
                    style={styles.finishButton}
                    onPress={finishRenting}
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
                  >
                    <Text style={styles.finishText}>
                      {rentalOption === "Rent"
                        ? `${t(
                            "rentItNow.lastRentalOptionRentText"
                          )}: $${getTotalAmount(
                            selectedStartDate,
                            selectedEndDate
                          )} ${t("rentItNow.lastRentalOptionFOR")} ${
                            getDaysBetweenTwoDates(
                              selectedStartDate,
                              selectedEndDate
                            ) + 1
                          } ${
                            getDaysBetweenTwoDates(
                              selectedStartDate,
                              selectedEndDate
                            ) +
                              1 >
                            1
                              ? t("rentItNow.daysText")
                              : t("rentItNow.dayText")
                          }`
                        : `${t(
                            "rentItNow.lastRentalOptionBookText"
                          )}: $${get20Percent(
                            selectedStartDate,
                            selectedEndDate
                          )} ${t("rentItNow.lastRentalOptionFOR")} ${
                            getDaysBetweenTwoDates(
                              selectedStartDate,
                              selectedEndDate
                            ) + 1
                          } ${
                            getDaysBetweenTwoDates(
                              selectedStartDate,
                              selectedEndDate
                            ) +
                              1 >
                            1
                              ? t("rentItNow.daysText")
                              : t("rentItNow.dayText")
                          }`}
                    </Text>
                  </TouchableOpacity>
                )}
                {counter != 0 && (
                  <View style={styles.finishProgress}>
                    <Progress.Bar
                      progress={counter / 100}
                      useNativeDriver={true}
                      width={width - 50}
                      color={globalStyles.accentColor}
                      unfilledColor={globalStyles.textOnAccentColor}
                      borderColor={globalStyles.accentColor}
                      borderWidth={2}
                      height={40}
                      borderRadius={15}
                    />
                    <Text style={styles.finishProgressText}>
                      {counter != 100
                        ? `Creating a request: ${counter}%`
                        : rentalOption === "Rent"
                        ? `${t("rentItNow.successfulRent")}`
                        : `${t("rentItNow.successfulBook")}`}
                    </Text>
                  </View>
                )}
              </View>
            )}
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default RentItNowView;
