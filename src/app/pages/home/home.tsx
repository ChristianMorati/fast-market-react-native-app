import React from 'react';
import { SafeAreaView, Text, View, ScrollView, Image } from 'react-native';
import FeaturedProducts from '../../components/products/featured-products/featured-products';
import { LastPurchase } from '../../components/home/last-purchase/last-purchase';
import { TopButtonsNav } from '../../components/home/top-buttons-nav.tsx/top-buttons-nav';
import { ScapeFromBottomTab } from '../../components/scape-from-bottom-tabs';


function Header() {
  return (
    <View className='flex flex-row bg-white px-2 mb-2'>
      <Image
        className={``}
        source={require('../../../../assets/Fast_market_logo.png')}
        style={{ width: 70, height: 70 }}
      />
      <View className='p-2 justify-center'>
        <Text className='font-semibold'>Olá Christian!</Text>
      </View>
    </View>
  )
}

function Home() {
  return (
    <SafeAreaView className=''>
      <ScrollView>
        <Header />
        <TopButtonsNav />
        <LastPurchase />
        <FeaturedProducts />
      </ScrollView>
      <ScapeFromBottomTab />
    </SafeAreaView>
  );
}

export default Home;