import { createSlice } from "@reduxjs/toolkit";
import { initialState } from './initialState';
import loadLastPurchaseAsyncBuilder from "./builder/loadLastPurchaseBuilder";
import loadAllPurchasesBuilder from "./builder/loadAllPurchasesBuilder";

export const purchaseSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // logOff(state: IUserProps) {
        //     AsyncStorage.removeItem('TOKEN');
        //     AsyncStorage.removeItem('@User');
        //     state.signedIn = false;
        //     state.userInfo = {} as User;
        // },
        // setSignedIn(state, action) {
        //     state.signedIn = action.payload;
        // },
        // setUserInfo(state, action) {
        //     state.userInfo = action.payload;
        // },
    },
    extraReducers: (builder) => {
        loadLastPurchaseAsyncBuilder(builder)
        loadAllPurchasesBuilder(builder)
    },
});