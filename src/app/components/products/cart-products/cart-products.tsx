import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { colors, globalStyles } from '../../../global-styles';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProductContext } from '../../../contexts/product-context';
import { Swipeable } from 'react-native-gesture-handler';
import { NavigationType } from '../../../router/root-navigator';
import { useDispatch } from 'react-redux';
import { removeProductFromCart } from '../../../store/cart/actions'
import { useAppSelector } from '../../../store/hooks/useAppSelector';
import { CartItem } from '../../../store/cart/initialState';


interface ProductItemProps {
    item: CartItem;
}

const ProductItem: React.FC<ProductItemProps> = ({ item }) => {
    const dispatch = useDispatch();
    const productContext = useProductContext();

    const leftAction = () => {
        return (
            <Pressable style={{
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
                height: 'auto',
                backgroundColor: 'red',
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                marginBottom: 2,
            }}
                onPress={() => {
                    dispatch(removeProductFromCart(item));
                }}
            >
                <Text>
                    <Feather name="trash-2" size={24} color="white" />
                </Text>
            </Pressable>
        )
    }

    return (
        <Swipeable
            renderLeftActions={leftAction}>
            <View style={styles.productContainer}>
                <View style={styles.descriptionContainer}>
                    <Image source={{ uri: item?.url_img }} style={[styles.image]} />
                    <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">{item?.description.toUpperCase()}</Text>
                    <Text style={{
                        backgroundColor: '#0077ff',
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        borderColor: 'white',
                        textAlign: 'center',
                        alignContent: 'center',
                        position: 'absolute',
                        top: 1,
                        left: -2,
                        color: 'white',
                        fontWeight: 'bold',
                    }}>{item.quantity}</Text>
                </View>
                <View style={[styles.descriptionContainer, {
                    borderTopWidth: 1,
                    borderStyle: 'dashed',
                    justifyContent: 'space-between',
                    paddingHorizontal: 3,
                }]}>
                    <Text style={styles.description}>{`${item.quantity} * ${productContext.formatToCurrency(item?.unit_price)}`}</Text>
                    <Text style={{
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: 'green',
                    }} numberOfLines={1} ellipsizeMode="middle">
                        {`${productContext.formatToCurrency(item.quantity * item?.unit_price)}`}
                    </Text>
                </View>
            </View>
        </Swipeable>
    );
};

const CartProducts = () => {
    const productContext = useProductContext();
    const navigation: NavigationType = useNavigation();
    const { cartSum, cartLength, cartProducts } = useAppSelector((store) => store.cart)

    return (
        <View style={styles.container}>
            <View style={styles.lineSolid}></View>
            <View style={globalStyles.cartHeaderContainer}>
                <Text style={styles.title} >Carrinho</Text>
                <Text style={[
                    cartLength < 10 ? { color: colors.secondaryColor } : { color: 'white' }
                    , {
                        fontWeight: 'bold',
                    }]}
                >
                    no carrinho: {cartLength ?? 0}</Text>
                <Text style={styles.simpleText}>máximo: 10</Text>
            </View>
            {cartLength == 0 ? (
                <View style={[styles.productContainer, { backgroundColor: colors.fiscalNoteColor }]}>
                    <Text style={{ fontWeight: '500', paddingVertical: 10 }}>Sem produtos.</Text>
                </View>
            ) : (
                <View>
                    <FlatList
                        data={cartProducts}
                        renderItem={({ item }) => (<ProductItem item={item} />)}
                        keyExtractor={(item, index) => index.toString()} // Use o índice como chave
                        contentContainerStyle={styles.flatListContent}
                    />
                    <View>
                        <View style={[styles.finalPriceContainer, styles.priceContainer]}>
                            <Text style={styles.finalPrice}>TOTAL:</Text>
                            <Text style={styles.finalPrice}>{productContext.formatToCurrency(cartSum)}</Text>
                        </View>
                    </View>
                    <View style={styles.containerFinalizar}>
                        <Pressable
                            style={[styles.buttonFinalizar]}
                            onPress={
                                () => {
                                    navigation.navigate('Pagamento');
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
        height: 'auto',
    },
    productContainer: {
        width: '100%',
        flexDirection: 'column',
        paddingHorizontal: 4,
        backgroundColor: colors.fiscalNoteColor,
        marginBottom: 2,
    },
    finalPriceContainer: {
        marginVertical: 1,
        padding: 6,
        backgroundColor: colors.fiscalNoteColor,
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
        marginVertical: 10,
    },
    image: {
        width: 50,
        height: 80,
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