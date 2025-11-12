import axios from 'axios';
import { router } from '@inertiajs/vue3';

const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Track if we're already redirecting to prevent loops
let isRedirecting = false;

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !isRedirecting) {
            // Only redirect if we're not already on the login page or a public page
            const currentPath = window.location.pathname;
            const publicPaths = ['/login', '/register', '/forgot-password', '/', '/about', '/contact', '/faq', '/apply', '/leaderboard'];
            
            if (!publicPaths.includes(currentPath)) {
                isRedirecting = true;
                // Use a small delay to prevent rapid redirects
                setTimeout(() => {
                    router.visit('/login', {
                        onFinish: () => {
                            isRedirecting = false;
                        },
                    });
                }, 100);
            }
        }

        return Promise.reject(error);
    },
);

export default api;

