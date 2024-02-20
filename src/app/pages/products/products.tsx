import React from 'react';
import { KeyboardAvoidingView, SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native';
import CartProducts from '../../components/products/cart-products/cart-products';
import ProductBarCodeScanner from '../../components/products/product-barcode-scanner/product-barcode-scanner';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScapeFromBottomTab } from '../../components/scape-from-bottom-tabs';


const Products: React.FC = () => {
  const sections = [
    {
      data: [
        <KeyboardAvoidingView behavior='padding'>
          <ProductBarCodeScanner />
        </KeyboardAvoidingView>
      ]
    },
    {
      data: [<CartProducts />]
    },
    {
      data: [
        <ScapeFromBottomTab/>
      ]
    }
  ];

  return (
    <SafeAreaView
      className='flex-1 bg-neutral-200 gap-2'
    >
      <GestureHandlerRootView>
        <SectionList
          sections={sections}
          renderItem={({ item }) => item}
          showsVerticalScrollIndicator={false}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Products;