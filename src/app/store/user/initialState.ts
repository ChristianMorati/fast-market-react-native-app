export type CartItem = {
    id: number;
    code: string;
    description: string;
    unit_price: number;
    price: number;
    url_img: string;
    quantity: number;
};

export interface CartState {
    cartProducts: CartItem[];
    cartLength: number;
    cartSum: number;
}

export const initialState: CartState = {
    cartProducts: [],
    cartLength: 0,
    cartSum: 0,
};