import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		 colors: {
    // Base palette
    flavescent: "#FFEE98",   // highlights / badges
    peach: "#FDC693",        // warnings / accents
    pink: "#FF9595",         // errors / destructive
    blue: "#C0DBEF",         // info / secondary accents

    // Grayscale
    raisin: "#242527",       // sidebar / cards
    onyx: "#353839",         // elevated backgrounds
    eerie: "#1A1D1F",        // dashboard background
    chinese: "#111315",      // darkest background

    // Map to semantic tokens
    background: "#111315",    // dark mode bg
    foreground: "#FFFFFF",    // text
    card: {
      DEFAULT: "#1A1D1F",     // cards
      foreground: "#FFFFFF",
    },
    primary: {
      DEFAULT: "#FFEE98",     // buttons
      foreground: "#111315",  // text on primary
    },
    secondary: {
      DEFAULT: "#C0DBEF",     // secondary buttons
      foreground: "#111315",
    },
    accent: {
      DEFAULT: "#FDC693",     // highlights
      foreground: "#111315",
    },
    destructive: {
      DEFAULT: "#FF9595",     // errors
      foreground: "#111315",
    },
    muted: {
      DEFAULT: "#353839",     // muted UI (sidebar items, borders)
      foreground: "#C0DBEF",  // softer text
    },
  },
  		fontFamily: {
  			monasans: ['var(--font-monasans)'],
  			nohemiBold: ['var(--font-nohemiBold)'],
  			primary_regular: ['var(--font-primary_regular)']
  		},
  		keyframes: {
  			typewriter: {
  				'0%': {
  					width: '0%'
  				},
  				'100%': {
  					width: '100%'
  				}
  			},
  			blink: {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0'
  				}
  			},
  			shine: {
  				'0%': {
  					'background-position': '0% 0%'
  				},
  				'50%': {
  					'background-position': '100% 100%'
  				},
  				to: {
  					'background-position': '0% 0%'
  				}
  			},
  			'background-position-spin': {
  				'0%': {
  					backgroundPosition: 'top center'
  				},
  				'100%': {
  					backgroundPosition: 'bottom center'
  				}
  			},
  			pulse: {
  				'0%, 100%': {
  					boxShadow: '0 0 0 0 var(--pulse-color)'
  				},
  				'50%': {
  					boxShadow: '0 0 0 8px var(--pulse-color)'
  				}
  			}
  		},
  		animation: {
  			typewriter: 'typewriter 2s steps(10) 1s forwards',
  			'blink-cursor': 'blink 1s infinite',
  			shine: 'shine var(--duration) infinite linear',
  			'background-position-spin': 'background-position-spin 3000ms infinite alternate',
  			pulse: 'pulse var(--duration) ease-out infinite'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
export default config;
