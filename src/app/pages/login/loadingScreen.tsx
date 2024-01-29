import { Text } from '@rneui/themed';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/auth-context';

export default function LoadingScreen() {
    const auth = useAuth();

    useEffect(() => {
        auth.checkIfIsAuthenticated();
        auth.authInterceptor();
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