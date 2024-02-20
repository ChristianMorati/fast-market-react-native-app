import { View, Text, TouchableOpacity } from "react-native";
import { useAppSelector } from "../../store/hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { logOff } from "../../store/user/actions";

const Settings = () => {
    const { userInfo } = useAppSelector((store) => store.user);
    const dispatch = useDispatch();

    return (
        <View
            className="flex-1 bg-indigo-200"
        >
            <View className="bg-white p-4 m-2 rounded-md">
                <View className=''>
                    <Text className='text-slate-900 font-semibold'>Email: {userInfo?.username}</Text>
                    <Text className='text-slate-900 font-semibold'>Nome: {userInfo?.name}</Text>
                    <Text className='text-slate-900 font-semibold'>CPF: {userInfo?.cpf}</Text>
                    <View className="flex mt-3">
                        <TouchableOpacity
                            className="bg-red-500 p-2 rounded-md"
                            onPress={() => dispatch(logOff())}
                        >
                            <Text className="font-bold text-lg text-center text-white">sair</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default Settings;