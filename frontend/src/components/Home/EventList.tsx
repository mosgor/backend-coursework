import React from 'react';
import { EventCard } from '../EventCard';
import { Event } from '../../utils/types';

interface Props {
    events: Event[];
    isPast?: boolean;
}

export const EventList: React.FC<Props> = ({ events, isPast }) => (
    <>
        {events.map(ev => (
            <EventCard key={ev.id} event={ev} isPast={isPast} />
        ))}
    </>
);
