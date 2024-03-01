import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL_API } from "../../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadPurchaseAsync = createAsyncThunk(
    "loadLast/purchase",
    async () => {
        const response = await new Promise<any>(async (resolve, reject) => {
            const user = await AsyncStorage.getItem('@User').then(res => JSON.parse(res!));

            if(!user) {
                console.log('failed to load user');
            }

            const { id } = user;

            const fetchObj = await fetch(`${BASE_URL_API}/purchase/last/${id}`);

            if(!fetchObj.ok) reject(undefined);

            const responseData = await fetchObj.json();
            const lastPurchase = responseData;
            console.log(lastPurchase)
            resolve({
                data: { lastPurchase }
            });
        })
        return response.data;
    }
)