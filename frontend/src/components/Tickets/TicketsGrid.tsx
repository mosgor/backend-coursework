import React from 'react';
import { Event } from '../../utils/types';
import { EventCard } from '../EventCard';
import styles from '../../styles/tickets.module.css';

interface Props {
    tickets: Event[];
    onSelect: (ticket: Event) => void;
}

export const TicketsGrid: React.FC<Props> = ({ tickets, onSelect }) => (
    <div className={styles.tickets__grid}>
        {tickets.map(ticket => (
            <EventCard
                key={ticket.id}
                event={ticket}
                isPast={false}
                onClick={() => onSelect(ticket)}
            />
        ))}
    </div>
);
