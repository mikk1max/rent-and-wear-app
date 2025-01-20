import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import InputWithLabel from "../components/InputWithLabel";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { onLogin, signInWithGoogle } from "../utils/auth";
import { useTranslation } from "react-i18next";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function AuthLoginView() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);

  const initializeUser = (user) => {
    console.log("Zainicjalizowano użytkownika:", user);
  };

  const handleLogin = async (data) => {
    console.log("Dane logowania:", data);
    try {
      await onLogin(data, initializeUser);
      navigation.replace("MainApp");
    } catch (error) {
      setErrorMessage(
        "The email address or password that you've entered is not valid."
      );
      setIsModalVisible(true);
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
          source={require("../../assets/images/loginBackClothes.jpg")}
          style={styles.imgStyles}
        />

        <View style={mainStyles.container}>
          <View style={styles.loginPanel}>
            <Text style={styles.loginTitle}>{`${t("login.title")}!`}</Text>
            <View style={{ gap: 20 }}>
              <InputWithLabel
                control={control}
                name="email"
                placeholder="example@gmail.com"
                errors={errors}
                label={`${t("login.emailLabel")}:`}
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
                placeholder="qwerty123"
                errors={errors}
                label={`${t("login.passLabel")}:`}
                secureTextEntry
                validationRules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                inputStyle={[styles.inputStyle, { marginBottom: 0 }]}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={{ paddingHorizontal: 10, paddingVertical: 5 }}
              >
                <Text style={styles.forgotPass}>{`${t(
                  "login.forgotPass"
                )}?`}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.mainBtns, styles.loginBtn]}
              onPress={handleSubmit(handleLogin)}
            >
              <Text style={styles.mainBtnText}>{t("login.loginBtn")}</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>or</Text>

            <View style={{ gap: 15, flexDirection: "row" }}>
              <TouchableOpacity
                style={[styles.mainBtns, styles.anotherBtn]}
                onPress={() => navigation.navigate("Registration")}
              >
                <Text
                  style={[
                    styles.mainBtnText,
                    { color: globalStyles.primaryColor },
                  ]}
                >
                  {t("login.signUpBtn")}
                </Text>
              </TouchableOpacity>
            </View>
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
                  {t("login.modalError.title")}
                </Text>
                <Text style={styles.modalMessage}>{errorMessage}</Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>
                    {t("login.modalError.closeBtn")}
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
  loginPanel: {
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
    color: globalStyles.primaryColor,
    backgroundColor: globalStyles.secondaryColor,
    padding: 15,
    borderRadius: globalStyles.BORDER_RADIUS,
  },
  forgotPass: {
    color: globalStyles.primaryColor,
    alignSelf: "flex-end",
    fontWeight: "bold",
    marginVertical: 15,
  },
  orText: {
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    alignSelf: "center",
    fontWeight: "bold",
    color: globalStyles.primaryColor,
  },
  mainBtns: {
    paddingVertical: 15,
    borderRadius: globalStyles.BORDER_RADIUS,
    alignItems: "center",
  },
  loginBtn: {
    backgroundColor: globalStyles.primaryColor,
  },
  anotherBtn: {
    backgroundColor: globalStyles.secondaryColor,
    flex: 1,
    justifyContent: "center",
  },
  mainBtnText: {
    color: globalStyles.textOnPrimaryColor,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
    backgroundColor: globalStyles.primaryColor,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
