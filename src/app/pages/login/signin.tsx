import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationType } from '../../router/root-navigator';
import { useDispatch } from 'react-redux';
import { loginAsync } from '../../store/user/thunks';
import { useAppSelector } from '../../store/hooks/useAppSelector';
import colors from 'tailwindcss/colors';


export default function SignIn() {
    const navigation: NavigationType = useNavigation();
    const dispatch = useDispatch();
    const { loading } = useAppSelector((store) => store.user);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const updateField = (fieldName: string, value: any) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    return (
        <SafeAreaView className="bg-slate-900 flex-1 justify-center align-middle">
            <View className={`p-2`}>
                <Text
                    className={`pl-3 text-xl font-semibold text-slate-200`}>
                    Login
                </Text>
                <Input
                    className='text-white'
                    placeholder='Seu Email'
                    errorStyle={{ color: 'red' }}
                    errorMessage={""}
                    onChangeText={(newText: string) => updateField('username', newText)}
                />
                <Input
                    placeholder="Senha"
                    errorStyle={{ color: 'red' }}
                    errorMessage={""}
                    secureTextEntry={true}
                    onChangeText={(newText: string) => updateField('password', newText)}
                />
                <View className={`flex justify-center align-middle p-2`}>
                    <Button
                        title="Entrar"
                        loading={loading}
                        loadingProps={{ size: 'small', color: 'white' }}
                        buttonStyle={{
                            backgroundColor: 'rgba(111, 202, 186, 1)',
                            borderRadius: 5,
                        }}
                        onPress={() => { dispatch(loginAsync(formData)) }}
                    />
                    <Button
                        title="Criar uma nova conta"
                        loading={false}
                        buttonStyle={{
                            backgroundColor: 'transparent',
                        }}
                        titleStyle={{ fontWeight: 'bold', textDecorationLine: 'underline', color: colors.cyan[500] }}
                        onPress={() => navigation.navigate('Sign Up')}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};