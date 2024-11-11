import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { globalStyles } from "../utils/style";
import AdSendCard from "../components/AdSendCard";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { useCustomFonts } from "../utils/fonts";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig";

import fetchSVG from "../utils/fetchSVG";
import { SvgUri } from "react-native-svg";

const { width } = Dimensions.get("window");

const calculatePrice = (dateFrom, dateTo, price) => {
  const timeDiff = dateTo.getTime() - dateFrom.getTime();
  const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return days * price;
};

const SendsGetsView = () => {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // const [products, setProducts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [boxSvg, setBoxSvg] = useState(null);

  useEffect(() => {
    async function loadSvg() {
      const boxIcon = await fetchSVG("app-icons/open-box.svg");

      setBoxSvg(boxIcon);
    }

    loadSvg();
  }, []);

  useEffect(() => {
    const announcementsRef = ref(db, "announcements");
    onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const announcementsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          dateFrom: new Date(data[key].dateFrom),
          dateTo: new Date(data[key].dateTo),
        }));
        setAnnouncements(announcementsArray);
      }
    });
  }, []);

  useEffect(() => {
    const statusesRef = ref(db, "statuses");
    onValue(statusesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const statusesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setStatuses(statusesArray);
      }
    });
  }, []);

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      activeStatus === "All" || announcement.status.status === activeStatus
  );

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status.code}
              style={[
                styles.statusBtn,
                activeStatus === status.status && styles.activeStatusBtn,
              ]}
              onPress={() =>
                setActiveStatus((prevStatus) =>
                  prevStatus == status.status ? "All" : status.status
                )
              }
            >
              <Text
                style={
                  activeStatus === status.status
                    ? styles.activeStatusText
                    : styles.inactiveStatusText
                }
              >
                {status.status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.mainList}>
        <ScrollView
          contentContainerStyle={[
            styles.productsContainer,
            { flexGrow: filteredAnnouncements.length === 0 ? 1 : 0 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredAnnouncements.length > 0 &&
            filteredAnnouncements.map((announcement) => (
              <AdSendCard
                key={announcement.id}
                productName={announcement.name}
                productPrice={calculatePrice(
                  announcement.dateFrom,
                  announcement.dateTo,
                  announcement.price
                )}
                productLink={announcement.link}
                productStatus={announcement.status.status}
                containerWidth={width - 50}
                progressValue={
                  // statuses.indexOf(product.status) / (statuses.length - 1)
                  announcement.status.code / (statuses.length - 1 - 1)
                }
              />
            ))}
          {filteredAnnouncements.length === 0 && (
            <View style={styles.noItemsContainer}>
              <Text style={styles.noItemsMessage}>
                No advertisements found! Please check your filters.
              </Text>
              <View style={styles.centeredButtonContainer}>
                {/* <Image
                  style={styles.noItemsBoxImg}
                  source={require("../../assets/images/NoItemsBox.png")}
                /> */}
                <TouchableOpacity
                  style={styles.noItemsBox}
                  onPress={() => console.log("No items button clicked")}
                >
                  <SvgUri
                    uri={boxSvg}
                    width={100}
                    height={100}
                    style={{ fill: globalStyles.accentColor }}
                  />
                  <Text style={styles.noItemsBtn}>No items found</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingHorizontal: 25,
    // marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
    paddingTop: 20,
    // paddingBottom: Platform.OS === "android" ? 25 : 30,
  },
  mainList: {
    // paddingBottom: Platform.OS === "android" ? 25 : 30,
    flex: 1,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  statusContainer: {
    marginBottom: 10,
    maxWidth: width - 50,
    // borderRadius: 15,
    // overflow: "hidden",
  },
  productsContainer: {
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingBottom: 20,
  },
  statusBtn: {
    padding: 10,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: 15,
    marginRight: 10,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  activeStatusBtn: {
    backgroundColor: globalStyles.accentColor,
  },
  activeStatusText: {
    color: globalStyles.textOnAccentColor,
  },
  inactiveStatusText: {
    color: "white",
  },

  noItemsContainer: {},
  noItemsMessage: {
    marginTop: 10,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: globalStyles.secondaryColor,
    padding: 10,
    color: globalStyles.textOnSecondaryColor,
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  centeredButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noItemsBox: {
    // backgroundColor: globalStyles.secondaryColor,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  // noItemsBoxImg: {
  //   width: 150,
  //   height: 150,
  // },
  noItemsBtn: {
    padding: 10,
    color: globalStyles.accentColor,
    borderRadius: 15,
    overflow: "hidden",
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
  },
});

export default SendsGetsView;
