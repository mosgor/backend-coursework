import React from 'react';
import styles from '../../styles/tickets.module.css';

interface Props {
    message: string;
}

export const TicketError: React.FC<Props> = ({ message }) => (
    <p className={styles.tickets__error}>{message}</p>
);
