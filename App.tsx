import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import type { StatusBarStyle } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message'

import AuthRouter from './src/app/routes/Auth/auth-router';
import ProductProvider from './src/app/contexts/product-context';
import AuthProvider, { useAuth } from './src/app/contexts/auth-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentProvider from './src/app/contexts/payment-context';
import { STRIPE_KEY, BASE_URL_API } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const STYLES = ['default', 'dark-content', 'light-content'] as const;
  const [statusBarStyle, setStatusBarStyle] = React.useState<StatusBarStyle>(STYLES[2],);
  const { isLogged } = useAuth();


  AsyncStorage.setItem('TOKEN', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE1LCJ1c2VybmFtZSI6ImNocmlkZGRjY2NkZHNnY2RAZ21haWwuY28zbSIsImlhdCI6MTcwNTI3MzcwMCwiZXhwIjoxNzA1MjczNzYwfQ.0aVQUMtkDJYF4kexnr9FEw9euPrqaE6RbuFigj3LBzg");

  const authInterceptor = () => {
    console.log('interceptor');

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        try {
          const originalReq = error.config;

          if (error.response?.status === 401 && originalReq && !originalReq._retry) {
            originalReq._retry = true;

            const token = await AsyncStorage.getItem('TOKEN');
            const refreshResponse = await axios.put(`${BASE_URL_API}/auth/refresh`, { token });

            AsyncStorage.setItem('TOKEN', refreshResponse.data.access_token);
            originalReq.headers['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;

            return axios(originalReq);
          } else {
            throw error;
          }
        } catch (err) {
          console.error('Error in authInterceptor:', err);
          throw err;
        }
      }
    );
  };


  authInterceptor();

  return (
    <>
      <NavigationContainer>
        <ExpoStatusBar
          style={statusBarStyle === 'default' ? 'light' : 'light'}
          backgroundColor='black' />
        <StripeProvider publishableKey={STRIPE_KEY}>
          <PaymentProvider>
            <ProductProvider>
              <AuthProvider>
                <AuthRouter />
              </AuthProvider>
              {/* { isLogged ? <AuthRouter /> : <NonAuthRouter /> } */}
            </ProductProvider>
          </PaymentProvider>
        </StripeProvider>
      </NavigationContainer>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonsContainer: {
    padding: 0,
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default App;