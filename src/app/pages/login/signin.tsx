import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon, Text, Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../../types/user';
import { BASE_URL_API } from '../../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NavigationType } from '../../router/root-navigator';
import { useAuth } from '../../contexts/auth-context';
import { useProductContext } from '../../contexts/product-context';

export default function SignIn() {
    const navigation: NavigationType = useNavigation();
    const auth = useAuth();
    const productsContext = useProductContext();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        cpf: '',
    });

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const signIn = (): Promise<User | undefined> => {
        console.log('signin')
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${BASE_URL_API}/auth/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    reject(undefined);
                }

                const responseData = await response.json();

                console.log(responseData);
                const user = responseData;
                if (user.access_token) {
                    await productsContext.LoadProducts();
                    auth.setSignedIn(true);
                }

                await AsyncStorage.setItem('TOKEN', responseData.access_token);
                resolve(user);
            } catch (error) {
                reject(undefined);
            }
        });
    };

    const updateField = (fieldName: string, value: any) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    return (
        <SafeAreaView>
            <View style={styles.loginForm}>
                <Text h4 h4Style={{ color: 'gray', alignSelf: 'flex-start', marginLeft: 10, marginBottom: 15 }}>Login</Text>
                <Input
                    style={styles.input}
                    placeholder='Seu Email'
                    errorStyle={{ color: 'red' }}
                    errorMessage={""}
                    onChangeText={newText => updateField('username', newText)}
                />
                <Input
                    style={styles.input}
                    placeholder="Senha"
                    errorStyle={{ color: 'red' }}
                    errorMessage={""}
                    secureTextEntry={true}
                    onChangeText={newText => updateField('password', newText)}
                />
                <Button
                    title="Entrar"
                    loading={false}
                    loadingProps={{ size: 'small', color: 'white' }}
                    buttonStyle={{
                        backgroundColor: 'rgba(111, 202, 186, 1)',
                        borderRadius: 5,
                    }}
                    titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
                    containerStyle={{
                        marginHorizontal: 50,
                        height: 50,
                        width: 200,
                        marginVertical: 10,
                    }}
                    onPress={() => signIn()}
                />
                <Button
                    title="Já tenho conta"
                    loading={false}
                    buttonStyle={{
                        backgroundColor: 'transparent',
                    }}
                    titleStyle={{ fontWeight: 'bold', textDecorationLine: 'underline', color: 'blue' }}
                    onPress={() => navigation.navigate('Sign Up')}
                />
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
    input: {
        width: '80%',
    },
})