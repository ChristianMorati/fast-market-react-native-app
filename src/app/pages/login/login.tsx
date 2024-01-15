import React, { useEffect } from 'react';
// import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
// import FeaturedProducts from '../../components/products/featured-products/featured-products';
// import { colors } from '../../global-styles';
// import { useAuth } from '../../contexts/auth-context/auth-context';

// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';

// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     statusCodes,
//   } from '@react-native-google-signin/google-signin'

// WebBrowser.maybeCompleteAuthSession();


// function Login() {

//     const { isLogged, setIsLogged, singIn } = useAuth();

//     const [userInfo, setUserInfo] = React.useState(null);
//     const [request, response, promptAsync] = Google.useAuthRequest({
//         androidClientId: "",
//         iosClientId: "620948389013-dmampn6uh73hnndmqlb27vaah2an0tn5.apps.googleusercontent.com",
//         webClientId: "620948389013-bffgnf1j063tslu0lrnjd8dso5ukt1j8.apps.googleusercontent.com",
//     })

//     const navigation = useNavigation();

//     // React.useEffect(() => {
//     //     handleSingInWithGoogle()
//     // }, [response])

//     // React.useEffect(() => {
//     //     navigation.navigate('Home');
//     // }, [userInfo])

//     const getUserInfo = async (token: string | null) => {
//         if (!token) return;

//         let url = `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${token}`;

//         try {
//             console.log('try');
//             const response = await fetch(url);
//             const user = await response.json();
//             await AsyncStorage.setItem("@user", JSON.stringify(user));
//             setUserInfo(user);
//             console.log(user);

//         } catch (error) {
//             console.log('error');
//         }
//     }

//     async function handleSingInWithGoogle() {
//         const user = await AsyncStorage.getItem('@user');
//         if (!user) {
//             if (response?.type === 'success') {
//                 await getUserInfo(response?.authentication?.accessToken ?? null);
//             }
//         } else {
//             setUserInfo(JSON.parse(user));
//         }
//     }

// const sections = [
//     {
//         title: 'Featured Products', data: [<FeaturedProducts />]
//     },
// ];

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin'
import { View } from 'react-native';

function Auth() {
    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        webClientId: 'YOUR CLIENT ID FROM GOOGLE CONSOLE',
    })

    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={async () => {
                try {
                    await GoogleSignin.hasPlayServices()
                    const userInfo = await GoogleSignin.signIn()
                    console.log(JSON.stringify(userInfo))
                    // if (userInfo.idToken) {
                    //     const { data, error } = await supabase.auth.signInWithIdToken({
                    //         provider: 'google',
                    //         token: userInfo.idToken,
                    //     })
                    //     console.log(error, data)
                    // } else {
                    //     throw new Error('no ID token present!')
                    // }
                } catch (error: any) {
                    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                        // user cancelled the login flow
                    } else if (error.code === statusCodes.IN_PROGRESS) {
                        // operation (e.g. sign in) is in progress already
                    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                        // play services not available or outdated
                    } else {
                        // some other error happened
                    }
                }
            }}
        />
    )
}


export default function login () {
    return (
        <View>
            <Auth />
        </View>
    )
}