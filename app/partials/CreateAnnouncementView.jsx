import React, { useState, useEffect } from "react";
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

const CreateAnnouncementView = () => {
  const navigation = useNavigation();

  // const [image, setImage] = useState<string | null >(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState();
  const [image, setImage] = useState();
  const [images, setImages] = useState([]);
  const [squashedSubcategories, setSquashedSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState();
  const [isCategoryListVisible, setCategoryListVisible] = useState(false);

  // Formularz
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Pobieranie bieżącego użytkownika
  const { user, setUser } = useUser();
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
              subcategoryName: subcategory.subcategoryName,
              subcategoryIcon: subcategory.subcategoryIcon,
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
    if (category === "") setCategoryError("Category is required!");
    else {
      setCategoryError(null);
      let announcement = {
        advertiserId: user.id,
        title: data.title,
        rating: 0,
        category: category,
        description: data.description,
        publicationDate: Date.now(),
        pricePerDay: data.price,
        size: data.price,
        condition: data.condition,
        status: {
          code: 0,
          messege: "Available for rent",
        },
        rentalData: {
          borrowerId: "",
          dateFrom: -1,
          dateTo: -1,
          daysInRent: -1,
          amount: -1,
        },
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
      <View style={[mainStyles.container, mainStyles.scrollBase]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          // style={mainStyles.scrollBase}
        >
          <View style={styles.imagesContainer}>
            <View style={styles.imagesList}>
              {images &&
                images.map((img) => (
                  <TouchableOpacity
                    style={styles.deleteImageButton}
                    // onPress={() => console.log("Delete " + img)}
                    onPress={() => deleteImage(img)}
                  >
                    <Image
                      key={"CreateAnnouncement_Image_" + img}
                      source={{ uri: img }}
                      style={styles.image}
                    />
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
              <Text style={styles.imagesLabel}>Add images of your product</Text>
            )}
          </View>
          <View style={styles.inputs}>
            {/* Title */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Announcement title:</Text>
              {errors.title && (
                <Text style={styles.textInputError}>
                  {errors.title.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Title is required!",
                  pattern: {
                    value: /^.{14,70}$/,
                    message: "Min 14 and max 70 characters.",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="e.g. Black underpants with good price"
                    // placeholderTextColor={globalStyles.textOnAccentColor}
                    value={value}
                    maxLength={70}
                    autoCapitalize="sentences"
                    autoComplete="off"
                    inputMode="text"
                    editable={true}
                  />
                )}
                name="title"
              />
            </View>

            {/* Category */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category:</Text>
              {categoryError && (
                <Text style={styles.textInputError}>{categoryError}</Text>
              )}
              <TouchableOpacity
                style={styles.categoryListButton}
                onPress={toggleCategoryList}
              >
                <View style={styles.categoryListButtonTextWithIcon}>
                  {category && (
                    <Icon
                      name={category.subcategoryIcon}
                      {...iconOptions}
                      fillColor={globalStyles.textOnPrimaryColor}
                    />
                  )}
                  <Text style={styles.categoryListButtonText}>
                    {category ? category.subcategoryName : "Choose a category"}
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
                        style={
                          subcategoryItem ===
                          squashedSubcategories[
                            squashedSubcategories.length - 1
                          ]
                            ? styles.categoryListItemWithoutBorder
                            : styles.categoryListItemWithBorder
                        }
                        onPress={() => selectCategory(subcategoryItem)}
                      >
                        <Icon
                          name={subcategoryItem.subcategoryIcon}
                          {...iconOptions}
                        />
                        <Text style={styles.categoryListItemText}>
                          {subcategoryItem.subcategoryName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Size */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Size:</Text>
              {errors.size && (
                <Text style={styles.textInputError}>{errors.size.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Size is required!",
                  pattern: {
                    value: /^.{1,40}$/,
                    message: "Min 1 and max 40 characters.",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="e.g. XS or 123/45"
                    // placeholderTextColor={globalStyles.textOnAccentColor}
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

            {/* Condition */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Condition:</Text>
              {errors.condition && (
                <Text style={styles.textInputError}>
                  {errors.condition.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Condition is required",
                  pattern: {
                    value: /^.{3,40}$/,
                    message: "Min 3 and max 40 characters.",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="e.g. Almost new"
                    // placeholderTextColor={globalStyles.textOnAccentColor}
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

            {/* Price */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Price per day in PLN:</Text>
              {errors.price && (
                <Text style={styles.textInputError}>
                  {errors.price.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Price is required!",
                  pattern: {
                    value: /^(?!0)\d+(\.\d{1,2})?$/,
                    message: "Invalid price format!",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="e.g. 7.99"
                    // placeholderTextColor={globalStyles.textOnAccentColor}
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

            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description:</Text>
              {errors.description && (
                <Text style={styles.textInputError}>
                  {errors.description.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Description is required!",
                  pattern: {
                    value: /^.{40,9000}$/s,
                    message: "Min 40 and max 9000 characters",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.textInput, { height: "auto" }]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Description of your announcement"
                    // placeholderTextColor={globalStyles.textOnAccentColor}
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
              <Text style={styles.createText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateAnnouncementView;

const styles = StyleSheet.create({
  mainSection: {
    flex: 1,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: globalStyles.BORDER_RADIUS,
    padding: 20,
  },

  divider: {
    marginVertical: 10,
    width: "100%",
    height: 2,
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: globalStyles.accentColor,
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
    backgroundColor: globalStyles.accentColor,
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
    color: globalStyles.textOnSecondaryColor,
    backgroundColor: globalStyles.secondaryColor,
  },

  categoryListButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    padding: 10,
    marginLeft: 1, // ?????????????
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
    paddingTop: 20,
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
    paddingBottom: 5,
    marginBottom: 7,
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
    gap: "10%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  createButton: {
    width: "45%",
    height: "auto",
    padding: 10,
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: "green",
  },

  createText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: "white",
  },

  cancelButton: {
    width: "45%",
    height: "auto",
    padding: 10,
    justifyContent: "center",
    borderRadius: globalStyles.BORDER_RADIUS,
    backgroundColor: "red",
  },

  cancelText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: "white",
  },
});
