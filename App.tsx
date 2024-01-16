import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import type { StatusBarStyle } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message'

import ProductProvider from './src/app/contexts/product-context';
import AuthProvider, { useAuth } from './src/app/contexts/auth-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentProvider from './src/app/contexts/payment-context';
import { STRIPE_KEY, BASE_URL_API } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthRouter from './src/app/router/Auth/auth-router';

function App() {
  const STYLES = ['default', 'dark-content', 'light-content'] as const;
  const [statusBarStyle, setStatusBarStyle] = React.useState<StatusBarStyle>(STYLES[2],);
  const { isLogged } = useAuth();

  AsyncStorage.setItem('TOKEN', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE1LCJ1c2VybmFtZSI6ImNocmlkZGRjY2NkZHNnY2RAZ21haWwuY28zbSIsImlhdCI6MTcwNTQzMTgwNCwiZXhwIjoxNzA1NDMxODY0fQ.LNvxfRcSFhbtUEe1O3vxrvKCnFoutywf7HFh1zwlpxs");


  
  // Initialize the interceptor
  // const authInterceptor = () => {
  //   console.log('interceptor');

  //   axios.interceptors.response.use(
  //     (response) => response,
  //     async (error) => {
  //       try {
  //         const originalReq = error.config;

  //         if (error.response?.status === 401 && originalReq && !originalReq._retry) {
  //           originalReq._retry = true;

  //           const token = await AsyncStorage.getItem('TOKEN');
  //           const refreshResponse = await axios.put(`${BASE_URL_API}/auth/refresh`, { token });
  //           console.log(refreshResponse.data.access_token)

  //           AsyncStorage.setItem('TOKEN', refreshResponse.data.access_token);
  //           originalReq.headers['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;

  //           return axios(originalReq);
  //         } else {
  //           throw error;
  //         }
  //       } catch (err) {
  //         console.error('Error in authInterceptor:', err);
  //         throw err;
  //       }
  //     }
  //   );
  // };

  const authInterceptor = () => {
    console.log('interceptor');
  
    // Contador para controlar o número de tentativas de atualização do token
    let refreshAttempts = 0;
  
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        try {
          const originalReq = error.config;
  
          if (error.response?.status === 401 && originalReq && refreshAttempts === 0) {
            refreshAttempts++;
  
            const token = await AsyncStorage.getItem('TOKEN');
  
            if (!token) {
              // Handle the case when there is no token (e.g., user is not authenticated)
              // You might want to redirect to login or take appropriate action
              throw new Error('No token found');
            }
  
            const refreshResponse = await axios.put(`${BASE_URL_API}/auth/refresh`, { token });
            console.log(refreshResponse.data.access_token);
  
            // Atualize o token no AsyncStorage
            await AsyncStorage.setItem('TOKEN', refreshResponse.data.access_token);
  
            // Atualize o cabeçalho Authorization com o novo token
            originalReq.headers['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;
  
            // Tente a solicitação original novamente com o novo token
            const retryResponse = await axios(originalReq);
  
            // Redefina as tentativas de atualização para 0 após uma tentativa bem-sucedida
            refreshAttempts = 0;
  
            return retryResponse;
          } else {
            throw error;
          }
        } catch (err) {
          console.error('Error in authInterceptor:', err);
          // console.error('Error response:', err.response);
  
          // Se você quiser interromper a tentativa após um erro, defina refreshAttempts para 0
          refreshAttempts = 0;
  
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