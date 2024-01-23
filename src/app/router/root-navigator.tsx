import React from "react";
import NonAuthRouter from "./nonAuth/non-auth-router";
import AuthRouter from "./Auth/auth-router";
import { useAuth } from "../contexts/auth-context";


export default function RootNavigator() {
    const auth = useAuth();

    if (!auth.signedIn) return (<NonAuthRouter />);
    if (auth.signedIn) return (<AuthRouter />);
};
