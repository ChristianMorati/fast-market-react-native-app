import { StyleSheet, View } from "react-native";
import { useAuth } from "../../contexts/auth-context";
import { Button } from "@rneui/base";
import { Text } from '@rneui/themed';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { SectionList } from "react-native";
import { colors } from "../../global-styles";

const LogOff = () => {
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
                    marginBottom: 10,
                    backgroundColor: 'white',
                    borderWidth: .3,
                    borderRadius: 4,
                    padding: 16,
                }}>
                    <Text h4 h4Style={{}}>Minha Conta</Text>
                    <Text>{auth.userInfo?.username}</Text>
                    <Text>{auth.userInfo?.name}</Text>
                    <Text>CPF: {auth.userInfo?.cpf}</Text>
                    <View>
                        <Button
                            style={{
                                backgroundColor: 'red'
                            }}
                            title={"Sair"}
                            onPress={() => logOff()}
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


export default LogOff;