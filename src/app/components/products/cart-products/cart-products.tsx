import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { colors, globalStyles } from '../../../global-styles';
import Product from '../../../models/productModel';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProductContext } from '../../../contexts/product-context';
import { Swipeable } from 'react-native-gesture-handler';

interface ProductItemProps {
    item: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ item }) => {
    const productContext = useProductContext();

    const leftAction = () => {

        return (
            <Pressable style={{
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
                height: 'auto',
                backgroundColor: 'red',
                marginVertical: 1,
            }}
                onPress={() => {
                    productContext.handleRemoveFromCart(item)
                    console.log(item);
                }}
            >
                <Text>
                    <Feather name="trash-2" size={24} color="white" />
                </Text>
            </Pressable>
        )
    }

    return (
        <Swipeable renderLeftActions={leftAction}>
            <View style={styles.productContainer}>
                <View style={styles.descriptionContainer}>
                    <Image source={{ uri: item?.url_img }} style={[styles.image]} />
                    <Text style={styles.description} numberOfLines={1} ellipsizeMode="middle">{item?.description.toUpperCase()}</Text>
                </View>
                <View style={[styles.descriptionContainer, {
                    borderTopWidth: 1,
                    borderStyle: 'dashed',
                    justifyContent: 'space-between',
                    paddingHorizontal: 3,
                }]}>
                    <Text></Text>
                    <Text style={{
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: 'green',
                    }} numberOfLines={1} ellipsizeMode="middle">{productContext.formatToCurrency(item?.unit_price)}</Text>
                </View>
            </View>
        </Swipeable>
    );
};

const CartProducts: React.FC = () => {
    const productContext = useProductContext();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.lineSolid}></View>
            <View style={globalStyles.cartHeaderContainer}>
                <Text style={styles.title} >Carrinho</Text>
                <Text style={[
                    { fontWeight: 'bold' },
                    productContext.cartProducts.length < 10 ? { color: colors.secondaryColor } : { color: 'red' }
                ]}
                >
                    no carrinho: {productContext.cartProducts.length}</Text>
                <Text style={styles.simpleText}>max: 10</Text>
            </View>
            {productContext.cartProducts.length == 0 ? (
                <View style={[styles.productContainer, { backgroundColor: colors.fiscalNoteColor }]}>
                    <Text style={{ fontWeight: '500', paddingVertical: 10 }}>Sem produtos.</Text>
                </View>
            ) : (
                <View>
                    <FlatList
                        data={productContext.cartProducts}
                        renderItem={({ item }) => (<ProductItem item={item} />)}
                        keyExtractor={(item) => item.code}
                        contentContainerStyle={styles.flatListContent}
                    />
                    <View>
                        <View style={[styles.finalPriceContainer, styles.priceContainer]}>
                            <Text style={styles.finalPrice}>TOTAL:</Text>
                            <Text style={styles.finalPrice}>{productContext.formatToCurrency(productContext.sumProducts)}</Text>
                        </View>
                    </View>
                    <View style={styles.containerFinalizar}>
                        <Pressable
                            style={[styles.buttonFinalizar]}
                            onPress={
                                () => {
                                    productContext.setIsScannerAlive(false);
                                    navigation.navigate('Payment');
                                }}>
                            <Text style={[styles.buttonFinalizarText]}>Finalizar</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        height: 'auto',
    },
    productContainer: {
        backgroundColor: 'white',
        flexDirection: 'column',
        paddingHorizontal: 4,
        marginVertical: 1,
    },
    finalPriceContainer: {
        marginVertical: 1,
        padding: 6,
        backgroundColor: colors.fiscalNoteColor,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerFinalizar: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    title: {
        fontWeight: '500',
        fontSize: 18,
        color: colors.title,
        paddingVertical: 4,
    },
    simpleText: {
        color: 'white',
        fontWeight: 'bold'
    },
    lineDashed: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        width: '100%',
    },
    lineSolid: {
        borderTopColor: '#7F8A7D',
        borderTopWidth: 1,
        borderStyle: 'solid',
        width: '100%',
        marginTop: 6,
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 8,
        marginRight: 2,
    },
    description: {
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'green',
    },
    minusPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    finalPrice: {
        borderTopColor: 'white',
        fontWeight: 'bold',
        paddingVertical: 8,
        textTransform: 'uppercase',
    },
    messageError: {
        marginLeft: 14,
        fontWeight: '500',
        fontSize: 18,
        color: 'red',
    },
    cartContainer: {
        flex: 1,
        marginTop: 20,
    },
    cartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    flatListContent: {
        justifyContent: 'center',
    },
    buttonFinalizar: {
        backgroundColor: colors.secondaryColor,
        borderRadius: 8,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonFinalizarText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CartProducts;