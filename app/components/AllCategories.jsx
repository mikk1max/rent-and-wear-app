import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Icon from "./Icon";

const AllCategories = () => {
  const headwear = ["beanie, cap, hat"];
  const outerwear = ["coat", "vest"];
  const dresses = [
    "dress",
    "sweater",
    "classic-costume",
    "woman-classic-costume",
    "party-costume",
  ];
  const tops = ["jersey", "t-shirt", "short-sleeves-shirt"];
  const bottoms = ["pants", "shorts", "short-skirt", "sport-pants"];
  const footwear = [
    "formal-shoes",
    "sneakers",
    "high-heel",
    "slippers",
    "socks",
  ];
  const accessories = ["gloves", "belt"];

  return (
    <SafeAreaView>
      <Text>Headwear</Text>
      <View>
        <View>
          {headwear.map((item) => (
            <Icon
              key={item}
              name={item}
              width={30}
              height={30}
              fillColor="black"
              colorStroke="black"
            />
          ))}
        </View>
      </View>
      <View>
        <View>
          {outerwear.map((item) => (
            <Icon
              key={item}
              name={item}
              width={30}
              height={30}
              fillColor="black"
              colorStroke="black"
            />
          ))}
        </View>
      </View>
      <View>
        <View>
          {dresses.map((item) => (
            <Icon
              key={item}
              name={item}
              width={30}
              height={30}
              fillColor="black"
              colorStroke="black"
            />
          ))}
        </View>
      </View>
      <View>
        <View>
          {tops.map((item) => (
            <Icon
              key={item}
              name={item}
              width={30}
              height={30}
              fillColor="black"
              colorStroke="black"
            />
          ))}
        </View>
      </View>
      <View>
        <View>
          {bottoms.map((item) => (
            <Icon
              key={item}
              name={item}
              width={30}
              height={30}
              fillColor="black"
              colorStroke="black"
            />
          ))}
        </View>
      </View>
      <View>
        <View>
          {footwear.map((item) => (
            <Icon
              key={item}
              name={item}
              width={30}
              height={30}
              fillColor="black"
              colorStroke="black"
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default AllCategories;
