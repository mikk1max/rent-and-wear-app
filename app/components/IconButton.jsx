import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const IconButton = ({ iconName, onPress, containerWidth, isActive }) => {
  // Obliczanie rozmiaru przycisku
  const buttonSize = (containerWidth - 10 * 4) / 5; // 10 to odstęp między przyciskami

  const backgroundColor = isActive ? "#000" : "#D3D3D3";
  const iconColor = isActive ? "#D3D3D3" : "#000";

  return (
    <View style={styles.container(buttonSize)}>
      <TouchableOpacity
        style={[styles.iconBtn, { backgroundColor }]}
        onPress={onPress}
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
