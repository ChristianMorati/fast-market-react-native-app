import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon, Text, Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../../types/user';
import { BASE_URL_API } from '../../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/auth-context';
import { NavigationType } from '../../router/root-navigator';
import { useProductContext } from '../../contexts/product-context';

export default function SignUp() {
    const navigation: NavigationType = useNavigation();
    const productsContext = useProductContext();
    const auth = useAuth();

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


    const signUp = async () => {
        try {
            const response = await fetch(`${BASE_URL_API}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Signup failed with status: ${response.status}`);
            }

            const responseData = await response.json();

            console.log(responseData);
            const user = responseData;
            const { access_token, ...userInfo } = user; 

            if (user.access_token) {
                await AsyncStorage.setItem('@User', JSON.stringify(userInfo));
                auth.setUserInfo(userInfo);
                await AsyncStorage.setItem('TOKEN', responseData.access_token);
                await productsContext.LoadProducts();
                auth.setSignedIn(true);
            }
            return responseData;
        } catch (error) {
            console.error('Error during sign up:', error);
            throw new Error('Sign up failed');
        }
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
                <Text h4 h4Style={{ color: 'gray', alignSelf: 'flex-start', marginLeft: 10, marginBottom: 15 }}>Novo Usuário</Text>
                <Input
                    style={styles.input}
                    placeholder='Seu Nome'
                    errorStyle={{ color: 'red' }}
                    errorMessage={""}
                    onChangeText={newText => updateField('name', newText)}
                />
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
                <Input
                    style={styles.input}
                    placeholder='Seu CPF'
                    errorStyle={{ color: 'red' }}
                    errorMessage={""}
                    onChangeText={newText => updateField('cpf', newText)}
                    keyboardType='numeric'
                />
                <Button
                    title="Cadastrar-se"
                    loading={false}
                    loadingProps={{ size: 'small', color: 'white' }}
                    buttonStyle={{
                        backgroundColor: 'rgba(111, 202, 186, 1)',
                        borderRadius: 5,
                    }}
                    titleStyle={{ fontWeight: 'bold' }}
                    containerStyle={{
                        height: 50,
                        width: 200,
                    }}
                    onPress={() => {
                        signUp()
                            .then(user => {
                                console.log('Sign up successful:', user);
                            })
                            .catch(error => {
                                console.error('Sign up failed:', error);
                            })
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loginForm: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
    },
})