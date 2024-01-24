import React from "react";
import NonAuthRouter from "./nonAuth/non-auth-router";
import AuthRouter from "./Auth/auth-router";
import { useAuth } from "../contexts/auth-context";
import { NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
    Home: undefined,
    Pagamento: undefined,
    "Sign Up": undefined,
    "Sign In": undefined,
};

export type NavigationType = NavigationProp<RootStackParamList>;

export default function RootNavigator() {
    const auth = useAuth();

    if (!auth.signedIn) return (<NonAuthRouter />);
    if (auth.signedIn) return (<AuthRouter />);
};
