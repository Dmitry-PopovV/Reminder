import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
    email: string,
    fullName: string
}

export type InitialState = {
    user: User | null
}
const initialState: InitialState = {
    user: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;