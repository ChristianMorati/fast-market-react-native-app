import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '@rneui/themed';
import { colors, globalStyles } from '../../../global-styles';
import Product from '../../../models/productModel';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import { useProductContext } from '../../../contexts/product-context';

import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';


interface ProductItemProps {
    item: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ item }) => {
    const productContext = useProductContext();

    const price = productContext.formatToCurrency(item?.unit_price);
    let [priceDezenas, priceCents] = price.slice(2).split(',');
    priceCents = ',' + priceCents.slice();

    return (
        <View style={styles.productContainer}>
            <Image
                source={{ uri: item?.url_img }}
                style={styles.image}
            />
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item?.description.toUpperCase()}</Text>
            <View style={{}}>
                <View style={styles.priceContainer}>
                    <Text style={[styles.price, { fontWeight: '500' }]}>
                        R$
                        <Text style={[styles.price, { fontSize: 18 }]}>{priceDezenas}</Text>
                        {priceCents}
                    </Text>

                    {productContext.cartProducts && productContext.cartProducts.length == 10 ? (
                        <Text style={[globalStyles.button, styles.fullCart]}>
                            <Ionicons name="md-cart-outline" size={14} color="white" />Cheio
                        </Text>
                    ) :
                        <TouchableOpacity
                            style={[globalStyles.button, styles.addToCart]}
                            onPress={() => productContext.handleAddProductToCart(item)}
                        >
                            <FontAwesome name="cart-arrow-down" size={16} color="white" />
                        </TouchableOpacity>}
                </View>
            </View>
        </View>
    );
};


function Index() {
    const width = Dimensions.get('window').width;
    const productContext = useProductContext();
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <View style={{
            flex: 1, justifyContent: 'center',
            alignItems: 'start',
        }}>
            <Carousel
                style={{ width: width }}
                width={width / 2 - 10}
                loop={false}
                height={200}
                autoPlay={false}
                data={productContext?.products ?? []}
                scrollAnimationDuration={200}
                onSnapToItem={(index) => setCurrentIndex(index)}
                renderItem={({ item, index }) => (
                    <View
                        style={{
                            marginLeft: 10,
                        }}
                    >
                        <ProductItem item={item} />
                    </View>
                )}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 8 }}>
                {productContext.products?.map((_, index) => (
                    <View
                        key={index}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: index === currentIndex ? 'rgb(43, 117, 255)' : 'gray',
                            marginHorizontal: 4,
                        }}
                    />
                ))}
            </View>
        </View>
    );
}

const width = Dimensions.get('window').width;

const FeaturedProducts: React.FC = () => {
    return (
        <Index />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 'auto',
    },
    image: {
        width: '100%',
        height: width / 3,
        resizeMode: 'contain',
        backgroundColor: 'white',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    productContainer: {
        backgroundColor: colors.productFooter,
        borderColor: 'black',
        justifyContent: 'space-between',
        height: '100%',
        borderRadius: 6,
        paddingBottom: 4,
    },
    description: {
        fontSize: 11,
        textAlign: 'center',
        paddingHorizontal: 2,
        fontWeight: '600',
        color: 'lightgray'
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
        color: 'lightgray'
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