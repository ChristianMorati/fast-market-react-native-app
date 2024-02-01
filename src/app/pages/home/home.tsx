import React from 'react';
import { SectionList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import FeaturedProducts from '../../components/products/featured-products/featured-products';
import { useAuth } from '../../contexts/auth-context';
import { colors } from '../../global-styles';


function Home() {
  const auth = useAuth();
  const sections = [
    {
      title: 'Featured Products', data: [
        <View style={{
          marginBottom: 10,
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 16,
          margin: 10,
        }}>
          <Text style={{ color: '#1e1e1e' }} >Email: {auth.userInfo?.username}</Text>
          <Text style={{ color: '#1e1e1e' }} >Nome: {auth.userInfo?.name}</Text>
          <Text style={{ color: '#1e1e1e' }} >CPF: {auth.userInfo?.cpf}</Text>
        </View>
  ]},
    {
      title: 'Featured Products', data: [<FeaturedProducts />]
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        style={{ height: 'auto' }}
        sections={sections}
        renderItem={({ item }) => item}
      />
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