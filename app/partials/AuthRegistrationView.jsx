import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import InputWithLabel from "../components/InputWithLabel";
import { styles as mainStyles } from "../utils/style";
import { onRegister } from "../utils/auth";
import { useUser } from "../components/UserProvider";
import { globalStyles } from "../utils/style";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

export default function AuthRegistrationView() {
  const { t } = useTranslation();
  const { initializeUser } = useUser();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegister = async (data) => {
    try {
      await onRegister(data, initializeUser);
      navigation.navigate("MainApp");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={[mainStyles.whiteBack]}>
      <KeyboardAwareScrollView
        extraScrollHeight={10}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../../assets/images/loginBackRegClothes.jpg")}
          style={styles.imgStyles}
        />
        <View style={mainStyles.container}>
          <View style={[styles.registerPanel]}>
            <Text style={styles.loginTitle}>{t("signUp.title")}</Text>

            <View style={{ gap: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 20,
                  justifyContent: "center",
                }}
              >
                <InputWithLabel
                  control={control}
                  name="name"
                  placeholder="John"
                  errors={errors}
                  label={`${t("signUp.nameLabel")}:`}
                  validationRules={{
                    required: "First name is required",
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$/,
                      message: "Invalid First Name format",
                    },
                  }}
                  inputStyle={[
                    styles.inputStyle,
                    { width: (width - 2 * 20) / 2 - 15 },
                  ]}
                />
                <InputWithLabel
                  control={control}
                  name="surname"
                  placeholder="Doe"
                  errors={errors}
                  label={`${t("signUp.surnameLabel")}:`}
                  validationRules={{
                    required: "Last name is required",
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?(?:-[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?)?$/,
                      message: "Invalid Last Name format",
                    },
                  }}
                  inputStyle={[
                    styles.inputStyle,
                    { width: (width - 2 * 20) / 2 - 15 },
                  ]}
                />
              </View>
              <InputWithLabel
                control={control}
                name="email"
                placeholder="example@gmail.com"
                errors={errors}
                label={`${t("signUp.emailLabel")}:`}
                validationRules={{
                  required: "E-mail is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
                    message: "Invalid email format",
                  },
                }}
                inputStyle={styles.inputStyle}
              />
              <InputWithLabel
                control={control}
                name="password"
                placeholder="Password"
                errors={errors}
                label={`${t("signUp.passLabel")}:`}
                secureTextEntry
                validationRules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                inputStyle={styles.inputStyle}
              />
            </View>
            <TouchableOpacity
              style={[styles.mainBtns, styles.registerBtn]}
              onPress={handleSubmit(handleRegister)}
            >
              <Text style={styles.mainBtnText}>{t("signUp.signUpBtn")}</Text>
            </TouchableOpacity>
            {errorMessage && (
              <Text style={{ color: "red" }}>{errorMessage}</Text>
            )}
          </View>
          <Modal
            visible={isModalVisible}
            transparent
            animationType="slide"
            onRequestClose={closeModal}
          >
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {t("signUp.modalError.title")}
                </Text>
                <Text style={styles.modalMessage}>{errorMessage}</Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>
                    {t("signUp.modalError.closeBtn")}
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Modal>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  registerPanel: {
    flex: 1,
    width: "100%",
  },
  imgStyles: {
    resizeMode: "cover",
    width: "100%",
    height: 250,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 20,
    color: globalStyles.primaryColor,
  },
  inputStyle: {
    backgroundColor: globalStyles.secondaryColor,
    padding: 15,
    borderRadius: globalStyles.BORDER_RADIUS,
  },
  mainBtns: {
    paddingVertical: 15,
    borderRadius: globalStyles.BORDER_RADIUS,
    alignItems: "center",
  },
  registerBtn: {
    backgroundColor: globalStyles.accentColor,
    marginTop: 20,
  },
  mainBtnText: {
    color: globalStyles.textOnPrimaryColor,
    fontSize: 16,
    fontWeight: "bold",
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: globalStyles.backgroundColor,
    padding: 20,
    borderRadius: globalStyles.BORDER_RADIUS,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: globalStyles.accentColor,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
