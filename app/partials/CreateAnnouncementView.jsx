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
import { useNavigation } from "@react-navigation/native";

import { globalStyles, styles as mainStyles } from "../utils/style";
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
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  remove as sRemove,
  deleteObject,
} from "firebase/storage";

import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import Icon from "../components/Icon";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";

const CreateAnnouncementView = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user } = useUser();
  const { id } = route.params || {};
  const isEditMode = !!id;

  // const [image, setImage] = useState<string | null >(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState();
  const [image, setImage] = useState();
  const [images, setImages] = useState([]);
  const [squashedSubcategories, setSquashedSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState();
  const [isCategoryListVisible, setCategoryListVisible] = useState(false);
  const [announcement, setAnnouncement] = useState(null);

  const scrollViewRef = useRef(null);

  // Formularz
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isEditMode) {
      const fetchAnnouncement = async () => {
        setLoading(true);
        const announcementRef = ref(db, `announcements/${id}`);
        const snapshot = await get(announcementRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAnnouncement(data);
          setImages(data.images || []);

          // Pre-fill form fields
          setValue("title", data.title || "");
          setValue("description", data.description || "");
          setValue("price", data.pricePerDay?.toString() || "0");
          setValue("condition", data.condition || "Unknown");
          setValue("size", data.size || "");
          setCategory(data.category || {});
        }
        setLoading(false);
      };

      fetchAnnouncement();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

  // Pobieranie kategorii
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
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

    // console.log(result);

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const deleteImageFromStorage = async (announcementId, imageUrl) => {
    try {
      // console.log("Image URL:", imageUrl);
  
      if (!imageUrl) {
        console.error("Invalid image URL:", imageUrl);
        return;
      }
  
      // Decode the URL to get the correct file path
      const decodedUrl = decodeURIComponent(imageUrl); // Decode URL to get correct path
      // console.log("Decoded URL:", decodedUrl);
  
      // Extract the file name after the last '/'
      const pathSegments = decodedUrl.split('/');
      const fileName = pathSegments[pathSegments.length - 1].split('?')[0]; // Remove query params
      // console.log("Extracted file name:", fileName);
  
      if (!fileName) {
        console.error("Unable to extract file name from URL:", decodedUrl);
        return;
      }
  
      // Correct path for deletion
      const imageRef = storageRef(
        storage,
        `announcement-images/${announcementId}/${fileName}`  // Correct path without URL encoding
      );
      // console.log("Image reference:", imageRef);
  
      await deleteObject(imageRef);
      // console.log("Image removed successfully:", fileName);
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const deleteImage = (img) => {
    const imageUrl = images.find((image) => image === img);
    // console.log("img -> " + img);
    
    if (imageUrl) {
      const announcementId = id; // Ensure this is the correct announcement ID
      setImages(images.filter((item) => item !== img));
      deleteImageFromStorage(announcementId, imageUrl); // Pass correct URL to delete function
    }
  };

  const handleSave = async (data) => {
    setLoading(true);

    try {
      // Upload images to Firebase Storage and get their URLs
      const imageUrls = await uploadImagesToStorage(id, images);

      const newAnnouncement = {
        ...announcement,
        ...data,
        images: imageUrls, // Use the URLs from Firebase Storage here
        category,
        pricePerDay: parseFloat(data.price),
        advertiserId: user.id,
        publicationDate: isEditMode ? announcement.publicationDate : Date.now(),
      };

      const announcementRef = ref(
        db,
        `announcements/${isEditMode ? id : Date.now()}`
      );

      if (isEditMode) {
        await update(announcementRef, newAnnouncement);
      } else {
        await set(announcementRef, newAnnouncement);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Błąd podczas zapisu ogłoszenia:", error);
      Alert.alert(
        "Błąd",
        "Nie udało się zapisać ogłoszenia. Spróbuj ponownie."
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadImagesToStorage = async (announcementId, images) => {
    const imageUrls = [];
  
    for (let i = 0; i < images.length; i++) {
      const imageUri = images[i];
      const fileName = `${i}.jpg`; // Use a simple file name with the index, no prefix
      const imageRef = storageRef(storage, `announcement-images/${announcementId}/${fileName}`);
  
      try {
        const response = await fetch(imageUri); // Fetch image from the local URI
        const blob = await response.blob(); // Convert to blob
  
        // Determine the MIME type based on the file (you can customize this logic for other types of images)
        const mimeType = 'image/jpeg';  // You can change this to 'image/png' if the images are PNGs, for example
  
        const metadata = {
          contentType: mimeType,  // Specify the MIME type for the image
        };
  
        // Upload the image with the specified metadata
        await uploadBytes(imageRef, blob, metadata); // Upload to Firebase Storage
  
        const imageUrl = await getDownloadURL(imageRef); // Get the download URL
        imageUrls.push(imageUrl); // Store the URL
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  
    return imageUrls; // Return the array of image URLs
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
        rentalData: null,
        reservationData: null,
        opinions: null,
      };
      let announcementId = "ANN_" + announcement.publicationDate;

      await createAnnouncementInDatabase(announcementId, announcement);

      const imageUrls = await uploadImagesToStorage(announcementId, images);
      announcement.images = imageUrls;

      await createAnnouncementInDatabase(announcementId, announcement);
      // console.log(announcement);
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
                    activeOpacity={globalStyles.ACTIVE_OPACITY}
                  >
                    <Image source={{ uri: img }} style={styles.image} />
                  </TouchableOpacity>
                ))}
              {images.length < 6 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={() => pickImage()}
                  activeOpacity={globalStyles.ACTIVE_OPACITY}
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
                      ? t(`subcategoryNames.${category?.subcategoryIcon}`)
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
                        activeOpacity={globalStyles.ACTIVE_OPACITY}
                      >
                        <Icon
                          name={subcategoryItem?.subcategoryIcon}
                          {...iconOptions}
                        />
                        <Text style={styles.categoryListItemText}>
                          {t(
                            `subcategoryNames.${subcategoryItem?.subcategoryIcon}`
                          )}
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
              onPress={
                isEditMode ? handleSubmit(handleSave) : handleSubmit(onSubmit)
              }
              activeOpacity={globalStyles.ACTIVE_OPACITY}
            >
              <Text style={styles.createText}>
                {t("createAnnouncement.createButton")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={globalStyles.ACTIVE_OPACITY}
            >
              <Text style={styles.cancelText}>
                {t("createAnnouncement.cancelButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
      {loading && (
        <View style={styles.loaderOverlay}>
          <Loader/>
        </View>
      )}
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
    marginTop: 10,
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

  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background with opacity
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
