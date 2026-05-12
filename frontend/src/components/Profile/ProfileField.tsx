import React from 'react';
import styles from '../../styles/profile.module.css';

interface Props {
    label: string;
    name: 'name' | 'email' | 'password';
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

export const ProfileField: React.FC<Props> = ({
                                                  label, name, type = 'text', value, onChange, required = false
                                              }) => (
    <label className={styles.profile__label}>
        {label}
        <input
            className={styles.profile__input}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
        />
    </label>
);