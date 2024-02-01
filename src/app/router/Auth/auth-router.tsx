import React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useProductContext } from "../../contexts/product-context";
import Products from "../../pages/products/products";
import Payment from "../../pages/payment/payment";
import { Button, Image } from "@rneui/base";
import Home from "../../pages/home/home";
import { useNavigation } from "@react-navigation/native";
import Settings from "../../pages/settings/settings";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const ProductsStackNavigator = createNativeStackNavigator();

function ProductStack() {
  return (
    <ProductsStackNavigator.Navigator
      initialRouteName="Ìr as compras"
    >
      <ProductsStackNavigator.Screen
        name="Ìr as compras"
        component={Products}
        options={{
          headerShown: false
        }}
      />
      <ProductsStackNavigator.Screen
        name="Pagamento"
        component={Payment}
        options={{
        }}
      />
    </ProductsStackNavigator.Navigator>
  )
};

function BottomTabs() {
  const productContext = useProductContext();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0, .9)',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 0,
          elevation: 0,
          height: 50,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: ({ focused, color, ...otherProps }) => (
            <Text
              style={{ color: focused ? 'rgb(43, 117, 255)' : color, fontSize: 10 }}
            >Início</Text>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../../../assets/home.png')}
              style={{
                width: size, height: size,
                tintColor: focused ? 'rgb(43, 117, 255)' : color,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Comprar"
        component={ProductStack}
        options={
          {
            headerShown: false,
            tabBarBadge: productContext.cartProducts?.length ?? 0,
            tabBarBadgeStyle: {
              backgroundColor: 'red'
            },
            tabBarLabel: ({ focused, color, ...otherProps }) => (
              <Text
                style={{ color: focused ? 'rgb(43, 117, 255)' : color, fontSize: 10 }}
              > Ír as compras</Text>
            ),
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require('../../../../assets/cart.png')}
                style={{
                  width: size, height: size,
                  tintColor: focused ? 'rgb(43, 117, 255)' : color,
                }}
              />
            ),
          }}
      />
    </Tab.Navigator>
  );
}


const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "black", /* For browsers that do not support gradients */
  },
  headerTintColor: "white",
  headerBackTitle: "black",
};

const AuthRouter = () => {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      screenOptions={{
        ...screenOptionStyle,
        drawerStyle: {
          backgroundColor: 'black'
        }
      }}
      initialRouteName="Fast Market"
    >
      <Drawer.Screen
        name="Fast Market"
        component={BottomTabs}
        options={{
          drawerLabel: ({ focused, color }) => (
            <Text style={{ fontWeight: '500', color: focused ? 'white' : 'gray' }}>Fast Market</Text>
          ),
          drawerActiveBackgroundColor: 'rgb(43, 117, 255)',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Configurações",
          drawerLabel: ({ focused, color }) => (
            <Text style={{ fontWeight: '500', color: focused ? 'white' : 'gray' }}>Configurações</Text>
          ),
          drawerActiveBackgroundColor: 'rgb(43, 117, 255)',
        }}
      />
    </Drawer.Navigator>
  );
}


export default AuthRouter;