/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#faf5f0",
        surface: { DEFAULT: "#fdf8f4", alt: "#f3ece3" },
        accent: { DEFAULT: "#c9302c", strong: "#a82622", soft: "rgba(201,48,44,0.08)" },
        secondary: "#1a2f5e",
        border: "#e8ddd0",
        text: "#1a1410",
        muted: "#6b5e52",
        danger: "#c2185b",
      },
      fontFamily: {
        display: ['"Syne"', "sans-serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      fontSize: {
        xs: "0.64rem",
        sm: "0.8rem",
        base: "1rem",
        md: "1.25rem",
        lg: "1.5625rem",
        xl: "1.953rem",
        "2xl": "2.441rem",
        "3xl": "3.052rem",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "28px",
        full: "999px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(26,20,16,0.08), 0 1px 2px rgba(26,20,16,0.06)",
        md: "0 4px 12px rgba(26,20,16,0.10), 0 2px 4px rgba(26,20,16,0.06)",
        lg: "0 12px 32px rgba(26,20,16,0.12), 0 4px 8px rgba(26,20,16,0.06)",
        accent: "0 6px 20px rgba(201,48,44,0.25)",
      },
      maxWidth: {
        container: "1100px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,48,44,0.4)" },
          "50%": { boxShadow: "0 0 20px 6px rgba(201,48,44,0.15)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "float-delay": "float 5s ease-in-out 1.5s infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
