import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable, Image } from 'react-native';
import { colors } from '../../../global-styles';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Scanner from '../../scanner/scanner';
import { useProductContext } from '../../../contexts/product-context';
import { AntDesign } from '@expo/vector-icons';
import { useRef } from 'react';
import { Button, Text } from '@rneui/themed';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const ProductBarCodeScanner: React.FC = () => {
  const [type, setType] = React.useState<string>('')
  const [data, setData] = React.useState<string>('')
  const [scannerActive, setScannerActive] = React.useState(false);

  const productContext = useProductContext();

  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      setScannerActive(true);

      return () => {
        setScannerActive(false);
      };
    }, [])
  );

  const onCodeScanned = (type: string, data: string) => {
    if (!modalVisible) {
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
    productContext.setProduct(undefined)
    setProductFoundedError('')
  }

  const [code, setCode] = React.useState('');
  const [productFounded, setProductFounded] = React.useState<Boolean>(false);
  const [productFoundedError, setProductFoundedError] = React.useState<string>('');
  const [isLoadingProduct, setIsLoadingProduct] = React.useState<Boolean>(false);
  const textInputRef = useRef<TextInput>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleInputChange = (text: string) => {
    setProductFoundedError('')
    return setCode(text);
  };

  const onCloseModal = () => {
    clearBarcodeData();
    setModalVisible(false);
  };

  const defineProduct = async () => {
    const productSearched = await productContext.getProductByCode(code);
    console.log(productSearched)

    if(!productSearched) {
      throw new Error("undefined");
    }

    productContext.setProduct(productSearched);
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
    if (code.length === 8 && !productContext.product) {
      searchForProduct()
      return;
    }
    setProductFounded(false);
  }, [code]);

  const ProductModal = () => {
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
                source={{ uri: productContext.product?.url_img }}
              />
              <View style={{ width: '100%', padding: 12 }}>
                <Text h4 style={{ alignSelf: 'flex-start', color: 'lightgray' }}>
                  Descrição
                </Text>
                <Text
                  style={[{ color: 'lightgray' }, styles.description]}
                  numberOfLines={2} ellipsizeMode="middle">
                  {productContext.product?.description}
                </Text>
                <Text
                  style={[styles.price, { alignSelf: 'flex-end', color: 'lightgreen' }]}>
                  {productContext.formatToCurrency(productContext.product?.unit_price ?? 0)}
                </Text>
                <View style={styles.containerAdicionar}>
                  <TouchableOpacity
                    style={styles.buttonAdicionar}
                    onPress={() => {
                      if (!productContext.product) return;
                      productContext.handleAddProductToCart(productContext.product);
                      onCloseModal();
                    }}>
                    <Text
                      style={styles.buttonAdicionarText}>
                      Adicionar ao Carrinho
                    </Text>
                  </TouchableOpacity>
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
    <View style={styles.container}>
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
      <View style={styles.scannedProductInfo}>

        {productFoundedError && (
          <View style={styles.containerErrorMessage}>
            <Text style={styles.errorMessage}>
              {productFoundedError} <Feather name="alert-triangle" size={12} color="yellow" />
            </Text>
          </View>
        )}

        {/* messages */}
        {isLoadingProduct && (
          <View style={styles.containerErrorMessage}>
            <Button
              title="Solid"
              color={'warning'}
              loading style={{
                width: 10,
                aspectRatio: '1/1',
                borderRadius: 6,
              }} />
          </View>
        )}

        {!productFoundedError && !productFounded && !isLoadingProduct && (
          <Text style={[styles.title, { textDecorationLine: 'underline', height: 30 }]}>ou</Text>
        )}
        {/*end messages */}

        {productFounded && (<ProductModal />)}

        <View style={styles.containerInputCode}>
          <TextInput
            style={styles.inputInsertCode}
            placeholder='Digite o Código'
            placeholderTextColor='white'
            keyboardType='numeric'
            onChangeText={handleInputChange}
            ref={textInputRef}
            value={code}
            maxLength={8}
          />
          <TouchableOpacity
            style={styles.buttonLimpar}
            onPress={() => {
              clearBarcodeData();
            }}
          >
            <Feather name="trash-2" size={24} color="white" />
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
  scannerArea: {
    backgroundColor: 'transparent',
  },
  BarCodeScannerContainerStyle: {
    height: 300,
    borderRadius: 15,
    backgroundColor: 'black',
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
    backgroundColor: colors.secondaryColor,
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