import React from 'react';
import styles from '../../styles/tickets.module.css';

export const TicketLoader: React.FC = () => (
    <p className={styles.tickets__loading}>Загрузка билетов...</p>
);
