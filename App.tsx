import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { StatusBarStyle } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message'
import ProductProvider from './src/app/contexts/product-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentProvider from './src/app/contexts/payment-context';
import { STRIPE_KEY } from './config';
import RootNavigator from './src/app/router/root-navigator';
import { store } from './src/app/store';
import { Provider } from 'react-redux';


function App() {
  const STYLES = ['default', 'dark-content', 'light-content'] as const;
  const [statusBarStyle, setStatusBarStyle] = React.useState<StatusBarStyle>(STYLES[2]);

  return (
    <>
      <NavigationContainer>
        <ExpoStatusBar
          style={statusBarStyle === 'default' ? 'light' : 'light'}
          backgroundColor='black' />
        <StripeProvider publishableKey={STRIPE_KEY}>
          <PaymentProvider>
            <ProductProvider>
              <Provider store={store}>
                <RootNavigator />
              </ Provider>
            </ProductProvider>
          </PaymentProvider>
        </StripeProvider>
      </NavigationContainer>
      <Toast />
    </>
  );
}

export default App;