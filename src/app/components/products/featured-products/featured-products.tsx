import React, { useContext, useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '@rneui/themed';
import { colors, globalStyles } from '../../../global-styles';
import Product from '../../../models/productModel';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import { useProductContext } from '../../../contexts/product-context';


interface ProductItemProps {
    item: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ item }) => {
    const productContext = useProductContext();

    return (
        <View style={styles.productContainer}>
            <Image
                source={{ uri: item?.url_img }}
                style={styles.image}
            />
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item?.description.toUpperCase()}</Text>
            <View style={{}}>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{productContext.formatToCurrency(item?.unit_price)}</Text>

                    {productContext.cartProducts.length < 9 ? (
                        <TouchableOpacity
                            style={[globalStyles.button, styles.addToCart]}
                            onPress={() => productContext.handleAddProductToCart(item)}
                        >
                            <FontAwesome name="cart-arrow-down" size={16} color="white" />
                        </TouchableOpacity>
                    ) : <Text style={[globalStyles.button, styles.fullCart]}>
                        <Ionicons name="md-cart-outline" size={14} color="white" /> Cheio</Text>}
                </View>
            </View>
        </View>
    );
};

const FeaturedProducts: React.FC = () => {
    const productContext = useProductContext();

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <FlatList
                    ListHeaderComponent={<Text h4 h4Style={{ color: 'white' }}>Produtos em Destaque</Text>}
                    data={productContext.products}
                    renderItem={({ item }) => (
                        <ProductItem item={item} />
                    )}
                    keyExtractor={(item) => item.code}
                    contentContainerStyle={null}
                    numColumns={2}
                />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 6,
        height: 'auto',
        padding: 3,
    },
    image: {
        height: 140,
        resizeMode: 'contain',
        backgroundColor: 'white',
        // borderTopRightRadius: 10,
        // borderTopLeftRadius: 10,
    },
    productContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.productFooter,
        borderColor: 'black',
        margin: 2,
        justifyContent: 'space-between'
        // borderRadius: 10,
    },
    containerReload: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    title: {
        fontWeight: '500',
        fontSize: 18,
        color: colors.title,
        paddingLeft: 4,
    },
    description: {
        fontSize: 11,
        textAlign: 'center',
        paddingHorizontal: 2,
        fontWeight: '600',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: 'black',
    },
    messageError: {
        marginLeft: 14,
        fontWeight: '500',
        fontSize: 18,
        color: 'red',
    },
    addToCart: {
        backgroundColor: '#7D0E7C',
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignSelf: 'flex-end'
    },
    fullCart: {
        backgroundColor: '#7D0E7C',
        color: 'white',
    }
});

export default FeaturedProducts;