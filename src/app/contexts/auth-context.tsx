import * as React from 'react';
import { BASE_URL_API } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


type User = {
    email: string,
    password: string
}

interface AuthContextProps {
    isLogged: boolean;
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
    getAccessToken: () => Promise<string | null>
    // singIn: () => void
}

export const AuthContext = React.createContext<AuthContextProps>({} as AuthContextProps);

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    // const [userInfo, setUserInfo] = React.useState(null);
    // const [request, response, promptAsync] = Google.useAuthRequest({
    //     androidClientId: "",
    //     iosClientId: "620948389013-dmampn6uh73hnndmqlb27vaah2an0tn5.apps.googleusercontent.com",
    //     webClientId: "620948389013-bffgnf1j063tslu0lrnjd8dso5ukt1j8.apps.googleusercontent.com",
    // })

    // async function singIn() {
    //     const client_id = '620948389013-bffgnf1j063tslu0lrnjd8dso5ukt1j8.apps.googleusercontent.com';
    //     const redirect_uri = 'https://auth.expo.io/@christianmorati/fast-market';
    //     const response_type = 'token';
    //     const scope = encodeURI('profile email');

    //     console.log('im here')

    //     const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;

    //     try {
    //         let result = await WebBrowser.openAuthSessionAsync(googleOAuthUrl, redirect_uri);
    //         console.log(result);

    //         // Handle the result here
    //         if (result.type === 'success') {
    //             console.log(result)
    //         } else {
    //             console.log('deu ruim')
    //             // Handle different types of results (cancelation, etc.) here
    //         }
    //     } catch (error) {
    //         // Handle error if any
    //         console.error(error);
    //     }
    // }

    const BaseUrlApi: string = `${BASE_URL_API}/auth`;

    const [isLogged, setIsLogged] = React.useState<boolean>(false);
    
    const [isTokenExpired, setIsTokenExpired] = React.useState<boolean>(false);
    const [accessToken, setAT] = React.useState<string>("");
    const [isLoadingApp, setIsLoadingApp] = React.useState<boolean>(true);

    React.useEffect(() => {
        AsyncStorage.setItem('TOKEN', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM0LCJ1c2VybmFtZSI6ImRAZ2R6bXNzeHd4c3dzZGRhZGlsLmNvM20iLCJpYXQiOjE3MDU0MzgwMjgsImV4cCI6MTcwNTQzODA4OH0.Or-FZkA5vri8Pgv_Hm7CvB8HDZqzqOmn8HSQgHTz6Gw");
      }, []);

    const setAccessToken = async (token: string) => {
        await AsyncStorage.setItem('TOKEN', token);
    };

    const getAccessToken = async (): Promise<string | null> => {
        const accessToken = await AsyncStorage.getItem('TOKEN');
        return accessToken;
    };

    // const renewAccessToken = async () => {

    //     const token = getAccessToken();
    //     // if (!token) { navigation.navigate(['Products']) };
        
    //     console.log(token);
    //     return new Promise(async (resolve, reject) => {
    //         const response = await axios.put(`${BaseUrlApi}/refresh`, REQUEST_CONFIG);

    //         if (response.status === 401) {
    //             setIsLoadingApp(false);
    //             // navigation.navigate(['Products']);
    //         };

    //         if (response.status !== 200) { reject(undefined); }

    //         setAT(response.data.access_token);
    //         resolve(true);
    //     });
    // };

    // renewAccessToken();


    // React.useEffect(() => {
    //     renewAccessToken();
    // }, [])

    // React.useEffect(() => {
    //     if(isTokenExpired) {
    //         renewAccessToken();
    //     }
    // })

    return (
        <AuthContext.Provider value={{ isLogged, setIsLogged, getAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = React.useContext(AuthContext);
    return context;
}