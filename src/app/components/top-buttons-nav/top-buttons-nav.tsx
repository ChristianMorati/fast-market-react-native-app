import { useNavigation } from "@react-navigation/native"
import React from "react";
import { Text } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";


export function TopButtonsNav() {
    const navigation = useNavigation();
    type buttonType = {
        [key: string]: {
            color: string;
            textColor: string;
            action: () => void;
        };
    };

    const color = 'green';

    const buttons: buttonType = {
        "comprar": {
            color: `bg-${color}-900`,
            textColor: 'text-white',
            action: () => navigation.navigate('Comprar')
        },
        "last": {
            color: `bg-${color}-700`,
            textColor: 'text-white',
            action: () => navigation.navigate('Comprar')
        },
        "comppprar": {
            color: `bg-${color}-500`,
            textColor: 'text-white',
            action: () => navigation.navigate('Comprar')
        },
        "ladfgst": {
            color: `bg-${color}-300`,
            textColor: 'text-black',
            action: () => navigation.navigate('Comprar')
        },
    };


    return (
        <ScrollView
            className={`pl-2`}
            horizontal
            snapToInterval={10}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
        >
            {Object.keys(buttons).map((key: string, item: any) => (
                <TouchableOpacity
                    className={`px-4 py-1 mr-2 rounded-md ${buttons[key].color}`}
                    key={item}
                    onPress={buttons[key].action}>
                    <Text className={`font-semibold ${buttons[key].textColor}`}>{key}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}