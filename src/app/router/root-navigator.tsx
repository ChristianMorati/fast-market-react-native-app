import React from "react";
import NonAuthRouter from "./nonAuth/non-auth-router";
import { NavigationProp } from "@react-navigation/native";
import AuthRouter from "./Auth/auth-router";
import { useAppSelector } from "../store/hooks/useAppSelector";

type RootStackParamList = {
    Home: undefined,
    Pagamento: undefined,
    "Sign Up": undefined,
    "Sign In": undefined,
};

export type NavigationType = NavigationProp<RootStackParamList>;

export default function RootNavigator() {
    const { signedIn } = useAppSelector((store) => store.user);

    return (
        <>
            {!signedIn ? (<NonAuthRouter />) : (< AuthRouter />)}
        </>
    );
}