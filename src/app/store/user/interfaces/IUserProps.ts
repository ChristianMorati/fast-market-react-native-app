import { User } from "../../../types/user";

export interface IUserProps {
    signedIn: boolean;
    loading: boolean;
    userInfo: User;
    access_token: string,
}