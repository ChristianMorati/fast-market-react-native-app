export type amount = {
    amount: number;
};

export interface counterState {
    value: number;
}

export const initialState: counterState = {
    value: 0,
};