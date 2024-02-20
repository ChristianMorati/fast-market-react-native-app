import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable, Image, Alert, Text } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Scanner from '../../scanner/scanner';
import { useProductContext } from '../../../contexts/product-context';
import { AntDesign } from '@expo/vector-icons';
import { useRef } from 'react';
import { Button } from '@rneui/themed';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../store/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { addProductToCart } from '../../../store/cart/actions';
import { CartItem } from '../../../store/cart/initialState';
import AlertModal from './modal';
import colors from 'tailwindcss/colors';
import { ActivityIndicator } from 'react-native';

const ProductBarCodeScanner: React.FC = () => {
  const dispatch = useDispatch();
  const productContext = useProductContext();
  const { cartLength, cartProducts } = useAppSelector((store) => store.cart);

  const canAdd = 10 - cartLength;

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [type, setType] = React.useState<string>('');
  const [data, setData] = React.useState<string>('');
  const [scannerActive, setScannerActive] = React.useState(false);
  const [code, setCode] = React.useState('');

  const [productFounded, setProductFounded] = React.useState<Boolean>(false);
  const [productFoundedError, setProductFoundedError] = React.useState<string>('');
  const [isLoadingProduct, setIsLoadingProduct] = React.useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const [product, setProduct] = React.useState<CartItem | undefined>(undefined);

  useFocusEffect(
    React.useCallback(() => {
      setScannerActive(true);

      return () => {
        setScannerActive(false);
      };
    }, [])
  );

  const onCodeScanned = (type: string, data: string) => {
    if (canAdd === 0) {
      return Alert.alert(
        'Eba!',
        `O carrinho está cheio!\nVocê está pronto para seguir para o pagamento!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Pagamento'),
          },
        ],
      );
    }

    if (!modalVisible) {
      if (type == "256") {
        let productObj = JSON.parse(data);
        console.log(productObj);
        setProduct(productObj);
        setProductFounded(true);
        setModalVisible(true);
        return;
      }
      setType(type);
      setData(data);
      setCode(data);
    }
  };

  const clearBarcodeData = () => {
    setType('');
    setData('');
    setCode('');
    setProductFounded(false);
    setProduct(undefined);
    setProductFoundedError('');
  }

  const handleInputChange = (text: string) => {
    setProductFoundedError('');
    return setCode(text);
  };

  const onCloseModal = () => {
    clearBarcodeData();
    setModalVisible(false);
  };

  const defineProduct = async () => {
    const productSearched = await productContext.getProductByCode(code);
    console.log(productSearched);

    if (!productSearched) {
      throw new Error("undefined");
    }

    setProduct(productSearched);
    setProductFounded(true);
    textInputRef.current?.blur();
    setModalVisible(true);
    setProductFoundedError('');
  };

  const searchForProduct = async () => {
    setIsLoadingProduct(true);

    try {
      await defineProduct();
    } catch (error) {
      setProductFoundedError('Produto não encontrado');
      setProductFounded(false);
    }
    setIsLoadingProduct(false);
  };

  useEffect(() => {
    if (code.length === 8 && canAdd === 0) {
      // return productContext.showToast('error', "Opss...", "Carrinho cheio!");
      return Alert.alert(
        'Eba!',
        `O carrinho está cheio!\nVocê está pronto para seguir para o pagamento!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Pagamento'),
          },
        ],
      );
    }

    if (code.length === 8 && canAdd >= 1) {
      searchForProduct();
      return;
    }
    setProductFounded(false);
  }, [code]);

  type AddButtonProps = {
    quantity: number,
    decrement: () => void,
    increment: () => void,
  }

  function AddButton({ quantity, decrement, increment }: AddButtonProps) {
    return (
      <>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ textAlign: 'center', borderRadius: 3, marginVertical: 4, paddingHorizontal: 5, backgroundColor: 'lightgray' }}>
            {product?.quantity ?? quantity}
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            style={[styles.decrementButton]}
            onPress={() => decrement()}>
            <Text style={styles.buttonText}>{" - "}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.centerButton}
            onPress={() => {
              if (!product) return;
              if (canAdd === 0) return;
              dispatch(addProductToCart({ ...product, quantity: quantity }));
              onCloseModal();
            }}>
            <Text style={styles.buttonText}>{"Adicionar"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.incrementButton]}
            onPress={() => increment()}>
            <Text style={styles.buttonText}>{" + "}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const ProductModal = () => {
    const [quantity, setQuantity] = useState(1);

    const increment = () => setQuantity((state) => {
      if (canAdd >= 1 && state < canAdd) {
        return state + 1;
      }
      Alert.alert(
        'Opss..!',
        `Você só pode adicionar mais ${canAdd} item${canAdd > 1 ? 's' : ''}!\nItens no carrinho: ${cartLength}`,
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          },
        ],
      );

      return state;
    });
    const decrement = () => setQuantity((state) => state > 1 ? state - 1 : state);

    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            clearBarcodeData();
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                style={styles.modalImage}
                source={{ uri: product?.url_img }}
              />
              <View style={{ width: '100%', padding: 12 }}>
                <Text style={{ alignSelf: 'flex-start', color: 'lightgray' }}>Descrição</Text>
                <Text
                  style={[{ color: 'lightgray' }, styles.description]}
                  numberOfLines={2} ellipsizeMode="middle">
                  {product?.description}
                </Text>


                {product!.description.split(' ').includes("KG") && code.length === 8 &&
                  (
                    <Text
                      style={[styles.price, { alignSelf: 'flex-end', color: 'lightgreen' }]}>
                      {productContext.formatToCurrency(product?.unit_price ?? 0)}
                    </Text>
                  )
                }

                {product!.description.split(' ').includes("KG") && code.length !== 8 &&
                  (
                    <Text
                      style={[styles.price, { alignSelf: 'flex-start', color: 'lightgreen' }]}>
                      Total: {`${product?.quantity} * ${product?.unit_price} = ${productContext.formatToCurrency(product!.quantity * product!.unit_price)}`}
                    </Text>
                  )
                }

                {product!.description.split(' ').includes("UN") &&
                  (
                    <Text
                      style={[styles.price, { alignSelf: 'flex-start', color: 'lightgreen' }]}>
                      {`${quantity} * ${product?.unit_price}\nTotal = ${productContext.formatToCurrency(quantity * product!.unit_price)}`}
                    </Text>
                  )
                }

                <View style={styles.containerAdicionar}>

                  {canAdd >= 1 && product!.description.split(' ').includes("KG") ? (
                    <TouchableOpacity
                      style={styles.centerButton}
                      onPress={() => {
                        if (!product) return;
                        dispatch(addProductToCart({ ...product, quantity: product.quantity ? product.quantity : 1 }));
                        onCloseModal();
                      }}
                    >
                      <Text style={styles.buttonText}>{"Adicionar"}</Text>
                    </TouchableOpacity>
                  ) : (
                    <AddButton quantity={quantity} decrement={decrement} increment={increment} />
                  )}

                </View>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  onCloseModal();
                }}>
                <Text style={styles.buttonCloseText}>
                  <AntDesign name="close" size={12} color="white" />
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View >
    )
  }

  return (
    <View className='flex-1 m-2 border border-neutral-300 rounded-md p-2 bg-neutral-50'>
      {cartLength === 10 && (<AlertModal cta={() => navigation.navigate('Pagamento')} />)}

      <Text className='font-semibold text-black text-xl text-center'>Ler código</Text>

      <View style={styles.scannerArea}>
        {scannerActive && isFocused && (
          <Scanner
            onCodeScanned={onCodeScanned}
            clearBarcodeData={clearBarcodeData}
            BarCodeScannerContainerStyle={{ ...styles.BarCodeScannerContainerStyle }}
            BarCodeScannerReScanButtonStyle={{ ...styles.BarCodeScannerReScanButtonStyle }}
          />
        )}

        {!data && (
          <View style={[styles.containerErrorMessage, {
            position: 'absolute',
            top: 5,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }]}>
            <Text style={[styles.errorMessage]}>
              <MaterialCommunityIcons
                name="barcode-scan" size={16} color="white" />
            </Text>
          </View>
        )}
      </View>

      <View
        className=''
      >
        {productFoundedError && (
          <Text
            className='font-medium text-white bg-neutral-400 border border-yellow-200 text-center rounded-md py-4 my-1'
          >
            {productFoundedError} <Feather name="alert-triangle" size={12} color="yellow" />
          </Text>
        )}

        {/* messages */}
        {isLoadingProduct && (
          <ActivityIndicator className='p-2 my-2 w-full' />
        )}

        {!productFoundedError && !productFounded && !isLoadingProduct && (
          <Text className='font-semibold text-lg underline text-center'>ou</Text>
        )}
        {/*end messages */}

        {productFounded && (<ProductModal />)}

        <View className="flex-row justify-start rounded-lg overflow-hidden">
          <TextInput
            className="bg-neutral-200 p-2 font-medium text-white"
            style={{ width: '85%' }}
            placeholder='Digite o Código'
            placeholderTextColor='black'
            keyboardType='numeric'
            onChangeText={handleInputChange}
            ref={textInputRef}
            value={code}
          />
          <TouchableOpacity
            className="bg-slate-900 flex justify-center items-center p-2"
            style={{ width: '15%' }}
            activeOpacity={0.5}
            onPress={clearBarcodeData}
          >
            <Feather name="trash-2" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonText: { textAlign: 'center', borderRadius: 3, marginVertical: 4, color: 'white', fontWeight: 'bold', fontSize: 16, },
  incrementButton: {
    backgroundColor: '#3e3e3e',
    padding: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  centerButton: {
    backgroundColor: '#5c5c5c',
    color: 'white',
    padding: 10,
    marginHorizontal: 1,
  },
  decrementButton: {
    backgroundColor: '#3e3e3e',
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  scannerArea: {
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  BarCodeScannerContainerStyle: {
    height: 300,
    borderRadius: 15,
    backgroundColor: colors.slate[900],
  },
  BarCodeScannerReScanButtonStyle: {
    padding: 12,
    backgroundColor: 'red',
    borderRadius: 8,
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'column',
    textAlign: 'center',
  },
  containerTitle: {
    alignItems: 'center',
  },
  reScanButtonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 10,
  },
  reScanButton: {
    marginVertical: 12,
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 12,
  },
  reScanButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scannedProductInfo: {
  },
  descriptionContainer: {
    backgroundColor: '#484848',
    width: '80%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  description: {
    marginTop: 2,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  containerErrorMessage: {
    alignItems: 'center',
  },
  errorMessage: {
    marginTop: 10,
    fontSize: 12,
    textTransform: 'uppercase',
    color: 'white',
    backgroundColor: 'black',
    borderColor: 'yellow',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    color: 'lightgreen',
    paddingVertical: 6,
  },
  containerAdicionar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonAdicionar: {
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonAdicionarText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonLimpar: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  containerInputCode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputInsertCode: {
    width: '85%',
    backgroundColor: '#7F8A7D',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    color: 'white',
  },

  // MODAL
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    width: 300,
    borderColor: 'rgba(255, 255, 255, .3)', // Vermelho com 50% de opacidade
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#080808',
    justifyContent: 'flex-start',
    // borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 10,
  },
  modalImage: {
    width: '100%',
    aspectRatio: '1/1',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: 'black'
  },
  button: {
    position: 'absolute',
    right: 3,
    top: 3,
    padding: 10,
    elevation: 2,
    borderRadius: 6,
  },
  buttonClose: {
    backgroundColor: 'red'
  },
  buttonCloseText: {
    fontWeight: 'bold',
  },
});

export default ProductBarCodeScanner;