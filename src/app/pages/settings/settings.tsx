import { StyleSheet, View } from "react-native";
import { useAuth } from "../../contexts/auth-context";
import { Text, Button } from '@rneui/themed';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { SectionList } from "react-native";
import { colors } from "../../global-styles";

const Settings = () => {
    const auth = useAuth();

    const logOff = () => {
        AsyncStorage.removeItem('TOKEN');
        AsyncStorage.removeItem('@User');
        auth.setUserInfo(undefined);
        auth.setFirstInit(true);
        auth.setSignedIn(false);
    }

    const sections = [
        {
            title: 'Featured Products', data: [
                <View style={{
                    backgroundColor: '#2e2e2e',
                    borderRadius: 16,
                    padding: 16,
                }}>
                    <View style={{
                    }}>
                        <Text h4 h4Style={{ color: '#c6c6c6' }}>Minha Conta</Text>
                        <Text style={{ color: '#aaaaaa' }}>{auth.userInfo?.username}</Text>
                        <Text style={{ color: '#aaaaaa' }}>{auth.userInfo?.name}</Text>
                        <Text style={{ color: '#aaaaaa' }}>CPF: {auth.userInfo?.cpf}</Text>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10,
                    }}>
                        <Button
                            title="Sair"
                            loading={false}
                            loadingProps={{ size: 'small', color: 'white' }}
                            buttonStyle={{
                                backgroundColor: 'rgba(250, 0, 50, 1)',
                                borderRadius: 5,
                            }}
                            titleStyle={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}
                            containerStyle={{
                                height: 50,
                                width: 90,
                            }}
                            onPress={()=> logOff()}
                        />
                    </View>
                </View>]
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <SectionList
                style={{}}
                sections={sections}
                renderItem={({ item }) => item}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainAppColor,
        padding: 10,
    },
});


export default Settings;