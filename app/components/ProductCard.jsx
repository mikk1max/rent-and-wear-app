import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card } from 'react-native-elements';

const ProductCard = ({ productName, productPrice, productLink, containerWidth }) => {
  // Width of card
  const cardWidth = (containerWidth - 1 * 5) / 2

  const onPress = () => console.log(productLink)

  return (
    <View>
      <Card
        containerStyle={{
          height: 200,
          width: cardWidth,
          margin: 0,
          marginTop: 15,
          padding: 0,
          borderRadius: 15,
        }}
      >
        <Card.Image
          style={{
            height: 150,
            width: "100%",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
          source={{ uri: "https://www.tommyjohn.com/cdn/shop/articles/holey.webp?v=1659548657&width=1500" }}
        />

        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: "#525252",
            height: 50,
            width: "100%",
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{color: "#ffffff"}}
          >
            { productName }
          </Text>

          <Text
            style={{color: "#ffffff"}}
          >
            ${ productPrice } / day
          </Text>
          
        </TouchableOpacity>
      </Card>
    </View>
  )
}

export default ProductCard

const styles = StyleSheet.create({})