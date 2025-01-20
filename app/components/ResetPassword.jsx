import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useForm } from "react-hook-form";
import InputWithLabel from "../components/InputWithLabel";
import { resetPassword } from "../utils/auth";
import { globalStyles } from "../utils/style";

export default function ResetPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePasswordReset = async (email) => {
    try {
      console.log("Email passed to resetPassword:", email);
      const response = await resetPassword(email);
      alert(response.message);
    } catch (error) {
      console.error("Reset password error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={globalStyles.whiteBack}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <InputWithLabel
          control={control}
          name="resetEmail"
          placeholder="example@gmail.com"
          errors={errors}
          label="Email:"
          validationRules={{
            required: "E-mail is required",
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
              message: "Invalid email format",
            },
          }}
          inputStyle={styles.inputStyle}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handlePasswordReset)}
        >
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: globalStyles.primaryColor,
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
