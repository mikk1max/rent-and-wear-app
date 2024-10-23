import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { globalStyles } from "../utils/style";

const IconButton = ({ iconName, onPress, containerWidth, isActive }) => {
  // Obliczanie rozmiaru przycisku
  const buttonSize = (containerWidth - 10 * 4) / 5; // 10 to odstęp między przyciskami

  const backgroundColor = isActive
    ? globalStyles.accentColor
    : globalStyles.secondaryColor;
  const iconColor = isActive
    ? globalStyles.textOnAccentColor
    : globalStyles.accentColor;

  return (
    <View style={styles.container(buttonSize)}>
      <TouchableOpacity
        style={[styles.iconBtn, { backgroundColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <FontAwesome6 name={iconName} size={25} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: (size) => ({
    width: size,
    height: size,
    justifyContent: "center",
    alignItems: "center",
  }),
  iconBtn: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
});

export default IconButton;
