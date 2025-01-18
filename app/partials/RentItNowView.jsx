import React, { useState, useEffect } from "react";
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

// Get the screen dimensions
const { width } = Dimensions.get("window");

const RentItNowView = ({ route }) => {
  const navigation = useNavigation();

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [key, setKey] = useState(0); // Используется для перерендеринга
  const { user, setUser } = useUser();
  const [isLoading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState([]);
  // const [unavailableDates, setUnavailableDates] = useState([]);

  const { id } = route.params;

  // Formularz
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Funkcje do zarządzania datami
  const getToday = () => {
    let today = new Date(Date.now());
    today.setMilliseconds(0);
    today.setSeconds(0);
    today.setMinutes(0);
    today.setHours(0);
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
  const unavailableDates = [
    { startDate: new Date(2025, 0, 10), endDate: new Date(2025, 0, 15) },
    { startDate: new Date(2025, 0, 20), endDate: new Date(2025, 0, 25) },
    { startDate: new Date(2025, 0, 28), endDate: new Date(2025, 1, 2) },
  ];

  // let unavailableDates = [];
  // if (announcement) {
  //   if (announcement.rentalData) {
  //     // setUnavailableDates([
  //     //   ...unavailableDates,
  //     //   {
  //     //     startDate: new Date(announcement.rentalData.startDate),
  //     //     endDate: new Date(announcement.rentalData.endDate),
  //     //   },
  //     // ]);
  //     unavailableDates.push({
  //       startDate: getDateInXDays(
  //         new Date(announcement.rentalData.startDate),
  //         -2
  //       ),
  //       endDate: getDateInXDays(new Date(announcement.rentalData.endDate), 2),
  //     });
  //   }

  //   if (announcement.reservationData) {
  //     announcement.reservationData.map((reservation) => {
  //       // setUnavailableDates([
  //       //   ...unavailableDates,
  //       //   {
  //       //     startDate: new Date(reservation.startDate),
  //       //     endDate: new Date(reservation.endDate),
  //       //   },
  //       // ]);
  //       unavailableDates.push({
  //         startDate: new Date(reservation.startDate),
  //         endDate: new Date(reservation.endDate),
  //       });
  //     });
  //   }
  // }

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

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View style={[mainStyles.container, mainStyles.scrollBase]}>
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
            <TouchableOpacity
              style={styles.dateResetButton}
              onPress={resetDates}
            >
              <Text style={styles.dateResetText}>Reset chosen dates</Text>
            </TouchableOpacity>
            {/* <View style={styles.selectedDatesContainer}>
              {selectedStartDate && (
                <Text style={styles.dateText}>
                  Начальная дата: {selectedStartDate.toString()}
                </Text>
              )}
              {selectedEndDate && (
                <Text style={styles.dateText}>
                  Конечная дата: {selectedEndDate.toString()}
                </Text>
              )}
            </View> */}
          </View>
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

  datePickerSelectedDayStyle: {
    color: "blue",
    backgroundColor: "red",
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
    // backgroundColor: "red"
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "gray",
  },

  datePickerTodayTextStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },

  datePickerTextStyle: {
    // fontFamily: "Poppins_500Medium",
    // fontSize: 14,
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
    backgroundColor: "#FF6347", // Красный для дат из unavailableDates
    borderRadius: 5,
  },

  unavailableDateText: {
    color: "#FFFFFF",
  },

  // outOfBoundsDate: {
  //   backgroundColor: "#D3D3D3", // Серый для дат за пределами доступных
  //   borderRadius: 5,
  // },
  // outOfBoundsDateText: {
  //   color: "#A9A9A9",
  // },

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
});
