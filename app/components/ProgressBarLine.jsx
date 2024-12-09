import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";
import { globalStyles } from "../utils/style";

const ProgressBarLine = ({ progressValue }) => {
  // const glow = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(glow, {
  //         toValue: 1,
  //         duration: 2000,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(glow, {
  //         toValue: 0,
  //         duration: 2000,
  //         useNativeDriver: true,
  //       }),
  //     ])
  //   ).start();
  // }, [glow]);
  //
  // const glowStyle = {
  //   backgroundColor: globalStyles.primaryColor,
  //   opacity: glow.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: [0.4, 1],
  //   }),
  // };

  // console.log("progressValue: " + progressValue);

  return (
    <ProgressBar
      progress={progressValue}
      color={globalStyles.primaryColor}
      style={[styles.progressBar]}
    />
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 6,
    marginBottom: 15,
  },
});

export default ProgressBarLine;
