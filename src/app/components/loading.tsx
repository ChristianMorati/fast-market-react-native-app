import { ActivityIndicator, View } from "react-native";
import colors from 'tailwindcss/colors';

export function Loading() {
    return (
        <View className="items-center justify-center bg-white rounded-md p-4 h-[100%]">
            <ActivityIndicator color={colors.fuchsia[500]} className="w-10"/>
        </View>
    )
}