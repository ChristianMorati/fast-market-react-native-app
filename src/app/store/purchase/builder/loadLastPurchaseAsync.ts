import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { loadPurchaseAsync } from "../thunks";


const loadLastPurchaseAsyncBuilder = (
    builder: ActionReducerMapBuilder<any>,
) => {
    builder
        .addCase(loadPurchaseAsync.fulfilled, (state, payload) => {
            state.lastPurchase = payload.payload.lastPurchase
            state.loading = false;

            // (async () => {
            //     await AsyncStorage.setItem('@User', JSON.stringify(user));
            //     await AsyncStorage.setItem('TOKEN', access_token);
            // })()
        })
        .addCase(loadPurchaseAsync.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(loadPurchaseAsync.rejected, (state, action) => {
            state.loading = false;
        })
}

export default loadLastPurchaseAsyncBuilder;