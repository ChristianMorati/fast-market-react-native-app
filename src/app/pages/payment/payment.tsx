import React from 'react';
import { Alert, Image, Pressable, SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native';
import { useProductContext } from '../../contexts/product-context';
import { usePaymentContext } from '../../contexts/payment-context';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';


type PaymentMethod = {
  method: string,
  description: string,
  img: string,
  action: any,
}

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod,
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ paymentMethod }) => {
  return (
    <Pressable style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: 'white',
      borderRadius: 8,
      marginVertical: 3,
    }}
      onPress={
        () => paymentMethod.action()
      }
    >
      <Text>{paymentMethod.description}</Text><Image source={{ uri: paymentMethod.img }} style={{ width: 40, aspectRatio: '1/1' }} />
    </Pressable>
  )
}

const Payment: React.FC = () => {
  const productContext = useProductContext();
  const paymentContext = usePaymentContext();


  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
        {/* <Text style={styles.title}>Selecione o Método de Pagamento</Text> */}
      </View>
      <FlatList data={[
        {
          method: 'pix',
          description: 'PIX',
          img: 'https://logospng.org/download/pix/logo-pix-icone-256.png',
          action: () => {
            productContext.showToast('success', 'PIX', `executando a função do PIX ${productContext.sumProducts}`);
          }
        },
        {
          method: 'credit_card',
          description: 'Cartão de crédito',
          img: 'https://cdn-icons-png.flaticon.com/256/5163/5163845.png',
          action: () => {
            paymentContext.onCheckout(productContext.sumProducts)
          }
        },
      ]}
        renderItem={({ item }) => (<PaymentMethodCard paymentMethod={item} />)}
        contentContainerStyle={{}}
      />
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontWeight: '500',
    fontSize: 18,
    paddingVertical: 4,
  },
});

export default Payment;