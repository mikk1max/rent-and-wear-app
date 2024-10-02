import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

const SwiperComponent = () => {
  return (
    <View style={styles.swiperContainer}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        showsPagination={false}
        autoplay={true}
        autoplayTimeout={5}
      >
        <View style={styles.slide}>
          <Image
            source={{
              uri: "https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2024/07/shutterstock_2167953203-1.jpg",
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzIAAL0G3hnpSDFi-8FY8mZfyCYNszGRNx8g&s",
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={{
              uri: "https://shopftt.com/cdn/shop/files/IMG_5881_1024x536.jpg?v=1614338812",
            }}
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
    marginVertical: 20,

    // to round the whole block of swiper
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
