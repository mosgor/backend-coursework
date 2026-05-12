import React from 'react';
import styles from '../../styles/tickets.module.css';

export const TicketEmpty: React.FC = () => (
    <p className={styles.tickets__empty}>У вас пока нет купленных билетов.</p>
);
