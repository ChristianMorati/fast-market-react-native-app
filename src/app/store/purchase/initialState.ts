
export type PurchaseState = {
    lastPurchase: any,
    allPurchases: any,
    loading: boolean,
    loadingAllPurchases: boolean,
}

export const initialState: PurchaseState = {
    lastPurchase: [],
    allPurchases: [],
    loading: true,
    loadingAllPurchases: true,
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