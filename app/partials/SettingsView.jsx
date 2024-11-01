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
  Image,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { globalStyles } from "../utils/style";
import { useForm, Controller } from "react-hook-form";
import { Divider } from "react-native-elements";

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
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,

                  // marginRight: 15,
                  // borderTopLeftRadius: 15,
                  // borderBottomLeftRadius: 15,
                }}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => console.log("Edit picture")}
              >
                <Text style={styles.imageText}>Edit profile picture</Text>
              </TouchableOpacity>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.inputContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.label}>E-mail:</Text>
                <TouchableOpacity
                  style={styles.buttonEdit}
                  activeOpacity={0.8}
                  onPress={() => console.log("You can edit")}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                {/* <Button color={"blue"} title="Save" style={styles.button} /> */}
                {/* <Button title="Edit" style={styles.button} /> */}
              </View>

              {errors.email && (
                <Text style={styles.textError}>{errors.email.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value:
                      /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim,
                    message: "Invalid email format",
                  },
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

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={styles.buttonSave}
                  activeOpacity={0.8}
                  // onPress={() => console.log("Saved")}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancel}
                  activeOpacity={0.8}
                  onPress={() => console.log("Canceled")}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.label}>E-mail:</Text>
                <TouchableOpacity
                  style={styles.buttonEdit}
                  activeOpacity={0.8}
                  onPress={() => console.log("You can edit")}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                {/* <Button color={"blue"} title="Save" style={styles.button} /> */}
                {/* <Button title="Edit" style={styles.button} /> */}
              </View>

              {errors.email && (
                <Text style={styles.textError}>{errors.email.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value:
                      /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim,
                    message: "Invalid email format",
                  },
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

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={styles.buttonSave}
                  activeOpacity={0.8}
                  // onPress={() => console.log("Saved")}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancel}
                  activeOpacity={0.8}
                  onPress={() => console.log("Canceled")}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.label}>E-mail:</Text>
                <TouchableOpacity
                  style={styles.buttonEdit}
                  activeOpacity={0.8}
                  onPress={() => console.log("You can edit")}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                {/* <Button color={"blue"} title="Save" style={styles.button} /> */}
                {/* <Button title="Edit" style={styles.button} /> */}
              </View>

              {errors.email && (
                <Text style={styles.textError}>{errors.email.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value:
                      /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim,
                    message: "Invalid email format",
                  },
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

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={styles.buttonSave}
                  activeOpacity={0.8}
                  // onPress={() => console.log("Saved")}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancel}
                  activeOpacity={0.8}
                  onPress={() => console.log("Canceled")}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.label}>E-mail:</Text>
                <TouchableOpacity
                  style={styles.buttonEdit}
                  activeOpacity={0.8}
                  onPress={() => console.log("You can edit")}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                {/* <Button color={"blue"} title="Save" style={styles.button} /> */}
                {/* <Button title="Edit" style={styles.button} /> */}
              </View>

              {errors.email && (
                <Text style={styles.textError}>{errors.email.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value:
                      /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim,
                    message: "Invalid email format",
                  },
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

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={styles.buttonSave}
                  activeOpacity={0.8}
                  // onPress={() => console.log("Saved")}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancel}
                  activeOpacity={0.8}
                  onPress={() => console.log("Canceled")}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* <Divider
              style={{ backgroundColor: "red", marginTop: 15, height: 5 }}
            /> */}
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

  label: {
    fontFamily: "WorkSans_900Black",
    fontSize: 16,
    color: globalStyles.textOnSecondaryColor,
  },

  buttonEdit: {
    width: 70,
    borderRadius: 15,
    backgroundColor: globalStyles.primaryColor,
    padding: 5,
    alignItems: "center",
  },

  buttonSave: {
    display: "none",
    width: "50%",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: "green",
    padding: 7,
    alignItems: "center",
  },

  buttonCancel: {
    display: "none",
    width: "50%",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: globalStyles.redColor,
    padding: 7,
    alignItems: "center",
  },

  buttonText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.textOnPrimaryColor,
  },

  inputContainer: {
    gap: 10,
    // border: "black",
    // borderWidth: 1,
    // borderRadius: 15,
    // padding: 10,
    marginBottom: 25,
  },

  textInput: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    backgroundColor: "lightyellow",
    color: "black",
    padding: 10,
    borderRadius: 15,
  },

  textError: {
    // overflow: "hidden",
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: globalStyles.redColor,
    backgroundColor: "#FFCCCF",
    paddingTop: 7,
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginBottom: -25,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  imageContainer: {
    alignItems: "center",
    gap: 15,
    // marginBottom: 30,
  },

  imageText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
  },

  divider: {
    marginVertical: 20,
    height: 2,
    backgroundColor: globalStyles.accentColor,
  },
});

export default SettingsView;
