import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slicers/userSlice";
import eventsReducer from "./slicers/eventsSlice";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
    reducer: {
        user: userReducer,
        events: eventsReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
