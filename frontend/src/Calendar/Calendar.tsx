import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import { useEvents } from '../hooks/useEvents';

export default function Calendar() {
    const { events } = useEvents();

    return (<FullCalendar
        plugins={[dayGridPlugin]}
        height="auto"
        initialView="dayGridMonth"
        events={events}
    />);
}
