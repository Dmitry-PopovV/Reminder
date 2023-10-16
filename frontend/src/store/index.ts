import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slicers/userSlice";
import { useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        user: userReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector = () => useSelector((state: RootState) => state.user.user);
