/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        city: {
          bg: "#0B1020",
          card: "rgba(15, 23, 42, 0.8)",
          cardHover: "rgba(23, 37, 84, 0.85)",
          border: "rgba(34, 211, 238, 0.2)",
          borderGlow: "rgba(34, 211, 238, 0.6)",
          cyan: "#22D3EE",
          cyanBright: "#67E8F9",
          violet: "#8B5CF6",
          violetBright: "#A78BFA",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#EF4444",
          surface: "#0e1629",
          surface2: "#16223d",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(34, 211, 238, 0.4), 0 0 30px rgba(34, 211, 238, 0.15)',
        'neon-violet': '0 0 15px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.15)',
        'neon-rose': '0 0 15px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
