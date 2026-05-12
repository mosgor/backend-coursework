import React, { useEffect, useState } from 'react';
import { useStateContext } from '../../contexts';
import { api } from '../../utils/api';

import { ProfileForm } from '../../components/Profile/ProfileForm';
import { ProfileField } from '../../components/Profile/ProfileField';
import { ProfileButton } from '../../components/Profile/ProfileButton';
import { ProfileMessage } from '../../components/Profile/ProfileMessage';

export const Profile: React.FC = () => {
    const { state, dispatch } = useStateContext();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (state.user) {
            setForm({
                name: state.user.name,
                email: state.user.email,
                password: state.user.password
            });
        }
    }, [state.user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!state.token) {
            setError('Необходима авторизация');
            return;
        }

        try {
            const updatedUser = await api.updateUser(form, state.token);
            dispatch({ type: 'SET_USER', payload: updatedUser });
            setMessage('Профиль успешно обновлён');
            setForm({ ...form, password: '' }); // очистим поле пароля
        } catch {
            setError('Ошибка при обновлении профиля');
        }
    };

    return (
        <ProfileForm onSubmit={handleSubmit}>
            <ProfileField
                label="Имя"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
            />
            <ProfileField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
            />
            <ProfileField
                label="Пароль"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
            />
            <ProfileButton text="Сохранить" />

            {message && <ProfileMessage type="success">{message}</ProfileMessage>}
            {error   && <ProfileMessage type="error">{error}</ProfileMessage>}
        </ProfileForm>
    );
};
