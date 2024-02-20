import { User } from "../../types/user";
import { IUserProps } from "./interfaces/IUserProps";

export const initialState: IUserProps = {
    signedIn: false,
    loading: false,
    userInfo: {} as User,
    access_token: '',
};