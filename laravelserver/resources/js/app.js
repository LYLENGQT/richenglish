import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, h } from 'vue';
import { Ziggy } from './ziggy';
import { route } from 'ziggy-js';
import AOS from 'aos';

// Initialize Ziggy globally so route() can use it automatically
if (typeof window !== 'undefined') {
    window.Ziggy = Ziggy;
    // Override URL to use relative paths (empty string = relative)
    window.Ziggy.url = '';
    window.Ziggy.absolute = false;
}

// Make route() function available globally - always use relative URLs
window.route = (name, params) => {
    // Always use relative URLs (absolute = false)
    return route(name, params, false, window.Ziggy);
};

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob('./Pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) });
        
        // Make route() available globally in Vue templates
        app.config.globalProperties.route = route;
        
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
        });
        
        return app
            .use(plugin)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
