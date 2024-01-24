import * as React from 'react';
import { BASE_URL_API } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
    signedIn: boolean;
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    getAccessToken: () => Promise<string | null>
}

export const AuthContext = React.createContext<AuthContextProps>({} as AuthContextProps);

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    const [signedIn, setSignedIn] = React.useState<boolean>(false);
    // const [userInfo, setUserInfo] = React.

    const setAccessToken = async (token: string) => {
        await AsyncStorage.setItem('TOKEN', token);
    };

    const getAccessToken = async (): Promise<string | null> => {
        const accessToken = await AsyncStorage.getItem('TOKEN');
        return accessToken;
    };

    return (
        <AuthContext.Provider value={{
            signedIn,
            setSignedIn,
            getAccessToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = React.useContext(AuthContext);
    return context;
}