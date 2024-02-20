import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '../../pages/login/signup';
import SignIn from '../../pages/login/signin';
import LoadingScreen from '../../pages/login/loadingScreen';


const UserStackNavigator = createNativeStackNavigator();

function NonAuthRouter() {

  return (
    <UserStackNavigator.Navigator
      initialRouteName='Loading Screen'
      screenOptions={{
        headerShown: false
      }}
    >
      <UserStackNavigator.Screen
        name="Loading Screen"
        component={LoadingScreen}
      />
      <UserStackNavigator.Screen
        name="Sign In"
        component={SignIn}
        options={{
          headerShown: false
        }}
      />
      <UserStackNavigator.Screen
        name="Sign Up"
        component={SignUp}
        options={{
          headerShown: false
        }}
      />
    </UserStackNavigator.Navigator>
  )
}

export default NonAuthRouter;