import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
      },
      boxShadow: {
        "vis": "0px 0px 20px var(--tw-shadow-color)",
        "outer": "0 0 16px -4px rgba(0,0,0,0.1)"
      }
    },
  },
  plugins: [
    animate
  ],
}

