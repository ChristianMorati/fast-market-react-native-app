import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '../../pages/login/signup';
import SignIn from '../../pages/login/signin';


const UserStackNavigator = createNativeStackNavigator();

function NonAuthRouter() {

  return (
    <UserStackNavigator.Navigator
      initialRouteName='Seja Bem Vindo!'
    >
      <UserStackNavigator.Screen
        name="Sign In"
        component={SignIn}
        options={{

        }} />
      <UserStackNavigator.Screen
        name="Sign Up"
        component={SignUp}
      />
    </UserStackNavigator.Navigator>
  )
}

export default NonAuthRouter;