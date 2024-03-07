import { Text } from 'react-native';
import { useAppSelector } from '../../store/hooks/useAppSelector';
import React, { useEffect } from 'react';
import { SectionList, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Loading } from '../../components/loading';
import { useDispatch } from 'react-redux';
import { loadAllPurchasesAsync } from '../../store/purchase/thunks';
import { FlatList } from 'react-native-gesture-handler';
import { Purchase } from '../../components/home/purchase.tsx/purchase';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';


function PurchaseHystory() {
    const { loadingAllPurchases, allPurchases } = useAppSelector(store => store.purchase)
    const sections = [
        {
            data: [<></>]
        }
    ];

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadAllPurchasesAsync())
    }, [])

    return (
        <SafeAreaView className=''>
            {loadingAllPurchases ? (
                <Loading />
            ) : (
                <>
                    {allPurchases.map((purchase: any, index: number) => {
                        return (
                            <View key={index}>
                                <Purchase data={purchase} cta={
                                    <Text className="font-medium">
                                        {formatDistanceToNow(purchase.createdAt, { locale: ptBR, addSuffix: true })}
                                    </Text>
                                } />
                            </View>
                        )
                    })}
                </>
            )}
        </SafeAreaView>
    );
}

export default PurchaseHystory;
