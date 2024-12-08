import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import InputWithLabel from "../components/InputWithLabel";
import { styles as mainStyles } from "../utils/style";
import { onLogin } from "../utils/auth";

export default function AuthLoginView() {
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
      setErrorMessage(error.message);
      setIsModalVisible(true);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={[mainStyles.whiteBack, { padding: 20 }]}>
      <View style={mainStyles.container}>
        <View style={{}}>
          <Text
            style={{ fontSize: 32, fontWeight: "bold", marginVertical: 20 }}
          >
            Welcome Back!
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
            style={[styles.loginBtn, { marginTop: 20 }]}
            onPress={handleSubmit(handleLogin)}
          >
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.registerBtn, { marginTop: 10 }]}
            onPress={() => navigation.navigate("Registration")}
          >
            <Text style={styles.registerBtnText}>Register</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={closeModal}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Login Failed</Text>
              <Text style={styles.modalMessage}>{errorMessage}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginBtn: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerBtn: {
    backgroundColor: "#03DAC6",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  registerBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
