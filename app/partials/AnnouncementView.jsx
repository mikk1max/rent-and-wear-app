import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

import { ref, onValue, update } from "firebase/database";
import { db } from "../../firebaseConfig";

import fetchSVG, { fetchImgURL } from "../utils/fetchSVG";
import { G, SvgUri } from "react-native-svg";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { iconParams, styles } from "../styles/AnnouncementViewStyles";
import { Divider, Rating } from "react-native-elements";
import OpinionCard from "../components/OpinionCard";
import Swiper from "react-native-swiper";
import ImageViewing from "react-native-image-viewing";

const AnnouncementView = ({ route }) => {
  const navigation = useNavigation();

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Parameters from navigation.navigate()
  const { name, id } = route.params;

  // Temp Announcement data
  const announcement = {
    id: "111",
    title: "Holey underpants",
    mainImage:
      "https://www.tommyjohn.com/cdn/shop/articles/holey.webp?v=1659548657&width=1500",
    images: [
      {
        uri: "https://www.tommyjohn.com/cdn/shop/articles/holey.webp?v=1659548657&width=1500",
      },
      {
        uri: "https://static01.nyt.com/images/2012/05/01/business/SMITH-obit/SMITH-obit-superJumbo.jpg",
      },
      {
        uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
      },
      {
        uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
      },
      {
        uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
      },
    ],
    category: "Underwear",
    description:
      "Say hello to our delightfully quirky Holey Underpants—because life’s too short for boring underwear! Designed with intentional, strategically placed holes, these underpants bring a new twist to comfort and breathability. Whether you’re lounging at home or adding a fun flair to your wardrobe, these playful undergarments are a conversation starter that doesn’t compromise on practicality. Made from soft, stretchy fabric, they provide a comfortable fit while keeping things cool and airy all day long.\n\nHoley Underpants aren’t just about fun — they’re functional, too. The lightweight, breathable material is perfect for those who prioritize comfort and love a good laugh. With a durable elastic waistband, these underpants are designed to stay in place, ensuring a snug fit without being restrictive. They’re available in a variety of colors and sizes, catering to every personality and style preference. Plus, they make a hilarious gift for the jokester in your life or the person who already has everything!\n\nFrom cozying up at home to surprising a friend with a laugh-out-loud gift, Holey Underpants are here to brighten your day. They’re easy to care for—simply toss them in the wash, and they’re ready for another round of fun. Whether you're buying them as a gag gift, for everyday use, or just to bring a smile to your face, these unique underpants are a perfect blend of humor and practicality. Grab your pair today and add a little playfulness to your wardrobe!",
    publicationDate: 1832209087178,
    pricePerDay: 8.75,
    rating: 3.4,
    sizes: ["S", "M", "L", "XL", "XXL"],
    // sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    condition: "has traces of use",
    // condition: "nosi lekkie ślady użytkowania",
    advertiserId: "123",
  };

  const displayedPublicationDate = new Date(
    announcement.publicationDate
  ).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const advertiser = {
    id: "222",
    image:
      "https://static01.nyt.com/images/2012/05/01/business/SMITH-obit/SMITH-obit-superJumbo.jpg",
    firstName: "Michał",
    lastName: "Zakrzewski",
    rating: 2.65,
    registrationDate: 1732209087178,
  };

  const displayedAdvertiserRegistrationDate = new Date(
    advertiser.registrationDate
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const opinion = {
    id: "333",
    authorId: "3333",
    authorFirstName: "Bob",
    authorLastName: "Smith",
    rate: 4,
    date: 1732292072263,
    text: "Good panties! I wore them on my first date.",
  };

  const displayedOpinionPublicationDate = new Date(
    opinion.date
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openImage = (index) => {
    setCurrentIndex(index); // Ustaw aktualny indeks
    setIsVisible(true); // Pokaż pełnoekranowy obraz
    console.log(`Open ${index}`);
  };

  const imagePlaceholder = {
    uri: "https://img.freepik.com/free-vector/low-poly-abstract-gray-background_1017-33833.jpg",
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View style={[mainStyles.container, mainStyles.scrollBase]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          // style={mainStyles.scrollBase}
        >
          <View style={styles.annSwiperContainer}>
            <Swiper style={styles.annSwiper} showsButtons={false}>
              {announcement.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.annSlide}
                  onPress={() => openImage(index)}
                >
                  <Image
                    source={{ uri: image.uri }}
                    defaultSource={{ uri: imagePlaceholder.uri }}
                    style={styles.annSlideImage}
                  />
                </TouchableOpacity>
              ))}
            </Swiper>

            {/* ImageViewing - pełnoekranowe wyświetlanie */}
            <ImageViewing
              images={announcement.images}
              imageIndex={currentIndex} // Zaczyna od wybranego obrazu
              visible={isVisible}
              presentationStyle="overFullScreen"
              FooterComponent={({ imageIndex }) => (
                <Text style={styles.annImageFooter}>
                  {imageIndex + 1} / {announcement.images.length}
                </Text>
              )}
              onRequestClose={() => setIsVisible(false)} // Zamknij po kliknięciu
            />
          </View>

          <View style={styles.annDateWithTitle}>
            <Text style={styles.annPublicationDateAndCategory}>
              {displayedPublicationDate}
            </Text>
            <Text style={styles.annTitle}>{announcement.title}</Text>
            <Text style={styles.annPublicationDateAndCategory}>
              Category: {announcement.category}
            </Text>
          </View>
          <View style={styles.annPriceWithRating}>
            <Text style={styles.annPrice}>
              ${announcement.pricePerDay} / day
            </Text>
            <Rating
              type={"custom"}
              style={styles.annRating}
              imageSize={25}
              // ratingColor="red"
              ratingBackgroundColor="transparent"
              startingValue={announcement.rating}
              readonly
            />
          </View>
          <View style={styles.annSizeWithCondition}>
            <View style={styles.annSizes}>
              <Text style={styles.annSizesLabel}>Size:</Text>
              {announcement.sizes.map((size) => (
                <Text key={size} style={styles.annSize}>
                  {size}
                </Text>
              ))}
            </View>
            <View style={styles.annCondition}>
              <Text style={styles.annConditionLabel}>Condition:</Text>
              <Text style={styles.annConditionValue}>
                {announcement.condition}
              </Text>
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.annDescription}>
            <Text style={styles.annDescriptionLabel}>Description:</Text>
            <Text style={styles.annDescriptionValue}>
              {announcement.description}
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.advertiser}>
            <Text style={styles.advLabel}>Advertiser:</Text>
            <View style={styles.advImageWithData}>
              <Image
                source={{ uri: advertiser.image }}
                style={styles.advImage}
              />
              <View style={styles.advData}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    console.log(
                      `Write to ${advertiser.firstName} ${advertiser.lastName}`
                    )
                  }
                >
                  <Text style={styles.advName}>
                    {advertiser.firstName} {advertiser.lastName}
                  </Text>
                </TouchableOpacity>

                <Rating
                  type={"custom"}
                  style={styles.advRating}
                  imageSize={20}
                  startingValue={advertiser.rating}
                  readonly
                />
              </View>
            </View>
            <Text style={styles.advRegistrationDate}>
              On <Text style={styles.advRentAndWear}>RENT&WEAR</Text> from{" "}
              {displayedAdvertiserRegistrationDate}.
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.opinions}>
            <Text style={styles.opinLabel}>Opinions:</Text>
            <TouchableOpacity
              style={styles.opinWriteOpinionButton}
              activeOpacity={0.8}
              onPress={() => console.log("Write your opinion.")}
            >
              <Text style={styles.opinWriteOpinionButtonText}>
                Write your opinion
              </Text>
              <Text style={styles.opinWriteOpinionButtonIcon}>▲</Text>
            </TouchableOpacity>
            <View style={styles.opinList}>
              <OpinionCard
                id="1"
                authorId="111"
                userId="111"
                authorFirstName="Maksym"
                authorLastName="Shepeta"
                rate={4.77}
                publicationDate={1632209087178}
                text="Very good underpants!!!"
                isOnModeration={true}
              />

              <OpinionCard
                id="2"
                authorId="111"
                userId="111"
                authorFirstName="Maksym"
                authorLastName="Shepeta"
                rate={4.77}
                publicationDate={1632209087178}
                text="Very good underpants!!!"
                isOnModeration={false}
              />

              <OpinionCard
                id="3"
                authorId="222"
                userId="333"
                authorFirstName={opinion.authorFirstName}
                authorLastName={opinion.authorLastName}
                rate={opinion.rate}
                publicationDate={opinion.date}
                text={opinion.text}
                isOnModeration={false}
              />

              {/* <View style={styles.opinOnModeration}>
                <Text style={styles.opinOnModerationText}>On Moderation...</Text>
                <View style={styles.opinion}>
                  <View style={styles.opinAuthorNameWithPlate}>
                    <Text style={styles.opinAuthorName}>
                      {opinion.authorFirstName} {opinion.authorLastName}
                    </Text>
                    <Text style={styles.opinPlate}>Your opinion</Text>
                  </View>
                  <View style={styles.opinRateWithDate}>
                    <Rating
                      type={"custom"}
                      style={styles.opinRate}
                      imageSize={20}
                      ratingColor={globalStyles.redColor}
                      tintColor={globalStyles.secondaryColor}
                      ratingBackgroundColor={globalStyles.primaryColor}
                      startingValue={opinion.rate}
                      readonly
                    />
                    <Text style={styles.opinDate}>
                      {displayedOpinionPublicationDate}
                    </Text>
                  </View>
                  <Text style={styles.opinText}>{opinion.text}</Text>
                </View>
              </View>

              <View style={styles.opinion}>
                <View style={styles.opinAuthorNameWithPlate}>
                  <Text style={styles.opinAuthorName}>
                    {opinion.authorFirstName} {opinion.authorLastName}
                  </Text>
                  <Text style={styles.opinPlate}>Your opinion</Text>
                </View>
                <View style={styles.opinRateWithDate}>
                  <Rating
                    type={"custom"}
                    style={styles.opinRate}
                    imageSize={20}
                    ratingColor={globalStyles.redColor}
                    tintColor={globalStyles.secondaryColor}
                    ratingBackgroundColor={globalStyles.primaryColor}
                    startingValue={opinion.rate}
                    readonly
                  />
                  <Text style={styles.opinDate}>
                    {displayedOpinionPublicationDate}
                  </Text>
                </View>
                <Text style={styles.opinText}>{opinion.text}</Text>

              </View>

              <View style={styles.opinion}>
                <Text style={styles.opinAuthorName}>
                  {opinion.authorFirstName} {opinion.authorLastName}
                </Text>
                <View style={styles.opinRateWithDate}>
                  <Rating
                    type={"custom"}
                    style={styles.opinRate}
                    imageSize={20}
                    ratingColor={globalStyles.redColor}
                    tintColor={globalStyles.secondaryColor}
                    ratingBackgroundColor={globalStyles.primaryColor}
                    startingValue={opinion.rate}
                    readonly
                  />
                  <Text style={styles.opinDate}>
                    {displayedOpinionPublicationDate}
                  </Text>
                </View>
                <Text style={styles.opinText}>{opinion.text}</Text>
              </View> */}
            </View>
          </View>
        </ScrollView>
        <View style={styles.annBookRentButtons}>
          <TouchableOpacity
            style={styles.annBookRentButton}
            activeOpacity={0.8}
            onPress={() => console.log("BOOK IT")}
          >
            <Text style={styles.annBookRentButtonText}>BOOK IT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.annBookRentButton}
            activeOpacity={0.8}
            onPress={() => console.log("RENT IT NOW")}
          >
            <Text style={styles.annBookRentButtonText}>RENT IT NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AnnouncementView;
