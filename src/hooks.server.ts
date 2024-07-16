import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

const basicAuth: Handle = async ({ event, resolve }) => {
    const { pathname } = event.url;

    if(!building && (!env.ADMIN_USERNAME || !env.ADMIN_USERNAME)) {
        return new Response('Not authorized', {
            status: 401,
        });
    }

    // Skip authentication for API routes
    if (pathname.startsWith('/api/')) {
        return await resolve(event);
    }

    const authHeader = event.request.headers.get('Authorization');
    const expectedAuth = `Basic ${btoa(`${env.ADMIN_USERNAME}:${env.ADMIN_PASSWORD}`)}`;

    if (authHeader !== expectedAuth) {
        return new Response('Not authorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Restricted Area", charset="UTF-8"'
            }
        });
    }

    return await resolve(event);
};

// You can add other hooks here and combine them using `sequence`
export const handle = sequence(basicAuth);