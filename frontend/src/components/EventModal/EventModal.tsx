import React from 'react';
import { Event } from '../../utils/types';
import { useStateContext } from '../../contexts';
import styles from './event-modal.module.css';
import defaultImage from '../../assets/no-image.svg';

interface Props {
    event: Event;
    onClose: () => void;
    onBook?: (id: number) => void;
    onDownload?: (id: number) => void;
    isPast?: boolean;
}

interface Props {
    event: Event;
    onClose: () => void;
    onBook?: (id: number) => void;
    onDownload?: (id: number) => void;
    isPast?: boolean;
}

export const EventModal: React.FC<Props> = ({ event, onClose, onBook, onDownload, isPast }) => {
    const { state } = useStateContext();
    const isAuth = Boolean(state.token);
    const past = Boolean(isPast);

    let button = null;

    if (onDownload) {
        button = (
            <button
                className={styles.eventModal__book}
                onClick={() => onDownload(event.id)}
            >
                Скачать билет
            </button>
        );
    } else {
        const buttonText = past
            ? 'Событие уже прошло'
            : isAuth
                ? `Забронировать за ${event.price} ₽`
                : 'Войдите, чтобы забронировать';

        button = (
            <button
                className={styles.eventModal__book}
                onClick={() => !past && isAuth && onBook?.(event.id)}
                disabled={!isAuth || past}
            >
                {buttonText}
            </button>
        );
    }

    return (
        <div className={styles.eventModal} onClick={onClose}>
            <div className={styles.eventModal__overlay} />
            <div className={styles.eventModal__body} onClick={e => e.stopPropagation()}>
                <button className={styles.eventModal__close} onClick={onClose}>×</button>
                <img
                    className={styles.eventModal__image}
                    src={event.image || defaultImage}
                    alt={event.title}
                    onError={e => { (e.target as HTMLImageElement).src = defaultImage; }}
                />
                <div className={styles.eventModal__header}>
                    <h2 className={styles.eventModal__title}>{event.title}</h2>
                    <span className={styles.eventModal__date}>{event.date}</span>
                </div>
                <p className={styles.eventModal__desc}>{event.description}</p>
                {button}
            </div>
        </div>
    );
};
