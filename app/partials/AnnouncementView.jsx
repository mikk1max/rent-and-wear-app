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

// import fetchSVG, { fetchImgURL } from "../utils/fetchSVG";
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

import {
  fetchSvgURL,
  fetchImgURL,
  getRandomAvatarUrl,
} from "../utils/fetchSVG";

import Icon from "../components/Icon";

const AnnouncementView = ({ route }) => {
  const navigation = useNavigation();

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const { user, setUser } = useUser();
  const [isLoading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [advertiser, setAdvertiser] = useState([]);
  const [advertiserAvatar, setAdvertiserAvatar] = useState();
  // const [visibleOpinions, setVisibleOpinions] = useState(2);
  // const [opinionsToDisplay, setOpinionsToDisplay] = useState([]);

  const { id } = route.params;

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

  // console.log("Announcement: " + announcement);

  const advertiserId = announcement.advertiserId;

  // Pobieranie ogłoszeniodawcy z bazy
  useEffect(() => {
    const advertiserRef = ref(db, `users/${advertiserId}`);
    const unsubscribe = onValue(
      advertiserRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAdvertiser({ advertiserId, ...data });
        } else {
          setAdvertiser(null);
        }
        setLoading(false); // Ustawienie ładowania na false po zakończeniu pobierania
      },
      (error) => {
        console.error("Błąd podczas pobierania danych:", error);
        setLoading(false); // Nawet w przypadku błędu przerywamy ładowanie
      }
    );

    return () => unsubscribe();
  }, [advertiserId]);

  // console.log("Advertiser: " + advertiser);

  // Pobieranie zdjęcia profilowego Ogłoszeniodawcy
  useEffect(() => {
    const fetchProfileImg = async () => {
      try {
        const url = await fetchImgURL(`user-avatars/${advertiserId}.jpg`);
        setAdvertiserAvatar(url);
      } catch {
        const randomUrl = await getRandomAvatarUrl();
        setAdvertiserAvatar(randomUrl);
      }
    };

    if (advertiserId) {
      fetchProfileImg();
    }
  }, [advertiserId]);

  // Renderowanie opinii
  // useEffect(() => {
  //   // if (visibleOpinions > announcement.opinions.length)
  //   //   setVisibleOpinions(announcement.opinions.length);
  //   let opinions = opinionsToDisplay;
  //   for (let i = 0; i < visibleOpinions; i++) {
  //     opinions.push(
  //       <OpinionCard
  //         key={"OpinionCard" + announcement.opinions[i].id}
  //         id={announcement.opinions[i].id}
  //         authorId={announcement.opinions[i].authorId}
  //         userId={user.id}
  //         rate={announcement.opinions[i].rate}
  //         publicationDate={announcement.opinions[i].date}
  //         text={announcement.opinions[i].text}
  //         moderationStatus={announcement.opinions[i].moderationStatus}
  //       />
  //     );
  //   }
  //   setOpinionsToDisplay(opinions);
  // }, [visibleOpinions]);

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

  if (!advertiser) {
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

  const displayedAdvertiserRegistrationDate = new Date(
    advertiser.registrationDate
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const openImage = (index) => {
    setCurrentIndex(index); // Ustaw aktualny indeks
    setIsVisible(true); // Pokaż pełnoekranowy obraz
    console.log(`Open ${index}`);
  };

  // console.log(opinionsToDisplay);

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View style={[mainStyles.container, mainStyles.scrollBase]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={mainStyles.scrollBase}
        >
          <View style={styles.annSwiperContainer}>
            <Swiper style={styles.annSwiper} showsButtons={false}>
              {announcement &&
                announcement?.images?.map((image, index) => (
                  <TouchableOpacity
                    key={"SwiperImage_" + index}
                    style={styles.annSlide}
                    onPress={() => openImage(index)}
                  >
                    <Image
                      source={{ uri: image }}
                      // defaultSource={{ uri: imagePlaceholder }}
                      style={styles.annSlideImage}
                    />
                  </TouchableOpacity>
                ))}
            </Swiper>

            {/* ImageViewing - pełnoekranowe wyświetlanie */}
            <ImageViewing
              images={announcement.images.map((image) => ({ uri: image }))}
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
            {announcement.advertiserId === user.id && (
              <View style={styles.annOwnerPlate}>
                <Text style={styles.annOwnerText}>Your announcement</Text>
                <View style={styles.annOwnerButtons}>
                  <TouchableOpacity
                    style={styles.annOwnerEditButton}
                    onPress={() => console.log("Edit announcement")}
                  >
                    <Icon
                      name="edit-pencil"
                      height={22}
                      width={22}
                      fillColor={globalStyles.textOnPrimaryColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.annOwnerDeleteButton}
                    onPress={() => console.log("Delete announcement")}
                  >
                    <Icon
                      name="trash"
                      height={22}
                      width={22}
                      fillColor={globalStyles.textOnPrimaryColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <Text style={styles.annPublicationDateAndCategory}>
              {displayedPublicationDate}
            </Text>
            <Text style={styles.annTitle}>{announcement.title}</Text>
            <View style={styles.annCategoryContainer}>
              <Text style={styles.annPublicationDateAndCategory}>
                Category:
              </Text>
              <View style={styles.annCategory}>
                <Icon
                  name={announcement.category.subcategoryIcon}
                  height={22}
                  width={22}
                  fillColor={globalStyles.textOnPrimaryColor}
                />
                <Text style={styles.annCategoryText}>
                  {announcement.category.subcategoryName}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.annPriceWithRating}>
            <Text style={styles.annPrice}>
              ${announcement.pricePerDay} / day
            </Text>
            <Rating
              type={"custom"}
              style={styles.annRating}
              imageSize={25}
              ratingColor={globalStyles.accentColor}
              tintColor={globalStyles.backgroundColor}
              ratingBackgroundColor={globalStyles.secondaryColor}
              startingValue={announcement.rating}
              readonly
            />
          </View>
          <View style={styles.annSizeWithCondition}>
            <View style={styles.annSize}>
              <Text style={styles.annSizeLabel}>Size:</Text>
              <Text style={styles.annSizeValue}>{announcement.size}</Text>
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
                source={{ uri: advertiserAvatar }}
                style={styles.advImage}
              />
              <View style={styles.advData}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    console.log(
                      `Write to ${advertiser.name} ${advertiser.surname}`
                    )
                  }
                >
                  <Text style={styles.advName}>
                    {advertiser.name} {advertiser.surname}
                  </Text>
                </TouchableOpacity>

                <Rating
                  type={"custom"}
                  style={styles.advRating}
                  imageSize={20}
                  ratingColor={globalStyles.accentColor}
                  tintColor={globalStyles.backgroundColor}
                  ratingBackgroundColor={globalStyles.secondaryColor}
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
              <Icon name="plus-with-border" {...iconParams} />
              {/* <Text style={styles.opinWriteOpinionButtonIcon}>▲</Text> */}
            </TouchableOpacity>
            <View style={styles.opinList}>
              {announcement &&
                announcement?.opinions?.map((opinion) => (
                  <OpinionCard
                    key={"OpinionCard_" + opinion.id}
                    id={opinion.id}
                    authorId={opinion.authorId}
                    userId={user.id}
                    rate={opinion.rate}
                    publicationDate={opinion.date}
                    text={opinion.text}
                    moderationStatus={opinion.moderationStatus}
                  />
                ))}
              {/* {opinionsToDisplay} */}
            </View>
          </View>
        </ScrollView>
        {announcement.advertiserId != user.id && (
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
              onPress={() => navigation.navigate("RentItNowView", { id: id })}
            >
              <Text style={styles.annBookRentButtonText}>RENT IT NOW</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AnnouncementView;
