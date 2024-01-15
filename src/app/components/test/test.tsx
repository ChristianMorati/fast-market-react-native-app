import { Text } from "@rneui/base";
import React, { useState } from "react";
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    TouchableOpacity,
    Keyboard,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

const Test = () => {
    const [text, setText] = useState("");

    return (
        <KeyboardAvoidingView contentContainerStyle={styles.container} behavior="position" enabled>
            <View style={styles.box}>
                <TextInput
                    placeholder="Mensagem"
                    placeholderTextColor={"#000000"}
                    style={styles.input}
                    onChangeText={(text) => setText(text)}
                />
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    onPress={() => {
                        // Fecha o teclado
                        Keyboard.dismiss();
                    }}
                >
                    <Text>OK</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    box: {
        width: "100%",
        height: 400,
    },
    input: {
        height: 40,
        borderColor: "#000000",
        borderWidth: 1,
        padding: 10,
    },
    button: {
        width: "100%",
        height: 40,
    },
});

export default Test;