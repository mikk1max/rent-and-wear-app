import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text, SafeAreaView } from "react-native";
import AdSendCard from "../components/AdSendCard";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { useCustomFonts } from "../utils/fonts";

import { ref, onValue } from "firebase/database";
import { db } from "../../firebase.config";

import { fetchSvgURL } from "../utils/fetchSVG";
import { SvgUri } from "react-native-svg";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { styles } from "../styles/SendsGetsViewStyles";

const { width } = Dimensions.get("window");

const calculatePrice = (dateFrom, dateTo, price) => {
  const timeDiff = dateTo.getTime() - dateFrom.getTime();
  const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return Math.round(days * price * 100) / 100; // Round to 2 decimal places
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
      const boxIcon = await fetchSvgURL("app-icons/open-box.svg");

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

  const calculateProgress = (ann, obj) => {
    const rawValue = ann.status.code / (obj.length - 2);
    return parseFloat(rawValue.toFixed(2));
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View
        style={[mainStyles.container, { alignItems: "stretch", paddingTop: 0 }]}
      >
        <View
          style={[mainStyles.scrollBase, { flex: 0 }, styles.statusContainer]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[mainStyles.scrollBase, { flex: 0 }]}
          >
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

        <View style={mainStyles.scrollBase}>
          <ScrollView
            contentContainerStyle={[
              mainStyles.scrollBase,
              styles.productsContainer,
              {
                flex: 0,
                flexGrow: filteredAnnouncements.length === 0 ? 1 : 0,
              },
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
                  // progressValue={calculateProgress(announcement, statuses)}
                  progressValue={15/100}
                  // progressValue={calculatePrice(1732292072263, 1832292072263, 1)}
                />
              ))}
            {filteredAnnouncements.length === 0 && (
              <View style={styles.noItemsContainer}>
                <Text style={styles.noItemsMessage}>
                  No advertisements found! Please check your filters.
                </Text>
                <View style={styles.centeredButtonContainer}>
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
    </SafeAreaView>
  );
};

export default SendsGetsView;
