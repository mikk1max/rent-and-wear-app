import React, { useState, useEffect, useRef } from "react";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
import { useTranslation } from "react-i18next";

const CreateAnnouncementView = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user, setUser } = useUser();

  // const [image, setImage] = useState<string | null >(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState();
  const [image, setImage] = useState();
  const [images, setImages] = useState([]);
  const [squashedSubcategories, setSquashedSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState();
  const [isCategoryListVisible, setCategoryListVisible] = useState(false);

  const scrollViewRef = useRef(null);

  // Formularz
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Pobieranie bieżącego użytkownika
  useEffect(() => {
    if (!user) return;

    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        console.error("No users data found");
        return;
      }

      const currentUserEntry = Object.entries(data).find(
        ([key, userData]) => userData?.email === user?.email
      );

      if (currentUserEntry) {
        const [key, userData] = currentUserEntry;
        setUser({ ...userData, id: key });
      } else {
        console.warn("User not found in the database");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Pobieranie kategorii
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const categoriesRef = ref(db, "categories");
        const snapshot = await get(categoriesRef);

        if (snapshot.exists()) {
          const rawData = snapshot.val();

          // Преобразование данных в плоский массив подкатегорий
          const allSubcategories = Object.values(rawData).flatMap((category) =>
            Object.values(category.subcategories).map((subcategory) => ({
              subcategoryName: subcategory?.subcategoryName,
              subcategoryIcon: subcategory?.subcategoryIcon,
            }))
          );

          setSquashedSubcategories(allSubcategories);
        } else {
          console.error("No data available.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  // console.log(squashedSubcategories);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      // console.log(image);
      setImages([...images, result.assets[0].uri]);
    }
  };

  const deleteImage = (img) => {
    setImages(images.filter((item) => item != img));
  };

  const uploadImagesToStorage = async (announcementId, images) => {
    const storage = getStorage();
    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const imageUri = images[i];
      const fileName = `${announcementId}/${i}.jpg`; // Название файла с индексом
      const imageRef = storageRef(storage, `announcement-images/${fileName}`);

      // Загружаем изображение
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);

      // Получаем URL после загрузки
      const imageUrl = await getDownloadURL(imageRef);
      imageUrls.push(imageUrl);
    }

    return imageUrls; // Возвращаем массив URL-ов изображений
  };

  // Функция для добавления объявления в Realtime Database
  const createAnnouncementInDatabase = async (announcementId, announcement) => {
    const announcementRef = ref(db, "announcements/" + announcementId);
    await set(announcementRef, announcement);
  };

  const onSubmit = async (data) => {
    if (!category || !category.subcategoryName || !category.subcategoryIcon) {
      setCategoryError("Please select a valid category");
      return;
    } else {
      setCategoryError(null);
      let announcement = {
        advertiserId: user.id,
        title: data.title || "No title",
        rating: 0,
        category: category || {
          subcategoryName: "Unknown",
          subcategoryIcon: "default",
        },
        description: data.description,
        publicationDate: Date.now(),
        pricePerDay: +data.price || 0,
        size: data.size || "",
        condition: data.condition || "Unknown",
        images: [],
        // status: {
        //   code: 0,
        //   messege: "Available for rent",
        // },
        rentalData: {
          borrowerId: "",
          startDate: null,
          endDate: null,
          daysInRent: null,
          amount: null,
        },
        reservationData: [
          {
            borrowerId: "",
            startDate: null,
            endDate: null,
            daysInRent: null,
            amount: null,
          },
        ],
        opinions: [],
      };
      let announcementId = announcement.publicationDate;

      // 1. Создание записи в Realtime Database
      await createAnnouncementInDatabase(announcementId, announcement);

      // 2. Загрузка изображений в Storage и получение их URL
      const imageUrls = await uploadImagesToStorage(announcementId, images);

      // Обновляем объект объявления с URL-ами изображений
      announcement.images = imageUrls;

      // 3. Обновляем запись в базе данных с добавленными изображениями
      await createAnnouncementInDatabase(announcementId, announcement);

      console.log(announcement);
      navigation.goBack();
    }
  };

  const toggleCategoryList = () =>
    setCategoryListVisible(!isCategoryListVisible);

  const selectCategory = (chosenCategory) => {
    setCategory(chosenCategory);
    toggleCategoryList();
  };

  const iconOptions = {
    width: 22,
    height: 22,
    fillColor: globalStyles.primaryColor,
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View
        style={[
          mainStyles.container,
          mainStyles.scrollBase,
          { paddingTop: 20 },
        ]}
      >
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={mainStyles.scrollBase}
        >
          <View style={styles.imagesContainer}>
            <View style={styles.imagesList}>
              {images &&
                images.map((img) => (
                  <TouchableOpacity
                    key={"CreateAnnouncement_Image_" + img}
                    style={styles.deleteImageButton}
                    onPress={() => deleteImage(img)}
                  >
                    <Image source={{ uri: img }} style={styles.image} />
                  </TouchableOpacity>
                ))}
              {images.length < 6 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={() => pickImage()}
                >
                  <Icon name="plus" width={80} height={80} />
                </TouchableOpacity>
              )}
            </View>
            {images.length == 0 && (
              <Text style={styles.imagesLabel}>
                {t("createAnnouncement.imagesLabel")}
              </Text>
            )}
          </View>
          <View style={styles.inputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {`${t("createAnnouncement.annTitleLabel")}:`}
              </Text>
              {errors.title && (
                <Text style={styles.textInputError}>
                  {errors.title.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: t("createAnnouncement.titleRequired"),
                  pattern: {
                    value: /^.{14,70}$/,
                    message: t("createAnnouncement.titlePattern"),
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={t("createAnnouncement.titlePlaceholder")}
                    placeholderTextColor={"gray"}
                    value={value}
                    maxLength={70}
                    autoCapitalize="sentences"
                    autoComplete="off"
                    inputMode="text"
                    editable={true}
                    onFocus={(event) => {
                      scrollViewRef.current?.scrollToFocusedInput(event.target);
                    }}
                  />
                )}
                name="title"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {t("createAnnouncement.categoryLabel")}:
              </Text>
              {categoryError && (
                <Text style={styles.textInputError}>{categoryError}</Text>
              )}
              <TouchableOpacity
                style={styles.categoryListButton}
                onPress={toggleCategoryList}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <View style={styles.categoryListButtonTextWithIcon}>
                  {category && (
                    <Icon
                      name={category?.subcategoryIcon}
                      {...iconOptions}
                      fillColor={globalStyles.textOnPrimaryColor}
                    />
                  )}
                  <Text style={styles.categoryListButtonText}>
                    {category
                      ? category?.subcategoryName
                      : t("createAnnouncement.chooseCategory")}
                  </Text>
                </View>

                <Icon
                  name={isCategoryListVisible ? "arrow-up" : "arrow-down"}
                  width={22}
                  height={22}
                />
              </TouchableOpacity>

              {isCategoryListVisible && (
                <View style={styles.categoryList}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    style={styles.categoryListScroll}
                    showsVerticalScrollIndicator={true}
                  >
                    {squashedSubcategories.map((subcategoryItem) => (
                      <TouchableOpacity
                        key={
                          "CreateAnnouncementView_CategoryList_" +
                          subcategoryItem?.subcategoryIcon
                        }
                        style={
                          subcategoryItem ===
                          squashedSubcategories[
                            squashedSubcategories.length - 1
                          ]
                            ? styles.categoryListItemWithoutBorder
                            : styles.categoryListItemWithBorder
                        }
                        onPress={() => selectCategory(subcategoryItem)}
                        activeOpacity={1}
                      >
                        <Icon
                          name={subcategoryItem?.subcategoryIcon}
                          {...iconOptions}
                        />
                        <Text style={styles.categoryListItemText}>
                          {t(`subcategoryNames.${subcategoryItem?.subcategoryIcon}`)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {t("createAnnouncement.sizeLabel")}:
              </Text>
              {errors.size && (
                <Text style={styles.textInputError}>{errors.size.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: t("createAnnouncement.sizeRequired"),
                  pattern: {
                    value: /^.{1,40}$/,
                    message: t("createAnnouncement.sizePattern"),
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={t("createAnnouncement.sizePlaceholder")}
                    placeholderTextColor={"gray"}
                    value={value}
                    maxLength={40}
                    autoCapitalize="sentences"
                    autoComplete="off"
                    inputMode="text"
                    editable={true}
                  />
                )}
                name="size"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {t("createAnnouncement.conditionLabel")}:
              </Text>
              {errors.condition && (
                <Text style={styles.textInputError}>
                  {errors.condition.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: t("createAnnouncement.conditionRequired"),
                  pattern: {
                    value: /^.{3,40}$/,
                    message: t("createAnnouncement.conditionPattern"),
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={t("createAnnouncement.conditionPlaceholder")}
                    placeholderTextColor={"gray"}
                    value={value}
                    maxLength={40}
                    autoCapitalize="sentences"
                    autoComplete="off"
                    inputMode="text"
                    editable={true}
                  />
                )}
                name="condition"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {t("createAnnouncement.priceLabel")}:
              </Text>
              {errors.price && (
                <Text style={styles.textInputError}>
                  {errors.price.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: t("createAnnouncement.priceRequired"),
                  pattern: {
                    value: /^(?!0)\d+(\.\d{1,2})?$/,
                    message: t("createAnnouncement.pricePattern"),
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={t("createAnnouncement.pricePlaceholder")}
                    placeholderTextColor={"gray"}
                    value={value}
                    maxLength={10}
                    autoCapitalize="none"
                    autoComplete="off"
                    inputMode="decimal"
                    editable={true}
                  />
                )}
                name="price"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {t("createAnnouncement.descriptionLabel")}:
              </Text>
              {errors.description && (
                <Text style={styles.textInputError}>
                  {errors.description.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: t("createAnnouncement.descriptionRequired"),
                  pattern: {
                    value: /^.{40,9000}$/s,
                    message: t("createAnnouncement.descriptionPattern"),
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.textInput, { height: "auto" }]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={t("createAnnouncement.descriptionPlaceholder")}
                    placeholderTextColor={"gray"}
                    value={value}
                    maxLength={9000}
                    autoCapitalize="sentences"
                    autoComplete="off"
                    inputMode="text"
                    multiline={true}
                    editable={true}
                  />
                )}
                name="description"
              />
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.createText}>
                {t("createAnnouncement.createButton")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>
                {t("createAnnouncement.cancelButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateAnnouncementView;

const styles = StyleSheet.create({
  divider: {
    marginVertical: 10,
    width: "100%",
    height: 2,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  imagesContainer: {
    width: "100%",
    height: "auto",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.secondaryColor,
  },

  imagesLabel: {
    width: "50%",
    alignSelf: "center",
    textAlign: "center",
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
    marginTop: 10
  },

  imagesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignContent: "center",
    gap: 10,
  },

  deleteImageButton: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    justifyContent: "center",
    alignItems: "center",
  },

  addImageIcon: {
    // backgroundColor: "red",
  },

  inputs: {
    width: "100%",
    height: "auto",
    // margin: 10,
    marginVertical: 10,
    gap: 10,
    // backgroundColor: "lightyellow"
  },

  inputContainer: {
    // flexDirection: "column",
    // flexWrap: "wrap",
    width: "100%",
    height: "auto",
    gap: 5,
  },

  inputLabel: {
    fontFamily: "WorkSans_900Black",
    fontSize: 18,
    color: globalStyles.textOnSecondaryColor,
  },

  textInputError: {
    // width: "100%",
    // height: "auto",
    // marginLeft: "5%",
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 30,
    marginBottom: -30,
    borderRadius: globalStyles.BORDER_RADIUS,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.redColor,
    backgroundColor: "lightpink",
  },

  textInput: {
    // flexWrap: "wrap",
    // width: "100%",
    height: 50,
    // marginLeft: "5%",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
    backgroundColor: globalStyles.secondaryColor,
  },

  categoryListButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    padding: 10,
    // marginLeft: 1, // ?????????????
    backgroundColor: globalStyles.primaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
  },

  categoryListButtonTextWithIcon: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },

  categoryListButtonText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.textOnPrimaryColor,
  },

  categoryListScroll: {
    // height: "25%",
    // flex: 1,
    // overflow: "hidden",
  },

  categoryList: {
    zIndex: -1,
    marginTop: -20,
    padding: 10,
    paddingTop: 25,
    // gap: 5,
    height: 200,
    // flex: 1,
    // overflow: "hidden",
    backgroundColor: globalStyles.secondaryColor,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
  },

  categoryListItemWithBorder: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    gap: 10,
    paddingBottom: 7,
    marginBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.textOnSecondaryColor,
  },

  categoryListItemWithoutBorder: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    gap: 10,
  },

  categoryListItemText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: globalStyles.primaryColor,
  },

  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
    marginTop: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  createButton: {
    width: "50%",
    height: "auto",
    padding: 10,
    justifyContent: "center",
    // borderRadius: globalStyles.BORDER_RADIUS,
    borderTopLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.primaryColor,
  },

  createText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: globalStyles.textOnPrimaryColor,
  },

  cancelButton: {
    width: "50%",
    height: "auto",
    padding: 10,
    justifyContent: "center",
    borderTopRightRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
    // borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.redColor,
  },

  cancelText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: globalStyles.textOnRedColor,
  },
});
