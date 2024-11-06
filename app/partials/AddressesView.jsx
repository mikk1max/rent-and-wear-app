import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
  Image,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles } from "../utils/style";
import { useForm, Controller } from "react-hook-form";
import { Divider } from "react-native-elements";

import { ref, onValue, update } from "firebase/database";
import { db } from "../../firebaseConfig";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const AddressesView = () => {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // User
  const [user, setUser] = useState([]);
  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUser(usersArray[0]);
      }
    });
  }, []);

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
    setNameButtonsStyle(styles.buttons);

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
    setSurnameButtonsStyle(styles.buttons);

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
    setEmailButtonsStyle(styles.buttons);

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

  // Standard TextInput atributes like onChange, value etc.
  // const standartTextInputAtributes = {
  //   onBlur: { onBlur },
  //   onChangeText: { onChange },
  //   value: { value },
  // };

  return (
    <View style={{ flex: 1, backgroundColor: globalStyles.backgroundColor }}>
      <View style={styles.container}>
        <View style={styles.mainSection}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Profile image */}
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,

                  // marginRight: 15,
                  // borderTopLeftRadius: 15,
                  // borderBottomLeftRadius: 15,
                }}
              />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => console.log("Edit picture")}
              >
                <Text style={styles.imageText}>Edit profile picture</Text>
              </TouchableOpacity>
            </View>

            <Divider style={styles.divider} />

            {/* Name form */}
            <View>
              <View style={styles.inputContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.label}>Name:</Text>
                  <TouchableOpacity
                    style={styles.buttonEdit}
                    activeOpacity={0.8}
                    onPress={editName}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                {errorsName.name && (
                  <Text style={styles.textError}>
                    {errorsName.name.message}
                  </Text>
                )}
                <Controller
                  control={controlName}
                  rules={{
                    required: "Name is required",
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$/,
                      message: "Invalid name format",
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
              </View>
            </View>

            {/* Surname form */}
            <View>
              <View style={styles.inputContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.label}>Surname:</Text>
                  <TouchableOpacity
                    style={styles.buttonEdit}
                    activeOpacity={0.8}
                    onPress={editSurname}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                {errorsSurname.surname && (
                  <Text style={styles.textError}>
                    {errorsSurname.surname.message}
                  </Text>
                )}
                <Controller
                  control={controlSurname}
                  rules={{
                    required: "Surname is required",
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?(?:-[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?)?$/,
                      message: "Invalid surname format",
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

            {/* E-mail form */}
            <View>
              <View style={styles.inputContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
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
                  <Text style={styles.textError}>
                    {errorsEmail.email.message}
                  </Text>
                )}
                <Controller
                  control={controlEmail}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value:
                        /^(?!\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
                      message: "Invalid email format",
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
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingHorizontal: 25,
    justifyContent: "flex-start",
    // marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
  },

  mainSection: {
    flex: 1,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: 15,
    // marginBottom: Platform.OS === "android" ? 25 : 30,
    marginBottom: 20,
    padding: 20,
    // paddingHorizontal: 20,
  },

  label: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  buttonsHidden: {
    display: "none",
  },

  buttonEdit: {
    width: 70,
    borderRadius: 15,
    backgroundColor: globalStyles.primaryColor,
    padding: 5,
    alignItems: "center",
  },

  buttonSave: {
    // display: "none",
    width: "50%",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: "green",
    padding: 7,
    alignItems: "center",
  },

  buttonCancel: {
    // display: "none",
    width: "50%",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: globalStyles.redColor,
    padding: 7,
    alignItems: "center",
  },

  // buttonCancelHidden:

  buttonText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.textOnPrimaryColor,
  },

  inputContainer: {
    gap: 10,
    // border: "black",
    // borderWidth: 1,
    // borderRadius: 15,
    // padding: 10,
    marginBottom: 25,
  },

  textInput: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    backgroundColor: "lightyellow",
    color: "black",
    padding: 10,
    borderRadius: 15,
  },

  textInputBlocked: {
    color: "darkslategray",
    backgroundColor: "lightcyan",
  },

  textError: {
    // overflow: "hidden",
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.redColor,
    backgroundColor: "#FFCCCF",
    paddingTop: 7,
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginBottom: -25,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  imageContainer: {
    alignItems: "center",
    gap: 15,
    // marginBottom: 30,
  },

  imageText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: globalStyles.blueColor,
  },

  divider: {
    marginVertical: 20,
    height: 2,
    backgroundColor: globalStyles.accentColor,
  },
});

export default AddressesView;
