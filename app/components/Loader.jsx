import React from "react";
import { StyleSheet, View } from "react-native";
import { Fold } from "react-native-animated-spinkit";
import { globalStyles } from "../utils/style";

const Loader = () => {
  return (
    <View style={styles.container}>
      <Fold size={50} color={globalStyles.primaryColor} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    }
});

export default Loader;
