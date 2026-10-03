/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#1A1A1A",
        "charcoal-light": "#222222",
        "charcoal-warm": "#1E1A0F",
        cream: {
          DEFAULT: "#F5F0E6",
          dark: "#EDE5D0",
        },
        gold: {
          50: "#FDF8EC",
          100: "#FAF0D0",
          200: "#F5DFA0",
          300: "#EDCA6A",
          light: "#D4AF7A",
          DEFAULT: "#B8935F",
          dark: "#8B6B3D",
          900: "#5C4420",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #F5DFA0 0%, #B8935F 50%, #8B6B3D 100%)",
        "gold-gradient-v": "linear-gradient(180deg, #F5DFA0 0%, #B8935F 100%)",
        "dark-gold": "linear-gradient(135deg, #1A1A1A 0%, #1E1A0F 100%)",
        "hero-gradient":
          "linear-gradient(to right, rgba(26,26,26,0.95) 40%, rgba(26,26,26,0.4) 100%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(184,147,95,0.3)",
        "gold-lg": "0 0 40px rgba(184,147,95,0.4)",
        "gold-sm": "0 0 8px rgba(184,147,95,0.2)",
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(184,147,95,0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(184,147,95,0.5)" },
        },
      },
    },
  },
  plugins: [],
};
