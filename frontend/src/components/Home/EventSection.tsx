import React from 'react';
import styles from '../../styles/home.module.css';
import { Event } from '../../utils/types';
import { EventList } from './EventList';

interface Props {
    title: string;
    events: Event[];
    isPast?: boolean;
}

export const EventSection: React.FC<Props> = ({ title, events, isPast }) => (
    <div className={styles.home__section}>
        <h2 className={styles.home__sectionTitle}>{title}</h2>
        <div className={`${styles.home__list} ${isPast ? styles.home__pastList : ''}`}>
            <EventList events={events} isPast={isPast} />
        </div>
    </div>
);
