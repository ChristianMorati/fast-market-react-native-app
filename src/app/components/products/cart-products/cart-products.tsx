import React from 'react';
import { View, Text, FlatList, Image, Pressable, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProductContext } from '../../../contexts/product-context';
import { Swipeable } from 'react-native-gesture-handler';
import { NavigationType } from '../../../router/root-navigator';
import { useDispatch } from 'react-redux';
import { addProductToCart, removeProductFromCart } from '../../../store/cart/actions'
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
            <Pressable
                className='flex justify-center items-center bg-red-500 rounded-l-md'
                style={{
                    width: 50,
                }}
                onPress={() => {
                    setTimeout(() => {
                        dispatch(removeProductFromCart(item));
                    }, 200)
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
            <View className='bg-white p-2 border-b border-neutral-300'>
                <View className='flex-row items-center'>
                    <Text
                        className='absolute z-10 left-0 top-1 font-bold text-white bg-fuchsia-600 border border-white px-2'>
                        {item.quantity}
                    </Text>
                    <View
                        className='absolute z-10 right-0 top-1 flex flex-row'
                    >
                        <TouchableOpacity className='w-6 py-1'
                            onPress={() => dispatch(addProductToCart({ ...item, quantity: 1 }))}>
                            <Text className='text-white text-center bg-green-600 rounded-s-md'>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='p-2 py-1 bg-white'>
                            <Text className=''>{item?.quantity}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-6 py-1'
                            onPress={() => dispatch(removeProductFromCart(item))}>
                            <Text className='text-white text-center bg-red-500 rounded-s-md'>-</Text>
                        </TouchableOpacity>
                    </View>
                    <Image source={{ uri: item?.url_img }}
                        className=''
                        style={{
                            width: 50,
                            height: 80,
                            resizeMode: 'contain',
                            marginBottom: 8,
                            marginRight: 2,
                        }}
                    />
                    <View className=''>
                        <Text
                            className='font-semibold text-xs'
                            numberOfLines={1} ellipsizeMode="tail">
                            {item?.description.toUpperCase()}
                        </Text>
                    </View>
                </View>
                <View className='flex-row justify-between'>
                    <Text className='font-medium text-xs'>
                        {`${item.quantity} * ${productContext.formatToCurrency(item?.unit_price)}`}
                    </Text>
                    <Text
                        className='font-bold text-green-700'
                        numberOfLines={1} ellipsizeMode="middle"
                    >
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
    const { cartSum, cartLength, cartProducts } = useAppSelector((store: { cart: any; }) => store.cart)

    return (
        <View className='bg-white p-2 rounded-md m-2 mt-0'>
            <View className="flex-row justify-between items-center">
                <Text className='font-semibold text-black text-lg'>Carrinho</Text>
                <Text
                    className={`font-semibold text-black text-md ${cartLength < 10 ? 'text-green-700' : 'text-black'}`}
                >
                    no carrinho: {cartLength ?? 0}
                </Text>
                <Text className='font-semibold text-black text-md'>máximo: 10</Text>
            </View>
            {cartLength == 0 ? (
                <View className='bg-white rounded-sm'>
                    <Text className='p-2'>Sem produtos.</Text>
                </View>
            ) : (
                <View>
                    <FlatList
                        data={cartProducts}
                        renderItem={({ item }) => (<ProductItem item={item} />)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <View className='flex-row justify-between px-2 bg-white'>
                        <Text className='font-semibold py-4'>TOTAL:</Text>
                        <Text className='font-semibold py-4'>{productContext.formatToCurrency(cartSum)}</Text>
                    </View>
                    <View className="flex justify-center items-center my-4">
                        <TouchableOpacity
                            className="bg-green-500 justify-center items-center rounded-xl px-6 py-4 h-100"
                            onPress={() => {
                                navigation.navigate('Pagamento');
                            }}>
                            <Text className="text-white font-bold text-md">Finalizar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default CartProducts;