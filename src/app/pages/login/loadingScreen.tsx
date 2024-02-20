import { Text } from '@rneui/themed';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useProductContext } from '../../contexts/product-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL_API } from '../../../../config';
import { setSignedIn, setUserInfo } from '../../store/user/actions';

export default function LoadingScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const productsContext = useProductContext();

    const getAccessToken = async (): Promise<string | null> => {
        const accessToken = await AsyncStorage.getItem('TOKEN');
        return accessToken;
    };

    const authInterceptor = () => {
        let refreshAttempts = 0;

        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                try {
                    const originalReq = error.config;

                    if (error.response?.status === 401 && originalReq && refreshAttempts === 0) {
                        refreshAttempts++;

                        const token = await getAccessToken();

                        if (!token) {
                            throw new Error("cdde");
                            // navigation.navigate('Sign In');
                        }

                        const refreshResponse = await axios.put(`${BASE_URL_API}/auth/refresh`, { token });
                        console.log(refreshResponse.data.access_token);

                        await AsyncStorage.setItem('TOKEN', refreshResponse.data.access_token);
                        originalReq.headers['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;
                        const retryResponse = await axios(originalReq);
                        refreshAttempts = 0;

                        return retryResponse;
                    } else {
                        throw error;
                    }
                } catch (err) {
                    console.error('Error in authInterceptor:', err);
                    refreshAttempts = 0;
                    throw err;
                }
            }
        );
    };


    const updateAccessToken = async (token: string) => {
        try {
            const response = await fetch(`${BASE_URL_API}/auth/refresh`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token })
            });

            const responseData = await response.json();

            if (response.status !== 201) {
                throw new Error("error: " + response.status);
            }

            await AsyncStorage.setItem('TOKEN', responseData.access_token);
            return responseData.access_token;
        } catch (error) {
            throw new Error(`RT expired!: ${error}`);
        }
    };


    async function checkIfIsAuthenticated() {
        try {
            const token = await AsyncStorage.getItem('TOKEN');
            if (!token) { throw new Error("not Signed In") }
            console.log(token)

            const newToken = await updateAccessToken(token);

            if (newToken) {
                await AsyncStorage.setItem('TOKEN', newToken);
                const userString = await AsyncStorage.getItem('@User');
                const user = JSON.parse(userString);
                dispatch(setSignedIn({ signedIn: true }));
                dispatch(setUserInfo({ userInfo: user }));

                await productsContext.LoadProducts();
            }
        } catch (error) {
            navigation.navigate('Sign In');
        }
    }

    useEffect(() => {
        checkIfIsAuthenticated();
        authInterceptor();
    }, [])

    return (
        <SafeAreaView>
            <View className='bg-slate-900 flex-1 items-center justify-center'>
                <Text className='text-slate-50'>Loading Screen</Text>
            </View>
        </SafeAreaView>
    );
};