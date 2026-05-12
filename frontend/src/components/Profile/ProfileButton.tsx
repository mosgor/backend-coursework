import React from 'react';
import styles from '../../styles/profile.module.css';

interface Props {
    text: string;
}

export const ProfileButton: React.FC<Props> = ({ text }) => (
    <button className={styles.profile__button} type="submit">
        {text}
    </button>
);