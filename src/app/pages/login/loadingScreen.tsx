import { Text } from '@rneui/themed';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL_API } from '../../../../config';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useProductContext } from '../../contexts/product-context';

export default function LoadingScreen() {
    const [firstInit, setFirstInit] = React.useState<boolean>(true);
    const [isLoadingApp, setIsLoadingApp] = React.useState<boolean>(true);

    const auth = useAuth();
    const navigation = useNavigation();
    const productsContext = useProductContext();

    const authInterceptor = () => {
        let refreshAttempts = 0;

        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                try {
                    const originalReq = error.config;

                    if (error.response?.status === 401 && originalReq && refreshAttempts === 0) {
                        refreshAttempts++;

                        const token = await AsyncStorage.getItem('TOKEN');

                        if (!token) {
                            throw new Error('No token found');
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


    const updateATToken = async (token: string) => {
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
        if (firstInit) {
            try {
                const token = await AsyncStorage.getItem('TOKEN');
                if (!token) { throw new Error("not Signed In") }

                const newToken = await updateATToken(token);

                if (newToken) {
                    await AsyncStorage.setItem('TOKEN', newToken);
                    await productsContext.LoadProducts()
                    auth.setSignedIn(true);
                }

                console.log('has token');
            } catch (error) {
                console.log(error);
                navigation.navigate('Sign In');
            }
            finally {
                setFirstInit(false);
            }
        }
    }

    useEffect(() => {
        checkIfIsAuthenticated();
        authInterceptor();
    }, [])


    return (
        <SafeAreaView>
            <View style={styles.loginForm}>
                <Text h1 h1Style={{}}>Loading Screen</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loginForm: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
});