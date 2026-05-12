import type {Event, User} from "./types";

const API_URL = 'http://localhost:8090';

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

function toYMD(dateTime: string): string {
    return dateTime.slice(0, 10);
}

interface EventsResponse {
    events: Event[]
}

export const api = {
    login: (email: string, password: string) =>
        request<{ user: User; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({email, password}),
        }),

    register: (name: string, email: string, password: string) =>
        request<{ user: User; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({name, email, password}),
        }),

    getUser: (token: string) => request<User>('/auth/me', {}, token),

    updateUser: (data: Partial<User>, token: string) =>
        request<User>('/auth/me', {method: 'PUT', body: JSON.stringify(data)}, token),

    getEvents: async (): Promise<Event[]> => {
        const data = await request<EventsResponse>('/events');
        return data.events.map(ev => ({
            ...ev,
            date: toYMD(ev.date),
        }));
    },

    getTickets: async (token: string) => {
        const tickets = await request<Event[] | null>('/tickets', {}, token);
        return Array.isArray(tickets) ? tickets.map(ev => ({
            ...ev,
            date: toYMD(ev.date),
        })) : [];
    },

    getCart: async (token: string) => {
        const cart = await request<Event[] | null>('/cart', {}, token);
        return Array.isArray(cart) ? cart.map(ev => ({
            ...ev,
            date: toYMD(ev.date),
        })) : [];
    },

    addToCart: (eventId: number, token: string) =>
        request<{ success: boolean; itemId: number }>('/cart', {
            method: 'POST',
            body: JSON.stringify({eventId})
        }, token),

    removeFromCart: (itemId: number, token: string) =>
        request<{ success: boolean }>('/cart/' + itemId, {
            method: 'DELETE'
        }, token),

    pay: (eventIds: number[], token: string) =>
        request<{ success: boolean }>('/payment', {
            method: 'POST',
            body: JSON.stringify({eventIds})
        }, token),
};
