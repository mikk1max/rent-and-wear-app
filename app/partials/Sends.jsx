import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  StatusBar,
  Text,
} from "react-native";
import { globalStyles } from "../utils/style";
import AdSendCard from "../components/AdSendCard";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

const calculatePrice = (dateFrom, dateTo, price) => {
  const timeDiff = dateTo.getTime() - dateFrom.getTime();
  const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return days * price;
};

const statuses = [
  "All",
  "Pending",
  "Reserved",
  "Rented",
  "Sent for use",
  "In use",
  "Sent back",
  "Done",
];

const SendsView = () => {
  const [activeStatus, setActiveStatus] = useState("All");

  const products = [
    {
      id: 5,
      link: "link to sweater",
      name: "Sweater",
      price: 8.99,
      dateFrom: new Date("2024-11-01"),
      dateTo: new Date("2024-11-06"),
      status: statuses[1],
    },
    {
      id: 4,
      link: "link to blue jeans",
      name: "Blue jeans",
      price: 40.0,
      dateFrom: new Date("2024-11-01"),
      dateTo: new Date("2024-11-04"),
      status: statuses[2],
    },
    {
      id: 6,
      link: "link to black socks",
      name: "Black socks",
      price: 10.99,
      dateFrom: new Date("2024-10-31"),
      dateTo: new Date("2024-11-05"),
      status: statuses[3],
    },
    {
      id: 1,
      link: "link to holey underpants",
      name: "Holey underpants",
      price: 5.25,
      dateFrom: new Date("2024-10-27"),
      dateTo: new Date("2024-10-30"),
      status: statuses[4],
    },
    {
      id: 2,
      link: "link to black shoes",
      name: "Black shoes",
      price: 1256987.99,
      dateFrom: new Date("2024-10-20"),
      dateTo: new Date("2024-11-05"),
      status: statuses[5],
    },
    {
      id: 3,
      link: "link to red hat",
      name: "Red hat",
      price: 0.1,
      dateFrom: new Date("2024-10-15"),
      dateTo: new Date("2024-10-22"),
      status: statuses[6],
    },
    {
      id: 7,
      link: "link to green boots",
      name: "green boots",
      price: 13.99,
      dateFrom: new Date("2024-09-15"),
      dateTo: new Date("2024-09-22"),
      status: statuses[7],
    },
  ];

  const filteredProducts = products.filter(
    (product) => activeStatus === "All" || product.status === activeStatus
  );

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusBtn,
                activeStatus === status && styles.activeStatusBtn,
              ]}
              onPress={() =>
                setActiveStatus((prevStatus) =>
                  prevStatus == status ? null : status
                )
              }
            >
              <Text
                style={
                  activeStatus === status
                    ? styles.activeStatusText
                    : styles.inactiveStatusText
                }
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.map((product) => (
          <AdSendCard
            key={product.id}
            productName={product.name}
            productPrice={calculatePrice(
              product.dateFrom,
              product.dateTo,
              product.price
            )}
            productLink={product.link}
            productStatus={product.status}
            containerWidth={width - 60}
            progressValue={
              statuses.indexOf(product.status) / (statuses.length - 1)
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingHorizontal: 25,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
    marginBottom: Platform.OS === "android" ? 25 : 30,
  },
  statusContainer: {
    marginBottom: 10,
    maxWidth: width - 60,
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
});

export default SendsView;
