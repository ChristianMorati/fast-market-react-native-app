import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL_API } from "../../../../config";

type userLogin = {
    username: string,
    password: string
}

export type userAuth = {
    data: {
        id: number,
        username: string,
        name: string,
        cpf: string,
        access_token: string
    }
}

export const loginAsync = createAsyncThunk(
    "login/user",
    async (formData: any) => {
        const response = await new Promise<any>(async (resolve, reject) => {
            const fetchObj = await fetch(`${BASE_URL_API}/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if(!fetchObj.ok) reject(undefined);

            const responseData = await fetchObj.json();
            const user = responseData;
            resolve({
                data: { ...user }
            });
        })
        return response.data;
    }
)