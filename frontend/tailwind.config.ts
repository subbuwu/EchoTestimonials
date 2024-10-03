import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        monasans: ['var(--font-monasans)'],
        nohemiBold : ['var(--font-nohemiBold)'],
        primary_regular : ['var(--font-primary_regular)'],
      },
      keyframes: {
        typewriter: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'typewriter': 'typewriter 2s steps(10) 1s forwards',
        'blink-cursor': 'blink 1s infinite',
      },
      },
  },
  plugins: [],
}
export default config;
