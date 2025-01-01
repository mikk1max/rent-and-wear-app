import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { globalStyles } from "../utils/style";
import Icon from "./Icon";

const IconButton = ({ filePath, ...props }) => {

  const buttonSize = (props.containerWidth - 10 * 4) / 5; // 10 to odstęp między przyciskami

  const backgroundColor = props.isActive
    ? globalStyles.accentColor
    : globalStyles.secondaryColor;
  const iconColor = props.isActive
    ? globalStyles.textOnAccentColor
    : globalStyles.accentColor;

  return (
    <View style={styles.container(buttonSize)}>
      <TouchableOpacity
        style={[styles.iconBtn, { backgroundColor }]}
        onPress={props.onPress}
        activeOpacity={0.8}
      >
        <Icon
          name={props.iconName}
          width={35}
          height={35}
          fillColor={iconColor}
        />
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
