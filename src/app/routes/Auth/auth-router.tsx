import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProductContext, useProductContext } from '../../contexts/product-context';
import Home from '../../pages/home/home';
import Products from '../../pages/products/products';
import Payment from '../../pages/payment/payment';
import { Text } from '@rneui/base';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthRouter() {
  const { isScannerAlive, setIsScannerAlive } = React.useContext(ProductContext);
  const navigation = useNavigation()
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
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (productContext.isScannerAlive) productContext.setIsScannerAlive(false);
          },
        })}
      />
      <Tab.Screen
        name="Products"
        component={Products}
        options={
          {
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require('../../../../assets/cart.png')}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (!productContext.isScannerAlive) productContext.setIsScannerAlive(true);
          },
        })}
      />
      <Tab.Screen
        name="Payment"
        component={Payment}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../../../assets/cart.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (productContext.isScannerAlive) productContext.setIsScannerAlive(false);
          },
        })}
      />
    </Tab.Navigator>
  );
}
export default AuthRouter;