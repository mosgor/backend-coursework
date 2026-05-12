import React, { ReactNode } from 'react';
import styles from '../../styles/profile.module.css';

interface Props {
    onSubmit: (e: React.FormEvent) => void;
    children: ReactNode;
}

export const ProfileForm: React.FC<Props> = ({ onSubmit, children }) => (
    <form className={styles.profile} onSubmit={onSubmit}>
        <h2 className={styles.profile__title}>Мой профиль</h2>
        {children}
    </form>
);