import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';
import { BASE_URL_API } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

type Intent = {
  paymentIntent: string
}

interface PaymentContextProps {
  paymentIntent: Intent | undefined;
  setPaymentIntent: Dispatch<SetStateAction<Intent | undefined>>;
  makePaymentIntent: (amount: number) => Promise<Intent | undefined>;
  onCheckout: (amount: number) => void;
}

export const PaymentContext = createContext<PaymentContextProps>({} as PaymentContextProps);

export default function PaymentProvider({ children }: { children: ReactNode }) {
  const [paymentIntent, setPaymentIntent] = useState<Intent | undefined>(undefined);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const navigation = useNavigation();

  const makePaymentIntent = async (Amount: number): Promise<Intent | undefined> => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const response = await axios.post(`${BASE_URL_API}/payment/intent`,
        {
          amount: Amount,
          currency: 'brl',
          automatic_payment_methods: {
            enabled: true
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.data
      setPaymentIntent(data)
      return data;
    } catch (error) {
      setPaymentIntent(undefined)
      return undefined;
    }
  };

  const onCheckout = async (amount: number) => {
    try {
      const paymentIntent = await makePaymentIntent(50);

      if (!paymentIntent) return Alert.alert('error');

      const initResponse = await initPaymentSheet({
        merchantDisplayName: 'mercadinho_do_zé',
        paymentIntentClientSecret: paymentIntent.paymentIntent,
      });

      console.log(initResponse)
      if (initResponse.error) {
        return Alert.alert('error ' + initResponse.error);
      }

      const paymentResponse = await presentPaymentSheet();
      if (paymentResponse.error) {
        return Alert.alert(paymentResponse.error.code, paymentResponse.error.message);
      };

      Alert.alert("Pagamento realizado!", 'Everything`s fine :)');

    } catch (error) {
      return Alert.alert("try catch error");
    }

    navigation.navigate('Home');
    // register on db a transaction
  };

  return (
    <PaymentContext.Provider value={{
      paymentIntent,
      setPaymentIntent,
      makePaymentIntent,
      onCheckout
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentContext() {
  const context = React.useContext(PaymentContext);
  return context;
}