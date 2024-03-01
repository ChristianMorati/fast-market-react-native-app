import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Entypo } from '@expo/vector-icons';
import { useProductContext } from "../../../contexts/product-context";
import { Image } from "react-native";
import { useAppSelector } from "../../../store/hooks/useAppSelector";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Loading } from "../../../components/loading";
import { useDispatch } from "react-redux";
import { loadPurchaseAsync } from "../../../store/purchase/thunks";

function ProductItem({ props }: any) {
    const { item, index, width } = props;
    return (
        <View
            className={``}
            style={{ width: width, aspectRatio: 1, marginRight: 8 }}
        >
            <View className={`px-1 top-1 right-2 text-xs absolute z-10`}>
                <Text className={`rounded-md bg-slate-950 px-1 text-xs absolute font-semibold text-center text-white`}>{(index).toString()}</Text>
            </View>
            <Image className={`object-contain w-100 h-100 bg-white rounded-md`}
                style={{ width: '100%', height: '100%' }}
                source={{ uri: item?.url_img }}
            />
        </View>
    )
}

export function LastPurchase() {
    const productContext = useProductContext();
    const products = productContext.products;
    const { lastPurchase, loading, } = useAppSelector((store) => store.purchase)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadPurchaseAsync());
    }, []);

    return (
        <View className={`rounded-md bg-white mx-2 mb-2 relative`}>
            {loading ? (
                // {
                //         lastPurchase.length === 1 ? (
                //             <>
                //                 <View className="flex-row justify-between mx-2">
                //                     <Text className="p-2 text-lg font-semibold text-right">Compra anterior</Text>
                //                     <Text className="p-2 pt-3 font-medium">12/12/2024</Text>
                //                 </View>
                //                 <ScrollView
                //                     style={{ marginHorizontal: -10 }}
                //                     horizontal
                //                     decelerationRate="normal"
                //                     showsHorizontalScrollIndicator={false}
                //                     contentContainerStyle={{ paddingLeft: 16, paddingRight: 10 }}
                //                 >
                //                     <View style={{ flexDirection: 'row', position: 'relative', zIndex: 1 }}>
                //                         {lastPurchase.map((item: any, index: number) => (
                //                             <ProductItem key={index} props={{ item: item, index: index, width: 80 }} />
                //                         ))}
                //                     </View>
                //                 </ScrollView>

                //                 <View className={`pt-1 p-2 flex-row justify-between m-2 mb-1`}>
                //                     <Text className={`font-semibold`}>Total:<Text className={`font-semibold`}> R$ 129,90</Text></Text>
                //                     <TouchableOpacity
                //                         className={`bg-fuchsia-600 rounded-md py-1 px-4`}
                //                         activeOpacity={.5}
                //                     >
                //                         <Text className={`font-semibold text-white`}>histórico</Text>
                //                     </TouchableOpacity>
                //                 </View>
                //             </>
                //         ) : (
                //             <View className={`rounded-md bg-neutral-100 p-4`}>
                //                 <Text className={`font-semibold text-neutral-500 text-center`}>Suas compras aparecem aqui!</Text>
                //                 <Text className={`font-semibold text-neutral-500 text-center pt-1`}>
                //                     <Entypo name="emoji-happy" size={24} />
                //                 </Text>
                //             </View>
                //         )
                //     }
                // ) : (
                <Loading />
            ) : (<></>)}
        </View>
    );
};