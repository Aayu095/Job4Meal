import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f0',
          100: '#ffe8d1',
          200: '#ffd4a8',
          300: '#ffb67a',
          400: '#ff9f5c',
          500: '#FF8C42', // Muted orange
          600: '#f47a30',
          700: '#e66820',
          800: '#d45610',
          900: '#b84400',
        },
        green: {
          50: '#f0f7f2',
          100: '#d9ede0',
          200: '#b8dcc4',
          300: '#8FBC8F', // Soft green
          400: '#6B9E78',
          500: '#558B68',
          600: '#477555',
          700: '#3a5f44',
          800: '#2d4a35',
          900: '#1f3426',
        },
        teal: {
          50: '#e6f7f7',
          100: '#b3e6e6',
          200: '#80d5d5',
          300: '#4dc4c4',
          400: '#2ab3b3',
          500: '#14a3a3',
          600: '#108a8a',
          700: '#0d7070',
          800: '#095757',
          900: '#063e3e',
        },
        neutral: {
          50: '#faf8f5',
          100: '#f5f2ed',
          200: '#e8e3d8',
          300: '#d6cfc0',
          400: '#c4baa8',
          500: '#b0a393',
          600: '#8f8371',
          700: '#6e6558',
          800: '#4d4740',
          900: '#2c2a27',
        },
        success: {
          50: '#e8f5e9',
          500: '#6B9E78',
          700: '#477555',
        },
        danger: {
          50: '#ffebee',
          500: '#f44336',
          700: '#d32f2f',
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
