import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

// import fetchSVG, { fetchImgURL } from "../utils/fetchSVG";
import { G, SvgUri } from "react-native-svg";

import { globalStyles, styles as mainStyles } from "../utils/style";
// import { iconParams, styles } from "../styles/AnnouncementViewStyles";
import { Divider, Rating } from "react-native-elements";
import OpinionCard from "../components/OpinionCard";
import Swiper from "react-native-swiper";
import ImageViewing from "react-native-image-viewing";

import {
  ref,
  onValue,
  update,
  get,
  set,
  remove,
  goOnline,
} from "firebase/database";
import { db, storage } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

import {
  fetchSvgURL,
  fetchImgURL,
  getRandomAvatarUrl,
} from "../utils/fetchSVG";

import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "../components/Icon";

import CalendarPicker from "react-native-calendar-picker";

import {
  CreditCardView,
  CreditCardInput,
  LiteCreditCardInput,
  CreditCardFormData,
  CreditCardFormField,
  ValidationState,
} from "react-native-credit-card-input";
import { color } from "react-native-elements/dist/helpers";

import * as Progress from "react-native-progress";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const RentItNowView = ({ route }) => {
  const navigation = useNavigation();

  const { user, setUser } = useUser();

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [key, setKey] = useState(0); // Используется для перерендеринга
  const [isLoading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState([]);
  // const [unavailableDates, setUnavailableDates] = useState([]);
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

  const { id } = route.params;

  // Formularz do karty płatniczej
  // const {
  //   control: cardControl,
  //   handleSubmit: cardHandleSubmit,
  //   reset: cardReset,
  //   setValue: cardSetValue,
  //   formState: { errors: cardErrors },
  // } = useForm();
  // Formularz do BLIKa
  const {
    control: blikControl,
    handleSubmit: blikHandleSubmit,
    reset: blikReset,
    setValue: blikSetValue,
    formState: { errors: blikErrors },
  } = useForm();

  // Funkcje do zarządzania datami
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

  // Pobieranie bieżącego użytkownika
  useEffect(() => {
    if (!user) return;

    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const currentUserEntry = Object.entries(data).find(
          ([key, userData]) => userData.email === user.email
        );

        if (currentUserEntry) {
          const [key, userData] = currentUserEntry;
          setUser({ ...userData, id: key }); // Dodaj klucz jako "id"
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Pobieranie ogłoszenia z bazy
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
        setLoading(false); // Ustawienie ładowania na false po zakończeniu pobierania
      },
      (error) => {
        console.error("Błąd podczas pobierania danych:", error);
        setLoading(false); // Nawet w przypadku błędu przerywamy ładowanie
      }
    );

    return () => unsubscribe();
  }, [id]);

  // Пример массива недоступных дат
  // const unavailableDates = [
  //   { startDate: new Date(2025, 0, 10), endDate: new Date(2025, 0, 15) },
  //   // { startDate: new Date(2025, 0, 20), endDate: new Date(2025, 0, 25) },
  //   { startDate: new Date(2025, 0, 28), endDate: new Date(2025, 1, 2) },
  // ];

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

  // const isDateUnavailable = (date) => {
  //   // Проверка недоступных дат из массива
  //   const isInUnavailableRange = unavailableDates.some(
  //     ({ startDate, endDate }) => date >= startDate && date <= endDate
  //   );

  //   // Проверка границ доступных дат
  //   const isOutOfBounds = date < firstAvailableDate || date > lastAvailableDate;

  //   return { isUnavailable: isInUnavailableRange, isOutOfBounds };
  // };

  const generateCustomDatesStyles = () => {
    const stylesArray = [];

    // Стиль для дат из unavailableDates
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

    // Стиль для дат за границами доступного диапазона
    // let currentDate = new Date(2025, 0, 1);
    // while (currentDate < firstAvailableDate) {
    //   stylesArray.push({
    //     date: new Date(currentDate),
    //     style: styles.outOfBoundsDate,
    //     textStyle: styles.outOfBoundsDateText,
    //     allowDisabled: true,
    //   });
    //   currentDate.setDate(currentDate.getDate() + 1);
    // }

    // currentDate = new Date(lastAvailableDate);
    // currentDate.setDate(currentDate.getDate() + 1);
    // while (currentDate <= new Date(2025, 1, 28)) {
    //   stylesArray.push({
    //     date: new Date(currentDate),
    //     style: styles.outOfBoundsDate,
    //     textStyle: styles.outOfBoundsDateText,
    //     allowDisabled: true,
    //   });
    //   currentDate.setDate(currentDate.getDate() + 1);
    // }

    return stylesArray;
  };

  const isRangeValid = (start, end) => {
    if (!start || !end) return true;

    // Проверяем, пересекает ли диапазон недоступные даты
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
    setKey((prevKey) => prevKey + 1); // Обновляем key для перерендеринга
  };

  const handleDateChange = (date, type) => {
    if (type === "START_DATE") {
      if (isRangeValid(date, selectedEndDate)) {
        setSelectedStartDate(date);
      } else {
        alert("Выбранный диапазон включает недоступные даты.");
        resetDates(); // Сбрасываем даты
      }
    } else {
      if (isRangeValid(selectedStartDate, date)) {
        setSelectedEndDate(date);
      } else {
        alert("Выбранный диапазон включает недоступные даты.");
        resetDates(); // Сбрасываем даты
      }
    }
  };

  const getDisabledDates = () => {
    const disabledDates = [];

    // Добавляем даты из unavailableDates
    unavailableDates.forEach(({ startDate, endDate }) => {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        disabledDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Добавляем даты за границами доступного диапазона
    // let currentDate = new Date(2025, 0, 1);
    // while (currentDate < firstAvailableDate) {
    //   disabledDates.push(new Date(currentDate));
    //   currentDate.setDate(currentDate.getDate() + 1);
    // }

    // currentDate = new Date(lastAvailableDate);
    // currentDate.setDate(currentDate.getDate() + 1);
    // while (currentDate <= new Date(2025, 1, 28)) {
    //   disabledDates.push(new Date(currentDate));
    //   currentDate.setDate(currentDate.getDate() + 1);
    // }

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

  const selectedAddressIconOptions = {
    width: 15,
    height: 15,
    colorStroke: globalStyles.primaryColor,
    fillColor: globalStyles.primaryColor,
  };

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

  const createRentalOrReservationData = async (dataId, data, dataPath) => {
    const dataRef = ref(
      db,
      `announcements/${announcement.id}/${dataPath}/${dataId}`
    );
    await set(dataRef, data);
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
    };
    const dataId = Date.now();
    if (rentalOption === "Rent") {
      await createRentalOrReservationData(dataId, data, "rentalData");
    } else if (rentalOption === "Book") {
      await createRentalOrReservationData(dataId, data, "reservationData");
    }
    alert("Successfully rented / booked!");
    navigation.goBack();
  };

  const intervalRef = useRef();

  const interval = () => {
    intervalRef.current = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 50);
  };

  useEffect(() => {
    const intervalId = intervalRef.current;

    // also clear on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (counter >= 100) {
      clearInterval(intervalRef.current);
      setCounter(100);
      requestRenting();
    }
  }, [counter]);

  const finishRenting = () => {
    console.log("Finish");
    interval();
  };

  // console.log(selectedStartDate.getTime());

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View style={[mainStyles.container, mainStyles.scrollBase, {paddingTop: 20}]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          // style={mainStyles.scrollBase}
        >
          <View style={styles.datePickerContainer}>
            <CalendarPicker
              key={key} // Используем key для перерендеринга
              startFromMonday={true}
              allowRangeSelection={true}
              allowBackwardRangeSelect={true}
              showDayStragglers={true}
              restrictMonthNavigation={true}
              months={[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ]}
              weekdays={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              previousTitle="Previous"
              nextTitle="Next"
              selectMonthTitle="Select month in "
              selectYearTitle="Select year"
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
              // selectedDisabledDatesTextStyle={
              //   styles.datePickerSelectedDisabledDatesTextStyle
              // }
              disabledDatesTextStyle={styles.datePickerDisabledDatesTextStyle}
              // todayBackgroundColor="red"
              todayTextStyle={styles.datePickerTodayTextStyle}
              textStyle={styles.datePickerTextStyle}
              // customDayHeaderStyles={customDayHeaderStyles}
              dayLabelsWrapper={styles.datePickerDayLabelsWrapper}
              // monthYearHeaderWrapperStyle={
              //   styles.datePickerMonthYearHeaderWrapperStyle
              // }
              // headerWrapperStyle={styles.datePickerHeaderWrapperStyle}
              monthTitleStyle={styles.datePickerMonthTitleStyle}
              yearTitleStyle={styles.datePickerYearTitleStyle}
            />
            <Divider style={styles.dateDivider} />
            <Text style={styles.dateResulText}>
              From:{" "}
              <Text style={{ color: globalStyles.textOnSecondaryColor }}>
                {selectedStartDate
                  ? selectedStartDate.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Choose a start date"}
              </Text>
            </Text>
            <Text style={styles.dateResulText}>
              To:{" "}
              <Text style={{ color: globalStyles.textOnSecondaryColor }}>
                {selectedEndDate
                  ? selectedEndDate.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Choose an end date"}
              </Text>
            </Text>
            <Text style={styles.dateResulText}>
              Total amount:{" "}
              <Text style={{ color: globalStyles.textOnSecondaryColor }}>
                {selectedStartDate && selectedEndDate
                  ? `$${getTotalAmount(selectedStartDate, selectedEndDate)}`
                  : "Choose start and end dates"}
              </Text>{" "}
              <Text style={{ color: globalStyles.accentColor }}>
                {rentalOption === "Book" && selectedStartDate && selectedEndDate
                  ? `($${get20Percent(
                      selectedStartDate,
                      selectedEndDate
                    )} for booking)`
                  : ""}
              </Text>
            </Text>
            <TouchableOpacity
              style={styles.dateResetButton}
              onPress={resetDates}
              activeOpacity={globalStyles.ACTIVE_OPACITY}
            >
              <Text style={styles.dateResetText}>Reset chosen dates</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rentalOptionContainer}>
            <Text style={styles.rentalOptionLabel}>
              Choose a rental option:
            </Text>
            {rentalOption === "Rent" && (
              <Text style={styles.rentalOptionRentItNowDescription}>
                You rent with the obligation to pay the entire amount. If you
                cancel, you won't get your money back.
              </Text>
            )}
            {/* Wynajmujesz z obowiązkiem zapłaty całej kwoty. Jeśli zrezygnujesz,
            nie dostaniesz pieniędzy z powrotem. */}
            {rentalOption === "Book" && (
              <Text style={styles.rentalOptionBookItDescription}>
                You reserve this announcement for later. You will pay 20% of the
                total amount, which you will not get back if you cancel your
                reservation. From the moment of booking and until{" "}
                <Text style={{ color: globalStyles.accentColor }}>
                  {selectedStartDate
                    ? selectedStartDate.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "CHOOSE A START DATE"}
                </Text>
                , you must pay the remaining 80% to be able to rent this ad. If
                you do not pay before this deadline, your reservation will be
                canceled.
              </Text>
            )}
            {/* Rezerwujesz to ogłoszenie na później. Zapłacisz 20% od całej kwoty,
            którą nie dostaniesz z powrotem w przypadku rezygnacji z rezerwacji.
            Od momentu złożenia rezerwacji i do{" "}
            {selectedStartDate
              ? selectedStartDate.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "CHOOSE A START DATE"}{" "}
            musisz zapłacić pozostałe 80%, żeby móc wypożyczyć to ogłoszenie.
            Jeśli nie zapłacisz przed upływem tego terminu, rezerwacja zostanie
            anulowana. */}
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
                  Rent it now
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
                    Book it
                  </Text>
                </TouchableOpacity>
              )}
              {!isBookingAvailable && (
                <Text style={styles.rentalOptionBookItDisabled}>
                  You cannot book these dates
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
                <Text style={styles.nextStepText}>Next step</Text>
              </TouchableOpacity>
            )}

          {isNextStepActive && (
            <View style={styles.addressContainer}>
              <View style={styles.addressLabelWithReset}>
                <Text style={styles.addressLabel}>Delivery address:</Text>
                <TouchableOpacity
                  style={styles.addressResetButton}
                  onPress={() => setAddress(null)}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                >
                  <Text style={styles.addressResetText}>Reset</Text>
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
                      : "Choose an address"}
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
                        activeOpacity={1}
                      >
                        <Text style={styles.addressListItemText}>
                          → {addressItem?.adresse}, {addressItem?.street}{" "}
                          {addressItem?.buildingNumber}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {address && !isAddressListVisible && (
                <View style={styles.selectedAddressContainer}>
                  {/* Adresse */}
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

                  {/* Phone number */}
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

                  {/* E-mail */}
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

                  {/* Street + Building bumber */}
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

                  {/* Flat number + Floor number */}
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

                  {/* Postal code + City + Country */}
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
                <Text style={styles.addressOrText}>or</Text>
              )}

              {!address && (
                <TouchableOpacity
                  style={styles.addressCreateAnAddressButton}
                  onPress={() => navigation.navigate("AddressesView")}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
                >
                  <Text style={styles.addressCreateAnAddressText}>
                    Create an address
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {isNextStepActive && (
            <View style={styles.paymentContainer}>
              <Text style={styles.paymentLabel}>Payment method: </Text>
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
                    Credit card
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
                    BLIK
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
                    // fontFamily="WorkSans_900Black"
                    // imageFront={{uri: "https://www.regions.com/-/media/Images/DotCom/Products/business-credit-cards/Business-CC-Spotlight.jpg?revision=89e59129-eafa-4011-a1e4-3ff611246586&la=en&h=480&w=850&hash=BBF4484733C1953A05CC29FC21CA2EF7"}}
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
                          ? "Possibly valid card"
                          : "Invalid/Incomplete card"}
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
                        Number:{" "}
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
                        Expiry:{" "}
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
                        CVC/CVV:{" "}
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
                        Type:{" "}
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
                    placeholder="Enter the BLIK code"
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
                        ? `Rent it now for $${getTotalAmount(
                            selectedStartDate,
                            selectedEndDate
                          )} for ${
                            getDaysBetweenTwoDates(
                              selectedStartDate,
                              selectedEndDate
                            ) + 1
                          } day(s)`
                        : `Book it for $${get20Percent(
                            selectedStartDate,
                            selectedEndDate
                          )} for ${
                            getDaysBetweenTwoDates(
                              selectedStartDate,
                              selectedEndDate
                            ) + 1
                          } day(s)`}
                    </Text>
                  </TouchableOpacity>
                )}
                {counter != 0 && (
                  <View style={styles.finishProgress}>
                    <Progress.Bar
                      progress={counter / 100}
                      useNativeDriver={true}
                      width={350}
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
                        ? `Rented successfully`
                        : `Booked successfully`}
                    </Text>
                  </View>
                )}
              </View>
            )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default RentItNowView;

const styles = StyleSheet.create({
  datePickerContainer: {
    width: "100%",
    height: "auto",
    padding: 10,
    gap: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
    // padding: 50,
    // marginRight: 1,
  },

  datePickerPreviousTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    width: 70,
    padding: 5,
    textAlign: "center",
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    color: globalStyles.textOnPrimaryColor,
    backgroundColor: globalStyles.primaryColor,
  },

  datePickerNextTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    width: 70,
    padding: 5,
    textAlign: "center",
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    color: globalStyles.textOnPrimaryColor,
    backgroundColor: globalStyles.primaryColor,
  },

  // Niewiadomo do czego służy
  datePickerSelectedDayStyle: {
    // color: "blue",
    // backgroundColor: "red",
  },

  datePickerSelectedDayTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnAccentColor,
  },

  datePickerSelectedRangeStartTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnAccentColor,
  },

  datePickerSelectedRangeEndTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnAccentColor,
  },

  datePickerSelectedRangeStartStyle: {
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  datePickerSelectedRangeEndStyle: {
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  datePickerSelectedRangeStyle: {
    backgroundColor: globalStyles.accentColor,
  },

  datePickerDisabledDatesTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "gray",
  },

  datePickerTodayTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },

  datePickerTextStyle: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  datePickerDayLabelsWrapper: {
    borderColor: globalStyles.primaryColor,
  },

  // datePickerMonthYearHeaderWrapperStyle: {
  // },

  // datePickerHeaderWrapperStyle: {
  // },

  datePickerMonthTitleStyle: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  datePickerYearTitleStyle: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  selectedDatesContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  unavailableDate: {
    // backgroundColor: "#FF6347", // Красный для дат из unavailableDates
    borderRadius: 5,
    backgroundColor: globalStyles.redColor,
  },

  unavailableDateText: {
    // color: "#FFFFFF",
    color: globalStyles.textOnRedColor,
  },

  // outOfBoundsDate: {
  //   backgroundColor: "#D3D3D3", // Серый для дат за пределами доступных
  //   borderRadius: 5,
  // },
  // outOfBoundsDateText: {
  //   color: "#A9A9A9",
  // },

  dateDivider: {
    // height: 5,
    // width: 5,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderColor: globalStyles.primaryColor,
  },

  dateResulText: {
    paddingHorizontal: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  dateResetButton: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  dateResetText: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  rentalOptionContainer: {
    marginTop: 10,
    gap: 10,
  },

  rentalOptionLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  rentalOptionRentItNowDescription: {
    paddingHorizontal: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  rentalOptionBookItDescription: {
    paddingHorizontal: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  rentalOptionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rentalOptionRentItNowButtonActive: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  rentalOptionRentItNowButtonNotActive: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
  },

  rentalOptionRentItNowTextActive: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  rentalOptionRentItNowTextNotActive: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
  },

  rentalOptionBookItButtonActive: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  rentalOptionBookItButtonNotActive: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnPrimaryColor,
  },

  rentalOptionBookItTextActive: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  rentalOptionBookItTextNotActive: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.primaryColor,
  },

  rentalOptionBookItDisabled: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: globalStyles.primaryColor,
    backgroundColor: globalStyles.textOnRedColor,
    color: globalStyles.primaryColor,
  },

  nextStepButton: {
    marginTop: 20,
    width: "100%",
    padding: 10,
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  nextStepText: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnAccentColor,
  },

  addressContainer: {
    marginTop: 10,
    gap: 10,
  },

  addressLabelWithReset: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  addressLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  addressResetButton: {
    padding: 5,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  addressResetText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnPrimaryColor,
  },

  addressListButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  addressListText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnPrimaryColor,
  },

  addressList: {
    zIndex: -1,
    marginTop: -20,
    padding: 10,
    paddingTop: 20,
    // gap: 5,
    // height: 200,
    height: "auto",
    // flex: 1,
    // overflow: "hidden",
    backgroundColor: globalStyles.secondaryColor,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
  },

  addressListScroll: {},

  addressListItemWithoutBorder: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    gap: 10,
  },

  addressListItemWithBorder: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    gap: 10,
    paddingBottom: 7,
    marginBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.textOnSecondaryColor,
  },

  addressListItemText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  addressOrText: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  addressCreateAnAddressButton: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  addressCreateAnAddressText: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnPrimaryColor,
  },

  selectedAddressContainer: {
    zIndex: -1,
    marginTop: -20,
    padding: 10,
    paddingTop: 20,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
  },

  selectedAddressTextWithIcon: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },

  selectedAddressText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnSecondaryColor,
  },

  paymentContainer: {
    marginTop: 10,
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

  finishContainer: {
    marginTop: 20,
  },

  finishButton: {
    // marginTop: 20,
    width: "100%",
    padding: 10,
    justifyContent: "center",
    // alignItems: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
  },

  finishText: {
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnAccentColor,
  },

  finishProgress: {},

  finishProgressText: {
    zIndex: -1,
    marginTop: -25,
    padding: 10,
    paddingTop: 30,
    gap: 10,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    borderWidth: 2,
    borderColor: globalStyles.accentColor,
    backgroundColor: globalStyles.textOnAccentColor,
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.accentColor,
  },
});
