/** @type {import('tailwindcss').Config}*/
const config = {
    darkMode: ['class'],
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        backgroundColor: (theme) => ({
            ...theme('colors'),
            primary: 'var(--bg-primary)',
            secondary: 'var(--bg-secondary)',
        }),

        textColor: (theme) => ({
            ...theme('colors'),
            primary: 'var(--text-primary)',
        }),
        extend: {},
    },

    plugins: [],
};

module.exports = config;
