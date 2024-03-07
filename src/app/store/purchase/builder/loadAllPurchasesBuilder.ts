import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { loadAllPurchasesAsync } from "../thunks";


const loadAllPurchasesBuilder = (
    builder: ActionReducerMapBuilder<any>,
) => {
    builder
        .addCase(loadAllPurchasesAsync.fulfilled, (state, payload) => {
            state.allPurchases = payload.payload.allPurchases
            state.loadingAllPurchases = false;
        })
        .addCase(loadAllPurchasesAsync.pending, (state, action) => {
            state.loadingAllPurchases = true;
        })
        .addCase(loadAllPurchasesAsync.rejected, (state, action) => {
            state.loadingAllPurchases = false;
        })
}

export default loadAllPurchasesBuilder;