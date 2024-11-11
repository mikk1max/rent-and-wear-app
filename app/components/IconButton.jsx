import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { globalStyles } from "../utils/style";
import { SvgUri } from "react-native-svg";
import fetchSVG from "../utils/fetchSVG";

const IconButton = ({ filePath, ...props }) => {
  const [svgUrl, setSvgUrl] = useState(null);

  useEffect(() => {
    async function loadSvg() {
      const url = await fetchSVG(filePath);
      setSvgUrl(url);
    }
    loadSvg();
  }, [filePath]);

  // Obliczanie rozmiaru przycisku
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
        {/* <FontAwesome6 name={props.iconName} size={25} color={iconColor} /> */}
        <SvgUri
          uri={svgUrl}
          width={35}
          height={35}
          style={{ fill: iconColor }}
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
