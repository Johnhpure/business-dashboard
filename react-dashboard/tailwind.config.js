/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00d4ff",
          foreground: "#0a0a0f",
        },
        secondary: {
          DEFAULT: "#1e293b",
          foreground: "#f1f5f9",
        },
        background: "#0a0a0f",
        foreground: "#f1f5f9",
        card: {
          DEFAULT: "#1e293b",
          foreground: "#f1f5f9",
        },
        popover: {
          DEFAULT: "#1e293b",
          foreground: "#f1f5f9",
        },
        muted: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8",
        },
        accent: {
          DEFAULT: "#1e293b",
          foreground: "#f1f5f9",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#f1f5f9",
        },
        border: "#334155",
        input: "#334155",
        ring: "#00d4ff",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
    },
  },
}