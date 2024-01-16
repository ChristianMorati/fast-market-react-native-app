import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, SectionList, StyleSheet, Text } from 'react-native';
import Product from '../../models/productModel';
import FeaturedProducts from '../../components/products/featured-products/featured-products';
import CartProducts from '../../components/products/cart-products/cart-products';
import ProductBarCodeScanner from '../../components/products/product-barcode-scanner/product-barcode-scanner';
import { colors } from '../../global-styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



const Products: React.FC = () => {
  const sections = [
    {
      title: 'Leitor', data: [<ProductBarCodeScanner />]
    },
    {
      title: 'Cart Products', data: [<CartProducts />]
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <SectionList
          style={{}}
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
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default Products;