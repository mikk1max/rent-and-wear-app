import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  SafeAreaView,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useForm, Controller } from "react-hook-form";
import { Divider } from "react-native-elements";

import { ref, onValue, update } from "firebase/database";
import { db } from "../../firebase.config";

import { fetchImgURL } from "../utils/fetchSVG";

import { styles as mainStyles } from "../utils/style";
import { styles } from "../styles/SettingsViewStyles";
import InputWithLabel from "../components/InputWithLabel";

import { useUser } from "../components/UserProvider";

export default function SettingsView() {
  // const [user, setUser] = useState([]);
  const { user, setUser } = useUser();
  const [userProfileImg, setUserProfileImg] = useState(null);

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // User
  // useEffect(() => {
  //   const usersRef = ref(db, "users");
  //   onValue(usersRef, (snapshot) => {
  //     const data = snapshot.val();
  //     if (data) {
  //       const usersArray = Object.keys(data).map((key) => ({
  //         ...data[key],
  //       }));
  //       // console.log(usersArray.filter((user) => user.id === 0));

  //       const currentUser = usersArray.find((user) => user.id == 0);
  //       setUser(currentUser || {});
  //     }
  //   });
  // }, []);

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
    async function loadUrl() {
      if (user && user.id != null) {
        try {
          const url = await fetchImgURL(`user-avatars/${user.id}-min.jpg`);
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

    resetEmail();
    setEditableEmail(false);
    setEmailTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setEmailButtonsStyle(styles.buttonsHidden);
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

    resetEmail();
    setEditableEmail(false);
    setEmailTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setEmailButtonsStyle(styles.buttonsHidden);
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

  // E-mail form
  const {
    control: controlEmail,
    handleSubmit: handleSubmitEmail,
    reset: resetEmail,
    formState: { errors: errorsEmail },
  } = useForm();

  const [editableEmail, setEditableEmail] = useState(false);
  const [emailTextInputStyle, setEmailTextInputStyle] = useState([
    styles.textInput,
    styles.textInputBlocked,
  ]);
  const [emailButtonsStyle, setEmailButtonsStyle] = useState(
    styles.buttonsHidden
  );
  const editEmail = () => {
    setEditableEmail(true);
    setEmailTextInputStyle(styles.textInput);
    setEmailButtonsStyle(styles.SaveCancelBtns);

    resetName();
    setEditableName(false);
    setNameTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setNameButtonsStyle(styles.buttonsHidden);

    resetSurname();
    setEditableSurname(false);
    setSurnameTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setSurnameButtonsStyle(styles.buttonsHidden);
  };

  const onSubmitEmail = (data) => {
    user.email = data.email.toLowerCase();
    saveUser(user, "email");

    setEditableEmail(false);
    setEmailTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setEmailButtonsStyle(styles.buttonsHidden);
  };

  const onCancelEmail = () => {
    resetEmail();
    setEditableEmail(false);
    setEmailTextInputStyle([styles.textInput, styles.textInputBlocked]);
    setEmailButtonsStyle(styles.buttonsHidden);
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
          <ScrollView
            showsVerticalScrollIndicator={false}
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
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => console.log("Edit picture")}
              >
                <Text style={styles.imageText}>Edit profile picture</Text>
              </TouchableOpacity>
            </View>

            <Divider style={styles.divider} />

            <View style={{ gap: 20 }}>
              {/* Name form */}
              <View style={{ gap: 25 }}>
                <InputWithLabel
                  control={controlName}
                  name={"name"}
                  placeholder={"Grzegorz"}
                  errors={errorsName}
                  editable={editableName}
                  onEdit={editName}
                  onSubmit={handleSubmitName(onSubmitName)}
                  onCancel={onCancelName}
                  inputStyle={nameTextInputStyle}
                  buttonStyle={nameButtonsStyle}
                  label={"First Name:"}
                  validationRules={{
                    required: "First Name is required",
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$/,
                      message: "Invalid First Name format",
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
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonCancel}
                    activeOpacity={0.8}
                    onPress={onCancelName}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Surname form */}
              <View style={{ gap: 25 }}>
                <InputWithLabel
                  control={controlSurname}
                  name={"surname"}
                  placeholder={"Brzęczyszczykiewicz"}
                  errors={errorsSurname}
                  editable={editableSurname}
                  onEdit={editSurname}
                  onSubmit={handleSubmitSurname(onSubmitSurname)}
                  onCancel={onCancelSurname}
                  inputStyle={surnameTextInputStyle}
                  buttonStyle={surnameButtonsStyle}
                  label={"Last Name:"}
                  validationRules={{
                    required: "Last Name is required",
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?(?:-[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?)?$/,
                      message: "Invalid Last Name format",
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
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonCancel}
                    activeOpacity={0.8}
                    onPress={onCancelSurname}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* E-mail form */}
              <View style={{ gap: 25 }}>
                <InputWithLabel
                  control={controlEmail}
                  name={"email"}
                  placeholder={"example@gmail.com"}
                  errors={errorsEmail}
                  editable={editableEmail}
                  onEdit={editEmail}
                  onSubmit={handleSubmitEmail(onSubmitEmail)}
                  onCancel={onCancelEmail}
                  inputStyle={emailTextInputStyle}
                  buttonStyle={emailButtonsStyle}
                  label={"E-mail:"}
                  validationRules={{
                    required: "E-mail is required",
                    pattern: {
                      value:
                        /^(?!\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
                      message: "Invalid E-mail format",
                    },
                  }}
                  value={user.email}
                  defaultValue={user.email}
                  isWithEditBtn={true}
                />
              </View>

              <View style={[emailButtonsStyle, { marginBottom: 20 }]}>
                <TouchableOpacity
                  style={styles.buttonSave}
                  activeOpacity={0.8}
                  onPress={handleSubmitEmail(onSubmitEmail)}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancel}
                  activeOpacity={0.8}
                  onPress={onSubmitEmail}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>First Name:</Text>
                  <TouchableOpacity
                    style={styles.buttonEdit}
                    activeOpacity={0.8}
                    onPress={editName}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                {errorsName.name && (
                  <View style={styles.textErrorContainer}>
                    <Text style={styles.textError}>
                      {errorsName.name.message}
                    </Text>
                  </View>
                )}
                <Controller
                  control={controlName}
                  rules={{
                    required: "First Name is required",
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$/,
                      message: "Invalid First Name format",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={nameTextInputStyle}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Grzegorz"
                      value={value}
                      defaultValue={user.name}
                      autoCapitalize="words"
                      autoComplete="given-name"
                      inputMode="text"
                      editable={editableName}
                    />
                  )}
                  name="name"
                  // defaultValue={user.name || ""}
                />

                <View style={nameButtonsStyle}>
                  <TouchableOpacity
                    style={styles.buttonSave}
                    activeOpacity={0.8}
                    onPress={handleSubmitName(onSubmitName)}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonCancel}
                    activeOpacity={0.8}
                    onPress={onCancelName}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View> */}

            {/* Surname form */}
            {/* <View>
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Last Name:</Text>
                  <TouchableOpacity
                    style={styles.buttonEdit}
                    activeOpacity={0.8}
                    onPress={editSurname}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                {errorsSurname.surname && (
                  <View style={styles.textErrorContainer}>
                    <Text style={styles.textError}>
                      {errorsSurname.surname.message}
                    </Text>
                  </View>
                )}
                <Controller
                  control={controlSurname}
                  rules={{
                    required: "Last Name is required",
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?(?:-[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?)?$/,
                      message: "Invalid Last Name format",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={surnameTextInputStyle}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      // standartTextInputAtributes
                      placeholder="Brzęczyszczykiewicz"
                      defaultValue={user.surname}
                      autoCapitalize="words"
                      autoComplete="family-name"
                      inputMode="text"
                      editable={editableSurname}
                    />
                  )}
                  name="surname"
                />

                <View style={surnameButtonsStyle}>
                  <TouchableOpacity
                    style={styles.buttonSave}
                    activeOpacity={0.8}
                    onPress={handleSubmitSurname(onSubmitSurname)}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonCancel}
                    activeOpacity={0.8}
                    onPress={onCancelSurname}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
*/}

            {/* <View>
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>E-mail:</Text>
                  <TouchableOpacity
                    style={styles.buttonEdit}
                    activeOpacity={0.8}
                    onPress={editEmail}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                {errorsEmail.email && (
                  <View style={styles.textErrorContainer}>
                    <Text style={styles.textError}>
                      {errorsEmail.email.message}
                    </Text>
                  </View>
                )}
                <Controller
                  control={controlEmail}
                  rules={{
                    required: "E-mail is required",
                    pattern: {
                      value:
                        /^(?!\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
                      message: "Invalid E-mail format",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={emailTextInputStyle}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="example@gmail.com"
                      value={value}
                      defaultValue={user.email}
                      autoCapitalize="none"
                      autoComplete="email"
                      inputMode="email"
                      editable={editableEmail}
                    />
                  )}
                  name="email"
                />

                <View style={emailButtonsStyle}>
                  <TouchableOpacity
                    style={styles.buttonSave}
                    activeOpacity={0.8}
                    onPress={handleSubmitEmail(onSubmitEmail)}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonCancel}
                    activeOpacity={0.8}
                    onPress={onCancelEmail}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View> */}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
