import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

const SwiperComponent = () => {
  return (
    <View style={styles.swiperContainer}>
      <Swiper
        showsButtons={false}
        showsPagination={false}
        autoplay={true}
        autoplayTimeout={5}
        loop={true}
      >
        <View style={styles.slide}>
          <Image
            source={require("../../assets/images/swiper-1.jpg")}
            style={styles.image}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require("../../assets/images/swiper-2.jpg")}
            style={styles.image}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require("../../assets/images/swiper-3.jpg")}
            style={styles.image}
          />
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  swiperContainer: {
    height: 180,
    width: "100%",
    marginBottom: 15,

    // round the whole block of swiper
    borderRadius: 15,
    overflow: "hidden",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default SwiperComponent;
