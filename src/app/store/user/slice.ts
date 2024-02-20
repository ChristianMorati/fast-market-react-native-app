import { createSlice } from '@reduxjs/toolkit';
import loginAsyncBuilder from './builder/loginAsync';
import { initialState } from './initialState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserProps } from './interfaces/IUserProps';
import { User } from '../../types/user';

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logOff(state: IUserProps) {
            AsyncStorage.removeItem('TOKEN');
            AsyncStorage.removeItem('@User');
            state.signedIn = false;
            state.userInfo = {} as User;
        },
        setSignedIn(state, action) {
            state.signedIn = action.payload;
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
    },
    extraReducers: (builder) => {
        loginAsyncBuilder(builder);
    },
});