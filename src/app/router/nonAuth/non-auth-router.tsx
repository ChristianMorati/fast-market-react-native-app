import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProductContext } from '../../contexts/product-context';
import Login from '../../pages/login/login';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function NonAuthRouter() {
  const {isScannerAlive, setIsScannerAlive} = React.useContext(ProductContext);
  const navigation = useNavigation()
  
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Login"
        component={Login}
        options={{
          // tabBarIcon: ({ focused, color, size }) => (
          //   <Image
          //     source={require('../../../assets/home.png')}
          //     style={{ width: size, height: size, tintColor: color }}
          //   />
          // ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
           if(isScannerAlive) setIsScannerAlive(false);
          },
        })}
      />
    </Tab.Navigator>
  );
}
export default NonAuthRouter;