import React, { useContext, useEffect, useState } from 'react';
import { SectionList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import FeaturedProducts from '../../components/products/featured-products/featured-products';
import { colors } from '../../global-styles';
import { useProductContext } from '../../contexts/product-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button } from '@rneui/base';
import { useAuth } from '../../contexts/auth-context';


function Home() {
  const auth = useAuth();
  const sections = [
    {
      title: 'Featured Products', data: [
        <>
          <View style={{
            marginBottom: 10,
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 16,
          }}>
            <Text>{auth.userInfo?.username}</Text>
            <Text>{auth.userInfo?.name}</Text>
            <Text>CPF: {auth.userInfo?.cpf}</Text>
          </View>
        </>]
    },
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
    padding: 10,
  },
});

export default Home;