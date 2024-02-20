import { useNavigation } from "@react-navigation/native"
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

    const buttons: buttonType = {
        "comprar": {
            color: 'bg-slate-900',
            textColor: 'text-white',
            action: () => navigation.navigate('Comprar')
        },
        "last": {
            color: 'bg-slate-700',
            textColor: 'text-white',
            action: () => navigation.navigate('Comprar')
        },
        "comppee": {
            color: 'bg-slate-500',
            textColor: 'text-white',
            action: () => navigation.navigate('Comprar')
        },
        "ladfgst": {
            color: 'bg-slate-300',
            textColor: 'text-white',
            action: () => navigation.navigate('Comprar')
        },
    };


    return (
        <>
            <ScrollView
                className={`pl-2 mb-2`}
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
        </>
    )
}