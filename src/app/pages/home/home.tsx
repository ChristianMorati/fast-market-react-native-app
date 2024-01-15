import React, { useContext, useEffect, useState } from 'react';
import { SectionList, SafeAreaView, StyleSheet, Text } from 'react-native';
import FeaturedProducts from '../../components/products/featured-products/featured-products';
import { colors } from '../../global-styles';
import { useProductContext } from '../../contexts/product-context';
import Product from '../../models/productModel';
import Test from '../../components/test/test';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function Home() {

  const productContext = useProductContext();

  const sections = [
    {
      title: 'Featured Products', data: [<FeaturedProducts />]
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainAppColor,
  },
});

export default Home;