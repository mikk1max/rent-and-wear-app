import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import InputWithLabel from "../components/InputWithLabel";
import { styles as mainStyles } from "../utils/style";
import { onRegister } from "../utils/auth";
import { useUser } from "../components/UserProvider";

export default function AuthRegistrationView() {
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

  return (
    <SafeAreaView style={[mainStyles.whiteBack, { padding: 20 }]}>
      <Text style={{ fontSize: 32, fontWeight: "bold", marginVertical: 20 }}>
        Register
      </Text>
      <InputWithLabel
        control={control}
        name="email"
        placeholder="example@gmail.com"
        errors={errors}
        label="E-mail:"
        validationRules={{
          required: "E-mail is required",
          pattern: {
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
            message: "Invalid email format",
          },
        }}
      />
      <InputWithLabel
        control={control}
        name="password"
        placeholder="Password"
        errors={errors}
        label="Password:"
        secureTextEntry
        validationRules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
      />
      <TouchableOpacity
        style={[mainStyles.button, { marginTop: 20 }]}
        onPress={handleSubmit(handleRegister)}
      >
        <Text style={mainStyles.buttonText}>Register</Text>
      </TouchableOpacity>
      {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
    </SafeAreaView>
  );
}
