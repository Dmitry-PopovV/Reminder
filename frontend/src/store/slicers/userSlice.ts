import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
    email: string,
    fullName: string
}

export type InitialState = {
    user: User | null | undefined
}
const initialState: InitialState = {
    user: undefined
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
