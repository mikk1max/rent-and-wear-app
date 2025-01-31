import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useForm } from "react-hook-form";
import InputWithLabel from "../components/InputWithLabel";
import { resetPassword } from "../utils/auth";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { useTranslation } from "react-i18next";

let passwordResetTimestamps = {};

export default function ResetPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { t } = useTranslation();

  const handlePasswordReset = async (data) => {
    const email = data.resetEmail;
    const currentTime = new Date().getTime();

    if (
      passwordResetTimestamps[email] &&
      currentTime - passwordResetTimestamps[email] < 5 * 60 * 1000
    ) {
      Alert.alert(
        `${t("passwordReset.resetPasswordAlert.tooSoon")}`,
        `${t("passwordReset.resetPasswordAlert.tooSoonDescription")}`
      );
      return;
    }

    try {
      console.log("Email passed to resetPassword:", email);
      const response = await resetPassword(email);

      passwordResetTimestamps[email] = currentTime;

      Alert.alert(
        `${t("passwordReset.resetPasswordAlert.success")}`,
        `${t("passwordReset.resetPasswordAlert.successDescription")}`
      );
    } catch (error) {
      console.error("Reset password error:", error.message);
      Alert.alert(
        `${t("passwordReset.resetPasswordAlert.failure")}`,
        `${t("passwordReset.resetPasswordAlert.failureDescription")}`
      );
    }
  };

  return (
    <SafeAreaView style={globalStyles.whiteBack}>
      <View style={[mainStyles.container, styles.container]}>
        <Image
          source={require("../../assets/images/NotLogin.png")}
          style={styles.image}
        />
        <InputWithLabel
          control={control}
          name="resetEmail"
          placeholder={t("passwordReset.emailPlaceholder")}
          errors={errors}
          label={`${t("passwordReset.emailLabel")}:`}
          validationRules={{
            required: t("passwordReset.emailRequired"),
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
              message: t("passwordReset.emailPattern"),
            },
          }}
          inputStyle={styles.inputStyle}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handlePasswordReset)}
          activeOpacity={globalStyles.ACTIVE_OPACITY}
        >
          <Text style={styles.buttonText}>
            {t("passwordReset.sendResetLink")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: "stretch",
    paddingVertical: 20,
  },

  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 10,
  },

  inputStyle: {
    color: globalStyles.primaryColor,
    backgroundColor: globalStyles.secondaryColor,
    padding: 15,
    borderRadius: globalStyles.BORDER_RADIUS,
    marginBottom: 20,
  },

  button: {
    backgroundColor: globalStyles.primaryColor,
    padding: 15,
    borderRadius: globalStyles.BORDER_RADIUS,
    alignItems: "center",
  },

  buttonText: {
    color: globalStyles.textOnPrimaryColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});
