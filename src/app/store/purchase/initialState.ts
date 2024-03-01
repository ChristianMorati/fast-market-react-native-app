import AsyncStorage from "@react-native-async-storage/async-storage"


export type PurchaseState = {
    lastPurchase: any,
    loading: boolean
}

export const initialState: PurchaseState = {
    lastPurchase: [],
    loading: true,
}

// (async function () {
//     let lastPurchase = await AsyncStorage.getItem('lastPurchase')
//     lastPurchase = JSON.parse(lastPurchase!);
//     if (lastPurchase?.length !== 0) {
//         this.loading = false;
//         return lastPurchase;
//     }
//     return undefined;
// })(),