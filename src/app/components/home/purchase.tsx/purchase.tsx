import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Image } from "react-native";
import { useAppSelector } from "../../../store/hooks/useAppSelector";
import { useEffect } from "react";
import { Loading } from "../../../components/loading";
import { useDispatch } from "react-redux";
import { loadPurchaseAsync } from "../../../store/purchase/thunks";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigation } from "@react-navigation/native";

function ProductItem({ props }: any) {
    const { item, qtt_items, width } = props;
    return (
        <View
            className={`border-neutral-200 border rounded`}
            style={{ width: width, aspectRatio: 1, marginRight: 8 }}
        >
            <View className={`px-1 top-0 right-[7px] text-xs absolute z-10`}>
                <Text className={`rounded-sm bg-slate-950 px-1 text-xs absolute font-semibold text-center text-white`}>{qtt_items}</Text>
            </View>
            <Image className={`object-contain w-100 h-100 bg-white rounded-sm`}
                style={{ width: '100%', height: '100%' }}
                source={{ uri: item?.url_img }}
            />
        </View>
    )
}

interface ErrorIndicatorProps {
    onReload: () => void;
    errorText: string
}

const ErrorIndicator = ({ onReload, errorText }: ErrorIndicatorProps) => {
    return (
        <View className="flex items-center p-2">
            <Text className="font-semibold text-center text-[14px]">{errorText}</Text>
            <TouchableOpacity onPress={onReload} className="p-2 rounded-md bg-red-400 mt-3">
                <Text style={{ color: '#fff', fontSize: 16 }}>Recarregar</Text>
            </TouchableOpacity>
        </View>
    );
}

export function Purchase({ data, cta }: any) {
    return (
        <View className={`bg-white px-2 border-slate-300 border-b-[1px]`}>
            {
                data ? (
                    <>
                        <View className={`px-2 pt-1 flex flex-row justify-end`}>
                            {cta}
                        </View>
                        <ScrollView
                            style={{ marginHorizontal: -10 }}
                            horizontal
                            decelerationRate="normal"
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 16, paddingRight: 10 }}
                        >
                            <View style={{ flexDirection: 'row', position: 'relative', zIndex: 1 }}>
                                {data.items.map((item: any, index: number) => (
                                    <ProductItem key={index} props={{ item: item.product, qtt_items: item.qtt_items, width: 100 }} />
                                ))}
                            </View>
                        </ScrollView>
                        <View className={`flex-row justify-between p-2 mb-0`}>
                            <Text className={`font-semibold`}>Total:<Text className={`font-semibold`}> R$ {data.total}</Text></Text>
                        </View>
                    </>
                ) : (
                    <>
                        {/* <ErrorIndicator
                            onReload={() => dispatch(loadPurchaseAsync())}
                            errorText={"Ocorreu um erro ao carregar a sua última compra."}
                        /> */}
                    </>
                )}
        </View>
    )
}

