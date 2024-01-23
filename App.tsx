import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import type { StatusBarStyle } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message'
import ProductProvider from './src/app/contexts/product-context';
import AuthProvider, { useAuth } from './src/app/contexts/auth-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentProvider from './src/app/contexts/payment-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL_API, STRIPE_KEY } from './config';
import RootNavigator from './src/app/router/root-navigator';

function App() {
  const STYLES = ['default', 'dark-content', 'light-content'] as const;
  const [statusBarStyle, setStatusBarStyle] = React.useState<StatusBarStyle>(STYLES[2]);

  const [firstInit, setFirstInit] = React.useState<boolean>(true);
  const auth = useAuth();

  const authInterceptor = () => {

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

  React.useEffect(()=>{

    async function checkIfIsAuthenticated() {
      if(firstInit) {
        try {
          const token = await AsyncStorage.getItem('TOKEN');
          if(!token) { throw new Error("not Signed In")}
          auth.setSignedIn(true);
          console.log('has token')
        } catch (error) {}
        finally {
          setFirstInit(false);
        }
      }
    }
    authInterceptor();
    checkIfIsAuthenticated();

  }, [])


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
                <RootNavigator />
              </AuthProvider>
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