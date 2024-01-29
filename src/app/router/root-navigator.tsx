import React from "react";
import NonAuthRouter from "./nonAuth/non-auth-router";
import { useAuth } from "../contexts/auth-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AuthRouter from "./Auth/auth-router";

type RootStackParamList = {
    Home: undefined,
    Pagamento: undefined,
    "Sign Up": undefined,
    "Sign In": undefined,
};

export type NavigationType = NavigationProp<RootStackParamList>;

export default function RootNavigator() {
    const auth = useAuth();

    return (
        <>
            {!auth.signedIn ? (<NonAuthRouter />) : (< AuthRouter/>)}
        </>
    );
}