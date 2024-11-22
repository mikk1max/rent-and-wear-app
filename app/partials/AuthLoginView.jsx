import { View, Text, SafeAreaView, ImageBackground } from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useCustomFonts } from "../utils/fonts";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { styles } from "../styles/AuthLoginViewStyles";
import InputWithLabel from "../components/InputWithLabel";
import { TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";

export default function AuthLoginView() {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  // Define state for user information
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // Form hooks for email and password
  const {
    control: controlEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm();

  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm();

  const onSubmitEmail = (data) => {
    setUser((prevUser) => ({ ...prevUser, email: data.email.toLowerCase() }));
  };

  const onSubmitPassword = (data) => {
    setUser((prevUser) => ({ ...prevUser, password: data.password }));
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/images/clothes_back.jpg")}
        style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
      >
        <SafeAreaView
          style={[mainStyles.whiteBack, { backgroundColor: "transparent" }]}
        >
          <View
            style={[
              mainStyles.container,
              mainStyles.scrollBase,
              {
                paddingVertical: 20,
                marginVertical: 60,
                marginHorizontal: 20,
                opacity: 0.85,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "WorkSans_900Black",
                fontSize: 32,
                marginBottom: 20,
              }}
            >
              Welcome back!
            </Text>
            <View style={{ width: "100%" }}>
              <InputWithLabel
                control={controlEmail}
                name={"email"}
                placeholder={"example@gmail.com"}
                errors={errorsEmail}
                onSubmit={handleSubmitEmail(onSubmitEmail)}
                inputStyle={styles.textInput}
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
              />
              <InputWithLabel
                control={controlPassword}
                name={"password"}
                placeholder={"Password"}
                errors={errorsPassword}
                onSubmit={handleSubmitPassword(onSubmitPassword)}
                inputStyle={styles.textInput}
                label={"Password:"}
                secureTextEntry={true}
                validationRules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                isSecure={true}
              />

              <TouchableOpacity>
                <Text style={styles.forgotPass}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.loginBtnText}>Log in</Text>
              </TouchableOpacity>

              <Divider style={{ marginTop: 20, height: 2 }} />
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
