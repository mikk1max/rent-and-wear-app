import React, { useState } from "react";
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
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles } from "../utils/style";
import { useForm, Controller } from "react-hook-form";

// Get the screen dimensions
const { width } = Dimensions.get("window");

const SettingsView = () => {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <View style={{ flex: 1, backgroundColor: globalStyles.backgroundColor }}>
      <View style={styles.container}>
        <View style={styles.mainSection}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>E-mail:</Text>
                <View style={{ flexDirection: "row" }}>
                  <Button color={"blue"} title="Save" style={styles.button} />
                  <Button title="Edit" style={styles.button} />
                </View>
              </View>

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="example@gmail.com"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
              {errors.email && <Text>This field is required.</Text>}
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
  },

  mainSection: {
    flex: 1,
    backgroundColor: globalStyles.secondaryColor,
    borderRadius: 15,
    marginBottom: Platform.OS === "android" ? 25 : 30,
    padding: 20,
  },

  inputContainer: {},

  textInput: {
    backgroundColor: "lightyellow",
    color: "black",
    padding: 10,
    borderRadius: 15,
  },

  button: {
    borderRadius: 15,
    backgroundColor: "blue",
  }
});

export default SettingsView;
