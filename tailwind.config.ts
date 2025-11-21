import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta pastel rosada inspirada en Nura Beauty
                'pink': {
                    '50': '#FDF2F8',
                    '100': '#FCE7F3',
                    '200': '#FDE8EE',  // Color principal suave
                    '300': '#FBCFE8',
                    '400': '#F9A8D4',
                    '500': '#F472B6',
                    '600': '#EC4899',
                },
                'cream': {
                    '50': '#FFF7E6',
                    '100': '#FFF4D6',
                },
                'purple': {
                    '50': '#F3E8FF',
                    '100': '#E9D5FF',
                },
                'neutral': {
                    'soft': '#F5F5F5',
                    'light': '#FAFAFA',
                },
            },
            fontFamily: {
                'serif': ['Georgia', 'serif'],
                'script': ['"Dancing Script"', 'cursive'],
                'sans': ['Arial', 'Helvetica', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'medium': '0 6px 18px rgba(20, 20, 30, 0.08)',
                'large': '0 10px 40px rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                'elegant': '20px',
                'soft': '14px',
            },
        },
    },
    plugins: [],
};

export default config;

