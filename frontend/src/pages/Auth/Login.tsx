import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts';
import { api } from '../../utils/api';
import { AuthForm } from '../../components/Auth/AuthForm';
import { AuthInput } from '../../components/Auth/AuthInput';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { dispatch } = useStateContext();
    const nav = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await api.login(email, password);
        dispatch({ type: 'LOGIN', payload: { user: res.user, token: res.token } });
        nav('/');
    };

    return (
        <AuthForm title="Вход" onSubmit={handleSubmit} buttonText="Войти">
            <AuthInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <AuthInput
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </AuthForm>
    );
};
