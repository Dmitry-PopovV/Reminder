import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Event = {
    id: string
    title: string
    start: string
}

export type InitialState = {
    events: Event[] | null | undefined
}
const initialState: InitialState = {
    events: undefined
};

export const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents: (state, action: PayloadAction<Event[] | null>) => {
            state.events = action.payload;
        },
        addEvent: (state, action: PayloadAction<Event>) => {
            if(!state.events) throw new Error("'events' is not initialaized");
            state.events.push(action.payload);
        },
        deleteEventById: (state, action: PayloadAction<string>) => {
            if(!state.events) throw new Error("'events' is not initialaized");
            const isSameId = (el: Event) => el.id === action.payload;
            const elIndex = state.events.findIndex(isSameId);
            state.events.splice(elIndex, 0);
        }
    }
});

export const { setEvents, addEvent, deleteEventById } = eventSlice.actions;
export default eventSlice.reducer;
