import * as React from 'react';
import { BASE_URL_API } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useProductContext } from './product-context';
import { User } from '../types/user';

interface AuthContextProps {
    signedIn: boolean;
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    getAccessToken: () => Promise<string | null>;
    updateAccessToken: (token: string) => void;
    checkIfIsAuthenticated: () => void;
    authInterceptor: () => void;
    firstInit: boolean;
    setFirstInit: React.Dispatch<React.SetStateAction<boolean>>;
    setUserInfo: React.Dispatch<React.SetStateAction<User | undefined>>;
    userInfo: User | undefined;
}

export const AuthContext = React.createContext<AuthContextProps>({} as AuthContextProps);

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    const [signedIn, setSignedIn] = React.useState<boolean>(false);
    const [firstInit, setFirstInit] = React.useState<boolean>(true);
    const [userInfo, setUserInfo] = React.useState<User | undefined>(undefined);

    const navigation = useNavigation();
    const productsContext = useProductContext();

    const setAccessToken = async (token: string) => {
        await AsyncStorage.setItem('TOKEN', token);
    };

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
        if (firstInit) {
            try {
                const token = await AsyncStorage.getItem('TOKEN');
                if (!token) { throw new Error("not Signed In") }

                const newToken = await updateAccessToken(token);

                if (newToken) {
                    console.log('has token');
                    await AsyncStorage.setItem('TOKEN', newToken);

                    const userInfo: string | null = await AsyncStorage.getItem('@User');
                    if (userInfo) setUserInfo(JSON.parse(userInfo));
                    console.log(userInfo)
                    
                    await productsContext.LoadProducts();
                    setSignedIn(true);
                }
            } catch (error) {
                navigation.navigate('Sign In');
            }
            finally {
                setFirstInit(false);
            }
        }
    }

    return (
        <AuthContext.Provider value={{
            signedIn,
            setSignedIn,
            getAccessToken,
            checkIfIsAuthenticated,
            updateAccessToken,
            authInterceptor,
            firstInit,
            setFirstInit,
            setUserInfo,
            userInfo
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = React.useContext(AuthContext);
    return context;
}