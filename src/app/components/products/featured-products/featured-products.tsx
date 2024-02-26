import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
import Product from '../../../models/productModel';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import { useProductContext } from '../../../contexts/product-context';
import { Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../store/hooks/useAppSelector';
import { addProductToCart } from '../../../store/cart/actions';

interface ProductItemProps {
    item: Product;
    style: any;
}

const width = Dimensions.get('window').width;

const ProductItem: React.FC<ProductItemProps> = ({ item, style }) => {
    const productContext = useProductContext();

    const { cartLength, cartProducts } = useAppSelector((store) => store.cart)
    const dispatch = useDispatch();

    const price = productContext.formatToCurrency(item?.unit_price);
    let [priceDezenas, priceCents] = price.slice(2).split(',');
    priceCents = ',' + priceCents.slice();

    return (
        <View className={`bg-white justify-between rounded-md h-100 w-50`} style={{ ...style }}>
            <Image
                className={`align-top object-contain rounded-t-md bg-white`}
                style={{
                    height: 150,
                    resizeMode: 'contain',
                }}
                source={{ uri: item?.url_img }}
            />
            <View className='p-1'>
                <View>
                    <Text className={`font-bold text-neutral-900 text-ellipsis`}
                        style={{ fontSize: 10 }}
                        numberOfLines={1}>
                        {item?.description.toUpperCase()}
                    </Text>
                </View>
                <View className='flex-row justify-between items-center pt-1'>
                    <Text className={`font-semibold text-xs text-green-900`}>
                        R$
                        <Text className={`text-lg font-bold`}>{priceDezenas}</Text>
                        {priceCents}
                    </Text>

                    {item.description.split(' ').includes("KG") ? (
                        <Text>{''}</Text>
                    ) : (
                        <>
                            {cartProducts && cartLength == 10 ? (
                                <Text className={`font-semibold font-sm text-white bg-slate-900 px-3 py-1 rounded-sm`}>
                                    <Ionicons size={14} name="md-cart-outline" color="white" />
                                    {' Cheio'}
                                </Text>
                            ) : (
                                <TouchableOpacity
                                    className={`bg-fuchsia-600 px-3 py-1 rounded-sm`}
                                    activeOpacity={.5}
                                    onPress={() => dispatch(addProductToCart({ ...item, quantity: 1 }))}
                                >
                                    <Text className='text-white'>
                                        <FontAwesome name="cart-arrow-down" size={16} />
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};



function FeaturedProducts() {
    const productContext = useProductContext();

    return (
        <ScrollView
            className=''
            horizontal
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 8 }}
        >
            {productContext?.products?.map((item, index) => (
                <ProductItem
                    key={index}
                    item={item}
                    style={{ width: width / 2.3, marginRight: 8 }}
                />
            ))}
        </ScrollView>
    );
}

export default FeaturedProducts;