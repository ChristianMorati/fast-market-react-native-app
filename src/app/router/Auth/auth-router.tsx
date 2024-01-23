import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useProductContext } from '../../contexts/product-context';
import Home from '../../pages/home/home';
import Products from '../../pages/products/products';
import Payment from '../../pages/payment/payment';
import NonAuthRouter from '../nonAuth/non-auth-router';


const Tab = createBottomTabNavigator();
const ProductsStackNavigator = createNativeStackNavigator();

function ProductStack() {
  return (
    <ProductsStackNavigator.Navigator
      initialRouteName='Products'
    >
      <ProductsStackNavigator.Screen
        name="Ìr as compras"
        component={Products}
      />
      <ProductsStackNavigator.Screen
        name="Pagamento"
        component={Payment}
        options={{
          navigationBarColor: 'black'
        }}
      />
    </ProductsStackNavigator.Navigator>
  )
}

function AuthRouter() {
  const productContext = useProductContext();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: 'white',
        }
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../../../assets/home.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Comprar"
        component={ProductStack}
        options={
          {
            tabBarBadge: productContext.cartProducts.length,
            tabBarBadgeStyle: {
              backgroundColor: 'red',
            },
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require('../../../../assets/cart.png')}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
      />
    </Tab.Navigator>
  );
}
export default AuthRouter;