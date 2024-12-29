import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

import fetchSVG, { fetchImgURL } from "../utils/fetchSVG";
import { G, SvgUri } from "react-native-svg";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { iconParams, styles } from "../styles/AnnouncementViewStyles";
import { Divider, Rating } from "react-native-elements";
import OpinionCard from "../components/OpinionCard";
import Swiper from "react-native-swiper";
import ImageViewing from "react-native-image-viewing";

import { ref, onValue, update, get, set, remove } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";

const AnnouncementView = ({ route }) => {
  const navigation = useNavigation();

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const { user, setUser } = useUser();
  const [isLoading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [advertiser, setAdvertiser] = useState([]);

  const { id } = route.params;

  // Pobieranie bieżącego użytkownika
  useEffect(() => {
    if (!user) return;

    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const currentUser = Object.values(data).find(
          (userData) => userData.email === user.email
        );
        setUser(currentUser || null);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

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

  if (isLoading) {
    // Komponent ładowania
    return (
      <SafeAreaView style={mainStyles.whiteBack}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Ładowanie ogłoszenia...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!announcement) {
    // Obsługa braku danych
    return (
      <SafeAreaView style={mainStyles.whiteBack}>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Brak danych do wyświetlenia</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayedPublicationDate = new Date(
    announcement.publicationDate
  ).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // useEffect(() => {
  //   const advertiserRef = ref(db, `users/${announcement.advertiserId}`);
  //   const unsubscribe = onValue(
  //     advertiserRef,
  //     (snapshot) => {
  //       const data = snapshot.val();
  //       if (data) {
  //         setAnnouncement({ id, ...data });
  //       } else {
  //         setAnnouncement(null);
  //       }
  //       setLoading(false); // Ustawienie ładowania na false po zakończeniu pobierania
  //     },
  //     (error) => {
  //       console.error("Błąd podczas pobierania danych:", error);
  //       setLoading(false); // Nawet w przypadku błędu przerywamy ładowanie
  //     }
  //   );

  //   return () => unsubscribe();
  // }, [announcement.advertiserId]);

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
                  key={"SwiperImage_" + index}
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
              <Text style={styles.annSize}>{announcement.size}</Text>
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
