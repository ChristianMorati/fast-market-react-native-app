import React, { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native';
import CartProducts from '../../components/products/cart-products/cart-products';
import ProductBarCodeScanner from '../../components/products/product-barcode-scanner/product-barcode-scanner';
import { colors } from '../../global-styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



const Products: React.FC = () => {
  const sections = [
    {
      title: 'Leitor', data: [
        <KeyboardAvoidingView behavior='padding'>
          <ProductBarCodeScanner />
        </KeyboardAvoidingView>
      ]
    },
    {
      title: 'Cart Products', data: [<CartProducts />]
    },
    {
      data: [
      <View style={{ height: 50, backgroundColor: 'transparent' }}></View>
    ]
    }
  ];

  return (
    <SafeAreaView
      style={styles.container}
    >
      <GestureHandlerRootView>
        <SectionList
          sections={sections}
          renderItem={({ item }) => item}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainAppColor,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default Products;