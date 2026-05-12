import {beforeEach, describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {StateProvider} from '../../contexts';
import {Home} from '.';
import type {Event} from '../../utils/types';
import {api} from '../../utils/api';

describe('Home page', () => {
    const now = new Date();
    const todayIso = now.toISOString();
    const tomorrowIso = new Date(now.getTime() + 86400000).toISOString();

    const mockEvents: Event[] = [
        { id:1, title:'Concert', date: todayIso, description:'', image:'', price: 100 },
        { id:2, title:'Festival', date: tomorrowIso, description:'', image:'', price: 200 },
    ];

    beforeEach(() => {
        vi.restoreAllMocks();
        vi.spyOn(api, 'getEvents').mockResolvedValue(mockEvents);
        localStorage.removeItem('token');
        window.alert = vi.fn();
    });

    it('loads and displays events', async () => {
        render(
            <MemoryRouter>
                <StateProvider>
                    <Home />
                </StateProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('События')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Concert')).toBeInTheDocument();
            expect(screen.getByText('Festival')).toBeInTheDocument();
        });
    });

    it('filters by search term', async () => {
        render(
            <MemoryRouter>
                <StateProvider>
                    <Home />
                </StateProvider>
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('Festival'));

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'conc' } });

        await waitFor(() => {
            expect(screen.getByText('Concert')).toBeInTheDocument();
            expect(screen.queryByText('Festival')).toBeNull();
        });
    });
});
