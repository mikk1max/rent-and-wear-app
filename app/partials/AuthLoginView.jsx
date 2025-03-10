import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import InputWithLabel from "../components/InputWithLabel";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { onLogin } from "../utils/auth";
import { useTranslation } from "react-i18next";
import ErrorModal from "../components/ErrorModal";
import { styles } from "../styles/AuthLoginViewStyles";

export default function AuthLoginView() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const initializeUser = (user) => {
    console.log("User initialized:", user);
  };

  const handleLogin = async (data) => {
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

  const closeModal = () => {
    setIsModalVisible(false);
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={[mainStyles.whiteBack]}>
      <StatusBar backgroundColor={globalStyles.backgroundColor} barStyle="dark-content" />
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
                placeholder={t("login.emailPlaceholder")}
                errors={errors}
                label={`${t("login.emailLabel")}:`}
                validationRules={{
                  required: t("login.emailRequired"),
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
                    message: t("login.emailPattern"),
                  },
                }}
                inputStyle={styles.inputStyle}
              />
              <InputWithLabel
                control={control}
                name="password"
                placeholder={t("login.passwordPlaceholder")}
                errors={errors}
                label={`${t("login.passLabel")}:`}
                isSecure
                validationRules={{
                  required: t("login.passwordRequired"),
                  minLength: {
                    value: 6,
                    message: t("login.passwordMinLength"),
                  },
                }}
                inputStyle={[styles.inputStyle, { marginBottom: 0 }]}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                onPress={() => navigation.navigate("ResetPassword")}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
              >
                <Text style={styles.forgotPass}>{`${t(
                  "login.forgotPass"
                )}?`}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.mainBtns, styles.loginBtn]}
              onPress={handleSubmit(handleLogin)}
              activeOpacity={globalStyles.ACTIVE_OPACITY}
            >
              <Text style={styles.mainBtnText}>{t("login.loginBtn")}</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>{t("login.orText")}</Text>

            <View style={{ gap: 15, flexDirection: "row" }}>
              <TouchableOpacity
                style={[styles.mainBtns, styles.anotherBtn]}
                onPress={() => navigation.navigate("Registration")}
                activeOpacity={globalStyles.ACTIVE_OPACITY}
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

          <ErrorModal
            isVisible={isModalVisible}
            onClose={closeModal}
            title={t("login.modalError.title")}
            message={errorMessage}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
