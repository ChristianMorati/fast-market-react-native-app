import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { loginAsync } from "../thunks";
import { IUserProps } from "../interfaces/IUserProps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";


const loginAsyncBuilder = (
    builder: ActionReducerMapBuilder<IUserProps>,
) => {
    builder
        .addCase(loginAsync.fulfilled, (state, action) => {
            const { access_token, ...user } = action.payload;

            state.access_token = access_token;
            state.userInfo = user;
            state.signedIn = true;

            (async () => {
                await AsyncStorage.setItem('@User', JSON.stringify(user));
                await AsyncStorage.setItem('TOKEN', access_token);
            })()

            state.loading = false;
        })
        .addCase(loginAsync.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(loginAsync.rejected, (state, action) => {
            state.loading = false;
            Alert.alert('Opss!', "verifique as suas credenciais!");
        })
}

export default loginAsyncBuilder;