import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Button, ViewStyle, TouchableOpacity } from 'react-native';
import { BarCodeScanner, BarCodeEvent } from 'expo-barcode-scanner';
import { ProductContext } from '../../contexts/product-context';

interface ScannerProps {
  onCodeScanned: (type: string, data: string) => void;
  clearBarcodeData: () => void;
  BarCodeScannerContainerStyle: ViewStyle;
  BarCodeScannerReScanButtonStyle: ViewStyle;
}


const Scanner: React.FC<ScannerProps> = ({ onCodeScanned, clearBarcodeData, BarCodeScannerContainerStyle, BarCodeScannerReScanButtonStyle }) => {
  const { isScannerAlive } = useContext(ProductContext);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (isScannerAlive) {
      const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      };
      getBarCodeScannerPermissions();
    }
  }, []);

  if (hasPermission === null) {
    return (
      <View style={{ ...BarCodeScannerContainerStyle, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Solicitando permissão da câmera</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={{ ...BarCodeScannerContainerStyle, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Sem acesso a câmera</Text>
      </View>
    )
  }

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    if (isScannerAlive) {
      setScanned(true);
      onCodeScanned(type, data);
    }
  };

  return (
    <View style={{ ...BarCodeScannerContainerStyle }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <TouchableOpacity
          style={{ ...BarCodeScannerReScanButtonStyle }}
          onPress={() => {
            setScanned(false);
            clearBarcodeData();
          }}>
          <Text style={styles.buttonText}>Re-Escanear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Scanner;