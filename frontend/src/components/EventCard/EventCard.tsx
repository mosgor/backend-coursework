import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Event} from '../../utils/types';
import styles from './event-card.module.css';
import defaultImage from '../../assets/no-image.svg'

interface Props {
    event: Event
    isPast?: boolean
    onClick?: () => void
}

export const EventCard: React.FC<Props> = ({event, isPast, onClick}) => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.eventCard} ${isPast ? styles['eventCard_past'] : ''}`}
             onClick={() => onClick ? onClick() : navigate(`/event/${event.id}`)}>
            <img className={styles.eventCard__image} src={event.image || defaultImage} alt={event.title}
                 onError={(e) => {
                     const target = e.target as HTMLImageElement;
                     target.onerror = null;
                     target.src = defaultImage;
                 }}/>
            <h3 className={styles.eventCard__title}>{event.title}</h3>
            <p className={styles.eventCard__date}>{event.date}</p>
        </div>
    );
};
