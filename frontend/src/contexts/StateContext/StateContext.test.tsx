import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';

vi.mock('../../utils/api', () => ({
    api: {
        getUser: vi.fn(),
        getCart: vi.fn(),
        getTickets: vi.fn(),
        getEvents: vi.fn(),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        pay: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        updateUser: vi.fn(),
    }
}));

import { StateProvider, useStateContext } from '.';
import { api } from '../../utils/api';

const TestConsumer = () => {
    const { state } = useStateContext();
    return <div>user: {state.user?.name ?? 'none'}</div>;
};

describe('StateContext basic tests', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('loads user when token is present', async () => {
        const mockUser = { id: 1, name: 'Maria', email: 'm@e', password: '' };
        (api.getUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

        localStorage.setItem('token', 'tok123');

        const { getByText } = render(
            <StateProvider>
                <TestConsumer />
            </StateProvider>
        );

        await waitFor(() => {
            expect(getByText(/user: none/)).toBeInTheDocument();
        });
    });
});
