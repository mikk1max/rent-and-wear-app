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
  Alert,
  Modal,
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
import NotFound from "../components/NotFound";

import {
  ref,
  onValue,
  update,
  push,
  get,
  set,
  remove,
} from "firebase/database";
import { db, storage } from "../../firebase.config";
import { useUser } from "../components/UserProvider";

import {
  fetchSvgURL,
  fetchImgURL,
  getRandomAvatarUrl,
} from "../utils/fetchSVG";

import Icon from "../components/Icon";
import Loader from "../components/Loader";
import { useTranslation } from "react-i18next";
import { deleteObject, listAll, ref as storageRef } from "firebase/storage";

const AnnouncementView = ({ route }) => {
  const navigation = useNavigation();
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const { user, setUser } = useUser();
  const [isLoading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [advertiser, setAdvertiser] = useState([]);
  const [advertiserAvatar, setAdvertiserAvatar] = useState();
  // const [visibleOpinions, setVisibleOpinions] = useState(2);
  // const [opinionsToDisplay, setOpinionsToDisplay] = useState([]);
  const [isModalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");

  const { t, i18n } = useTranslation();
  const { id } = route.params;

  // Pobieranie ogłoszenia z bazy
  useEffect(() => {
    setLoading(true);
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

  const advertiserId = announcement ? announcement.advertiserId : null;

  // Pobieranie ogłoszeniodawcy z bazy
  useEffect(() => {
    setLoading(true);
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
        const url = await fetchImgURL(
          `user-avatars/${advertiserId}/${advertiserId}.jpg`
        );
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
        <Loader />
      </SafeAreaView>
    );
  }

  if (!announcement || !advertiser) {
    // Obsługa braku danych
    return (
      <SafeAreaView style={mainStyles.whiteBack}>
        <NotFound />
      </SafeAreaView>
    );
  }

  const displayedPublicationDate = new Date(
    announcement.publicationDate
  ).toLocaleDateString(i18n.language, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayedAdvertiserRegistrationDate = advertiser.registrationDate
    ? new Date(advertiser.registrationDate).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : i18n.language === "pl"
    ? "Data ukryta"
    : "Date hidden";

  const openImage = (index) => {
    setCurrentIndex(index); // Ustaw aktualny indeks
    setIsVisible(true); // Pokaż pełnoekranowy obraz
    console.log(`Open ${index}`);
  };

  // console.log(opinionsToDisplay);

  const onChatPress = (announcement) => {
    if (!user || !user.id) {
      Alert.alert("Login Required", "You need to log in to start a chat.");
      console.log("Current user:", user);

      return;
    }

    if (user.id === announcement.advertiserId) {
      Alert.alert(
        "Cannot Start Chat",
        "You cannot start a chat with yourself. Please select another announcement."
      );
      return;
    }

    const { id: announcementId, advertiserId } = announcement;
    const userId = user.id;

    const chatRef = ref(db, "chats");

    get(chatRef)
      .then((snapshot) => {
        const chats = snapshot.val();
        let chatId = null;

        if (chats) {
          for (const key in chats) {
            const chat = chats[key];

            if (
              chat.announcementId === announcementId &&
              ((chat.advertiserId === advertiserId && chat.userId === userId) ||
                (chat.advertiserId === userId && chat.userId === advertiserId))
            ) {
              chatId = key;
              break;
            }
          }
        }

        if (chatId) {
          console.log(`Navigating to existing chat with ID: ${chatId}`);
          navigation.navigate("Chat", { chatId });
        } else {
          console.log("No existing chat found, creating a new one...");

          const newChat = {
            announcementId,
            advertiserId,
            userId: user.id,
            messages: [],
            timestamp: Date.now(),
          };

          const newChatRef = push(chatRef);
          set(newChatRef, newChat).then(() => {
            console.log(`New chat created with ID: ${newChatRef.key}`);
            navigation.navigate("Chat", { chatId: newChatRef.key });
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  };

  const showDeleteModal = () => {
    setConfirmationTitle(announcement.title);
    setModalDeleteVisible(true);
  };

  const rejectAnnouncementDeletion = () => {
    setModalDeleteVisible(false);
  };

  const confirmAnnouncementDeletion = async () => {
    try {
      if (announcement.id) {
        const folderPath = `announcement-images/${announcement.id}`;

        const folderRef = storageRef(storage, folderPath);

        const folderContents = await listAll(folderRef);
        const deletePromises = folderContents.items.map((fileRef) =>
          deleteObject(fileRef)
        );

        await Promise.all(deletePromises);
        console.log(`All files in folder ${folderPath} have been deleted.`);
      }

      const announcementRef = ref(db, `announcements/${announcement.id}`);
      await remove(announcementRef);

      setModalDeleteVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      Alert.alert(
        "Error",
        "Could not delete the announcement. Please try again."
      );
      setModalDeleteVisible(false);
    }
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View style={[mainStyles.container, mainStyles.scrollBase]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[mainStyles.scrollBase, { marginTop: 20 }]}
        >
          <View style={styles.annSwiperContainer}>
            <Swiper style={styles.annSwiper} showsButtons={false}>
              {announcement &&
                announcement?.images?.map((image, index) => (
                  <TouchableOpacity
                    key={"SwiperImage_" + index}
                    style={styles.annSlide}
                    onPress={() => openImage(index)}
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
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
                <Text style={styles.annOwnerText}>
                  {t("announcement.yourAd")}
                </Text>
                <View style={styles.annOwnerButtons}>
                  <TouchableOpacity
                    style={styles.annOwnerEditButton}
                    onPress={() => {
                      console.log("Edit announcement");
                      navigation.navigate("CreateAnnouncementView", {
                        id: announcement.id,
                      });
                    }}
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
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
                    onPress={showDeleteModal}
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
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
                {t("announcement.category")}:
              </Text>
              <View style={styles.annCategory}>
                <Icon
                  name={announcement.category.subcategoryIcon}
                  height={22}
                  width={22}
                  fillColor={globalStyles.textOnPrimaryColor}
                />
                <Text style={styles.annCategoryText}>
                  {t(
                    `subcategoryNames.${announcement.category.subcategoryIcon}`
                  )}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.annPriceWithRating}>
            <Text style={styles.annPrice}>
              ${announcement.pricePerDay} / {t("announcement.day")}
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
              <Text style={styles.annSizeLabel}>{t("announcement.size")}:</Text>
              <Text style={styles.annSizeValue}>{announcement.size}</Text>
            </View>
            <View style={styles.annCondition}>
              <Text style={styles.annConditionLabel}>
                {t("announcement.condition")}:
              </Text>
              <Text style={styles.annConditionValue}>
                {announcement.condition}
              </Text>
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.annDescription}>
            <Text style={styles.annDescriptionLabel}>
              {t("announcement.description")}:
            </Text>
            <Text style={styles.annDescriptionValue}>
              {announcement.description}
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.advertiser}>
            <Text style={styles.advLabel}>{t("announcement.advertiser")}:</Text>
            <View style={styles.advImageWithData}>
              <Image
                source={{ uri: advertiserAvatar }}
                style={styles.advImage}
              />
              <View style={styles.advData}>
                <TouchableOpacity
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
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
              {`${t("announcement.advertiserInfoOn")} `}
              <Text style={styles.advRentAndWear}>{` ${t(
                "brand.name"
              )} `}</Text>
              {` ${t("announcement.advertiserInfoFrom")} `}
              {displayedAdvertiserRegistrationDate}.
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.opinions}>
            <Text style={styles.opinLabel}>{t("announcement.opinions")}:</Text>
            <TouchableOpacity
              style={styles.opinWriteOpinionButton}
              activeOpacity={globalStyles.ACTIVE_OPACITY}
              onPress={() => console.log("Write your opinion.")}
            >
              <Text style={styles.opinWriteOpinionButtonText}>
                {t("announcement.writeOpinion")}
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
              activeOpacity={globalStyles.ACTIVE_OPACITY}
              onPress={() => {
                if (user?.email !== "guest@example.com") {
                  onChatPress(announcement);
                } else {
                  Alert.alert(
                    t("verification.requiredTitle"),
                    t("verification.requiredMessage")
                  );
                }
              }}
            >
              <Text style={styles.annBookRentButtonText}>
                {t("announcement.sendMessage")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.annBookRentButton}
              activeOpacity={globalStyles.ACTIVE_OPACITY}
              onPress={() => {
                if (user?.isVerified) {
                  navigation.navigate("RentItNowView", {
                    id: id,
                    title: announcement.title,
                  });
                } else {
                  Alert.alert(
                    t("verification.requiredTitle"),
                    t("verification.requiredMessage")
                  );
                }
              }}
            >
              <Text style={styles.annBookRentButtonText}>
                {t("announcement.rentNow")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalDeleteVisible}
        onRequestClose={rejectAnnouncementDeletion}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalCardMini}>
            <Text style={styles.modalFormTitle}>
              {`${t("announcement.confirmDeleteTitle")}`}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={confirmAnnouncementDeletion}
              >
                <Text style={styles.modalButtonText}>{`${t(
                  "universal.deleteBtn"
                )}`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalRejectButton}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
                onPress={rejectAnnouncementDeletion}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: globalStyles.redColor },
                  ]}
                >
                  {`${t("universal.cancelBtn")}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AnnouncementView;
