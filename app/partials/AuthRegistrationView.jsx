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
import ErrorModal from "../components/ErrorModal";

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
                  placeholder={t("signUp.namePlaceholder")}
                  errors={errors}
                  label={`${t("signUp.nameLabel")}:`}
                  validationRules={{
                    required: t("signUp.nameRequired"),
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$/,
                      message: t("signUp.namePattern"),
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
                  placeholder={t("signUp.surnamePlaceholder")}
                  errors={errors}
                  label={`${t("signUp.surnameLabel")}:`}
                  validationRules={{
                    required: t("signUp.surnameRequired"),
                    pattern: {
                      value:
                        /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?(?:-[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:[-'][A-ZĄĆĘŁŃÓŚŹŻ]?[a-ząćęłńóśźż]+)?)?$/,
                      message: t("signUp.surnamePattern"),
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
                placeholder={t("signUp.emailPlaceholder")}
                errors={errors}
                label={`${t("signUp.emailLabel")}:`}
                validationRules={{
                  required: t("signUp.emailRequired"),
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
                    message: t("signUp.emailPattern"),
                  },
                }}
                inputStyle={styles.inputStyle}
              />
              <InputWithLabel
                control={control}
                name="password"
                placeholder={t("signUp.passwordPlaceholder")}
                errors={errors}
                label={`${t("signUp.passLabel")}:`}
                validationRules={{
                  required: t("signUp.passwordRequired"),
                  minLength: {
                    value: 6,
                    message: t("signUp.passwordMinLength"),
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
  
          <ErrorModal
            isVisible={isModalVisible}
            onClose={closeModal}
            title={t("signUp.modalError.title")}
            message={errorMessage}
          />
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
    color: globalStyles.primaryColor,
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
    backgroundColor: globalStyles.primaryColor,
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
