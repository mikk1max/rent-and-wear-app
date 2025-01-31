import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { globalStyles, styles as mainStyles } from "../utils/style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { ref, get, set } from "firebase/database";
import { db, storage } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import Icon from "../components/Icon";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import { styles } from "../styles/CreateAnnouncementViewStyles";

const CreateAnnouncementView = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user } = useUser();
  const { id } = route.params || {};
  const isEditMode = !!id;

  const [images, setImages] = useState([]);
  const [squashedSubcategories, setSquashedSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState();
  const [isCategoryListVisible, setCategoryListVisible] = useState(false);
  const [announcement, setAnnouncement] = useState(null);

  const scrollViewRef = useRef(null);

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

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const categoriesRef = ref(db, "categories");
        const snapshot = await get(categoriesRef);

        if (snapshot.exists()) {
          const rawData = snapshot.val();

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const deleteImageFromStorage = async (announcementId, imageUrl) => {
    try {
      if (!imageUrl) {
        console.error("Invalid image URL:", imageUrl);
        return;
      }

      const decodedUrl = decodeURIComponent(imageUrl);

      const pathSegments = decodedUrl.split("/");
      const fileName = pathSegments[pathSegments.length - 1].split("?")[0];

      if (!fileName) {
        console.error("Unable to extract file name from URL:", decodedUrl);
        return;
      }

      const imageRef = storageRef(
        storage,
        `announcement-images/${announcementId}/${fileName}`
      );

      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const deleteImage = (img) => {
    const imageUrl = images.find((image) => image === img);

    if (imageUrl) {
      const announcementId = id;
      setImages(images.filter((item) => item !== img));
      deleteImageFromStorage(announcementId, imageUrl);
    }
  };

  const handleSave = async (data) => {
    setLoading(true);

    try {
      const imageUrls = await uploadImagesToStorage(id, images);

      const newAnnouncement = {
        ...announcement,
        ...data,
        images: imageUrls,
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
      const fileName = `${i}.jpg`;
      const imageRef = storageRef(
        storage,
        `announcement-images/${announcementId}/${fileName}`
      );

      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const mimeType = "image/jpeg";

        const metadata = {
          contentType: mimeType,
        };

        await uploadBytes(imageRef, blob, metadata);

        const imageUrl = await getDownloadURL(imageRef);
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    return imageUrls;
  };

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
      <StatusBar backgroundColor={globalStyles.primaryColor} barStyle="light-content" />
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
          <Loader />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CreateAnnouncementView;
