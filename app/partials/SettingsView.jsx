import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useForm, Controller } from "react-hook-form";
import { Divider } from "react-native-elements";

import { ref, onValue, update } from "firebase/database";
import { auth, db } from "../../firebase.config";

import { fetchImgURL } from "../utils/fetchSVG";

import { styles as mainStyles } from "../utils/style";
import { styles } from "../styles/SettingsViewStyles";
import InputWithLabel from "../components/InputWithLabel";

import { useUser } from "../components/UserProvider";
import { useTranslation } from "react-i18next";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebase.config";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SettingsView() {
  const { t } = useTranslation();
  const { user, setUser } = useUser();
  const [userProfileImg, setUserProfileImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // useEffect(() => {
  //   if (!user) return;

  //   const usersRef = ref(db, "users");
  //   const unsubscribe = onValue(usersRef, (snapshot) => {
  //     const data = snapshot.val();
  //     if (data) {
  //       const currentUserEntry = Object.entries(data).find(
  //         ([key, userData]) => userData.email === user.email
  //       );

  //       if (currentUserEntry) {
  //         const [key, userData] = currentUserEntry;
  //         setUser({ ...userData, id: key }); // Dodaj klucz jako "id"
  //       } else {
  //         setUser(null);
  //       }
  //     } else {
  //       setUser(null);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [user]);

  useEffect(() => {
    async function loadUrl() {
      if (user && user.id != null) {
        try {
          const url = await fetchImgURL(
            `user-avatars/${user.id}/${user.id}.jpg`
          );
          setUserProfileImg(url);
        } catch (error) {
          setUserProfileImg(
            "https://firebasestorage.googleapis.com/v0/b/rent-clothes-253cf.firebasestorage.app/o/user-avatars%2Fdefault-profile.png?alt=media&token=13058d8e-2f04-474d-baef-26196d7cd979"
          );
        }
      }
    }
    loadUrl();
  }, [user.id]);

  // Funkcja do zapisu zmodyfikowanego użytkownika do bazy danych
  const saveUser = (currentUser, fieldName) => {
    const userRef = ref(db, `users/${currentUser.id}`); // Ustaw ścieżkę do konkretnego użytkownika za pomocą jego ID
    update(userRef, {
      [fieldName]: currentUser[fieldName], // Aktualizuj pole
    })
      .then(() => {
        console.log(`User ${fieldName} updated successfully!`);
      })
      .catch((error) => {
        console.error(`Error updating user ${fieldName}: `, error);
      });
  };

  const uploadImage = async (uri, userId) => {
    if (!uri) return null;

    const response = await fetch(uri);
    const blob = await response.blob();
    const filePath = `user-avatars/${userId}/${userId}.jpg`;

    const imgRef = storageRef(storage, filePath);
    await uploadBytes(imgRef, blob);

    const url = await getDownloadURL(imgRef);
    return url;
  };

  const handleEditPicture = async () => {
    try {
      // Prośba o uprawnienia
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== "granted") {
        Alert.alert(t("settings.permissionToLibraryFail"));
        return;
      }

      // Wybierz obraz
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsLoading(true);
        const uploadedUrl = await uploadImage(result.assets[0].uri, user.id);

        if (uploadedUrl) {
          // Zapisz URL do bazy danych
          saveUser({ ...user, profileImg: uploadedUrl }, "profileImg");
          setUserProfileImg(uploadedUrl); // Zaktualizuj lokalny stan
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Name form
  const {
    control: controlName,
    handleSubmit: handleSubmitName,
    reset: resetName,
    formState: { errors: errorsName },
  } = useForm();

  const [editableName, setEditableName] = useState(false);
  const [nameTextInputStyle, setNameTextInputStyle] = useState([
    styles.textInput,
    styles.textInputBlocked,
  ]);
  const [nameButtonsStyle, setNameButtonsStyle] = useState(
    styles.buttonsHidden
  );
  const editName = () => {
    setEditableName(true);
    setNameTextInputStyle(styles.textInput);
    setNameButtonsStyle(styles.SaveCancelBtns);

    resetSurname();
    setEditableSurname(false);
    setSurnameTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setSurnameButtonsStyle(styles.buttonsHidden);
  };

  const onSubmitName = (data) => {
    user.name = data.name;
    saveUser(user, "name");

    setEditableName(false);
    setNameTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setNameButtonsStyle(styles.buttonsHidden);
  };

  const onCancelName = () => {
    resetName();
    setEditableName(false);
    setNameTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setNameButtonsStyle(styles.buttonsHidden);
  };

  // Surname form
  const {
    control: controlSurname,
    handleSubmit: handleSubmitSurname,
    reset: resetSurname,
    formState: { errors: errorsSurname },
  } = useForm();

  const [editableSurname, setEditableSurname] = useState(false);
  const [surnameTextInputStyle, setSurnameTextInputStyle] = useState([
    styles.textInput,
    styles.textInputBlocked,
  ]);
  const [surnameButtonsStyle, setSurnameButtonsStyle] = useState(
    styles.buttonsHidden
  );
  const editSurname = () => {
    setEditableSurname(true);
    setSurnameTextInputStyle(styles.textInput);
    setSurnameButtonsStyle(styles.SaveCancelBtns);

    resetName();
    setEditableName(false);
    setNameTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setNameButtonsStyle(styles.buttonsHidden);
  };

  const onSubmitSurname = (data) => {
    user.surname = data.surname;
    saveUser(user, "surname");

    setEditableSurname(false);
    setSurnameTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setSurnameButtonsStyle(styles.buttonsHidden);
  };

  const onCancelSurname = () => {
    resetSurname();
    setEditableSurname(false);
    setSurnameTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setSurnameButtonsStyle(styles.buttonsHidden);
  };

  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword },
  } = useForm();

  const [editablePassword, setEditablePassword] = useState(false);
  const [passwordTextInputStyle, setPasswordTextInputStyle] = useState([
    styles.textInput,
    styles.textInputBlocked,
  ]);
  const [passwordButtonsStyle, setPasswordButtonsStyle] = useState(
    styles.buttonsHidden
  );

  const editPassword = () => {
    setEditablePassword(true);
    setPasswordTextInputStyle(styles.textInput);
    setPasswordButtonsStyle(styles.SaveCancelBtns);

    resetName();
    setEditableName(false);
    setNameTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setNameButtonsStyle(styles.buttonsHidden);

    resetSurname();
    setEditableSurname(false);
    setSurnameTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setSurnameButtonsStyle(styles.buttonsHidden);
  };

  const onSubmitPassword = async (data) => {
    try {
      // Reauthenticate the user (Firebase requires reauthentication to change sensitive data like passwords)
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Change the password
      await updatePassword(auth.currentUser, data.newPassword);

      console.log("Password updated successfully!");
      Alert.alert(t("settings.permissionToLibraryFail"));

      setEditablePassword(false);
      setPasswordTextInputStyle([styles.textInput, styles.textInputBlocked]);
      setPasswordButtonsStyle(styles.buttonsHidden);
    } catch (error) {
      console.error("Error updating password: ", error);
      Alert.alert(`${t("settings.permissionToLibraryFail")}: ${error.message}`);
    }
  };

  const onCancelPassword = () => {
    resetPassword();
    setEditablePassword(false);
    setPasswordTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setPasswordButtonsStyle(styles.buttonsHidden);
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <View
        style={[
          mainStyles.container,
          { paddingTop: 20, alignItems: "stretch" },
        ]}
      >
        <View style={styles.mainSection}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={mainStyles.scrollBase}
          >
            {/* Profile image */}
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: userProfileImg,
                }}
                style={styles.userProfileImg}
              />
              <TouchableOpacity activeOpacity={0.6} onPress={handleEditPicture}>
                <Text style={styles.imageText}>
                  {t("settings.editPictureText")}
                </Text>
              </TouchableOpacity>
            </View>

            <Divider style={styles.divider} />

            <View style={{ gap: 20 }}>
              {/* Name form */}
              <View style={{ gap: 25 }}>
                <InputWithLabel
                  control={controlName}
                  name={"name"}
                  placeholder={t("settings.namePlaceholder")}
                  errors={errorsName}
                  editable={editableName}
                  onEdit={editName}
                  onSubmit={handleSubmitName(onSubmitName)}
                  onCancel={onCancelName}
                  inputStyle={nameTextInputStyle}
                  buttonStyle={nameButtonsStyle}
                  label={`${t("settings.nameLabel")}:`}
                  validationRules={{
                    required: `${t("settings.nameValidationR")}`,
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$/,
                      message: `${t("settings.nameValidationP")}`,
                    },
                  }}
                  value={user.name}
                  defaultValue={user.name}
                  isWithEditBtn={true}
                />

                <View style={[nameButtonsStyle, { marginBottom: 20 }]}>
                  <TouchableOpacity
                    style={styles.buttonSave}
                    activeOpacity={0.8}
                    onPress={handleSubmitName(onSubmitName)}
                  >
                    <Text style={styles.buttonText}>
                      {t("universal.saveBtn")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonCancel}
                    activeOpacity={0.8}
                    onPress={onCancelName}
                  >
                    <Text style={styles.buttonText}>
                      {t("universal.cancelBtn")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Surname form */}
              <View style={{ gap: 25 }}>
                <InputWithLabel
                  control={controlSurname}
                  name={"surname"}
                  placeholder={t("settings.surnamePlaceholder")}
                  errors={errorsSurname}
                  editable={editableSurname}
                  onEdit={editSurname}
                  onSubmit={handleSubmitSurname(onSubmitSurname)}
                  onCancel={onCancelSurname}
                  inputStyle={surnameTextInputStyle}
                  buttonStyle={surnameButtonsStyle}
                  label={`${t("settings.surnameLabel")}:`}
                  validationRules={{
                    required: `${t("settings.surnameValidationR")}`,
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?(?:-[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?)?$/,
                      message: `${t("settings.surnameValidationP")}`,
                    },
                  }}
                  value={user.surname}
                  defaultValue={user.surname}
                  isWithEditBtn={true}
                />

                <View style={[surnameButtonsStyle, { marginBottom: 20 }]}>
                  <TouchableOpacity
                    style={styles.buttonSave}
                    activeOpacity={0.8}
                    onPress={handleSubmitSurname(onSubmitSurname)}
                  >
                    <Text style={styles.buttonText}>
                      {t("universal.saveBtn")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonCancel}
                    activeOpacity={0.8}
                    onPress={onCancelSurname}
                  >
                    <Text style={styles.buttonText}>
                      {t("universal.cancelBtn")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ gap: 25 }}>
                {/* Pole do wpisania obecnego hasła */}
                <InputWithLabel
                  control={controlPassword}
                  name={"currentPassword"}
                  placeholder={t("settings.passCurrPlaceholder")}
                  errors={errorsPassword}
                  editable={editablePassword}
                  onEdit={editPassword}
                  onSubmit={handleSubmitPassword(onSubmitPassword)}
                  onCancel={onCancelPassword}
                  inputStyle={passwordTextInputStyle}
                  buttonStyle={passwordButtonsStyle}
                  label={`${t("settings.passCurrLabel")}:`}
                  validationRules={{
                    required: `${t("settings.passValidationR")}`,
                  }}
                  value=""
                  isWithEditBtn={true}
                  secureTextEntry={true}
                />

                {/* Pole do wpisania nowego hasła */}
                <InputWithLabel
                  control={controlPassword}
                  name={"newPassword"}
                  placeholder={t("settings.passNewPlaceholder")}
                  errors={errorsPassword}
                  editable={editablePassword}
                  inputStyle={passwordTextInputStyle}
                  buttonStyle={passwordButtonsStyle}
                  label={`${t("settings.passNewLabel")}:`}
                  validationRules={{
                    required: `${t("settings.passValidationR")}`,
                    minLength: {
                      value: 6,
                      message: `${t("settings.passValidationP")}`,
                    },
                  }}
                  value=""
                  secureTextEntry={true}
                />

                {/* Przyciski zapisz i anuluj */}
                <View style={[passwordButtonsStyle, { marginBottom: 20 }]}>
                  <TouchableOpacity
                    style={styles.buttonSave}
                    activeOpacity={0.8}
                    onPress={handleSubmitPassword(onSubmitPassword)}
                  >
                    <Text style={styles.buttonText}>
                      {t("universal.saveBtn")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonCancel}
                    activeOpacity={0.8}
                    onPress={onCancelPassword}
                  >
                    <Text style={styles.buttonText}>
                      {t("universal.cancelBtn")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
