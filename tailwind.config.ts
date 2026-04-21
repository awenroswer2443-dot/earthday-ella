import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earth palette (Act 1)
        moss: {
          50: "#f3f9f1",
          100: "#e0efdc",
          200: "#bedfb6",
          300: "#8ecc82",
          400: "#5fb553",
          500: "#3f9834",
          600: "#2f7725",
          700: "#26601d",
        },
        sky: {
          100: "#e8f4fb",
          200: "#c6e3f3",
          300: "#8fc9e6",
          400: "#55aad4",
          500: "#2f8bbd",
        },
        leaf: {
          100: "#dff4d2",
          200: "#b8e5a2",
          300: "#84cf66",
          400: "#58b53b",
        },
        earth: {
          100: "#f1ece1",
          200: "#d8c8a4",
          300: "#b7995e",
          400: "#8f6d35",
        },
        // Ella palette (Acts 3+)
        blush: {
          50: "#fff5f7",
          100: "#ffe4ec",
          200: "#ffc6d7",
          300: "#ffa0bb",
          400: "#ff7aa0",
          500: "#ff5288",
          600: "#e83a75",
        },
        cream: {
          50: "#fffaf0",
          100: "#fff3dc",
          200: "#ffe7ba",
        },
        lilac: {
          100: "#ece1ff",
          200: "#d9c4ff",
          300: "#c3a2ff",
          400: "#a77dff",
        },
        peach: {
          100: "#ffe4d1",
          200: "#ffc9a8",
          300: "#ffae82",
        },
        gold: {
          100: "#fff3c4",
          200: "#ffe58a",
          300: "#ffd35c",
          400: "#ffbf2e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        candy:
          "0 10px 30px -10px rgba(255, 82, 136, 0.5), 0 4px 8px -2px rgba(255, 82, 136, 0.25), inset 0 -4px 0 0 rgba(0, 0, 0, 0.08), inset 0 2px 0 0 rgba(255, 255, 255, 0.7)",
        earthy:
          "0 10px 28px -10px rgba(47, 119, 37, 0.35), inset 0 -3px 0 0 rgba(0,0,0,0.06), inset 0 2px 0 0 rgba(255,255,255,0.7)",
        dreamy:
          "0 20px 60px -20px rgba(199, 98, 176, 0.4), 0 10px 30px -15px rgba(255, 162, 194, 0.5)",
      },
      backgroundImage: {
        "earth-gradient":
          "linear-gradient(180deg, #e8f4fb 0%, #dff4d2 55%, #f3f9f1 100%)",
        "dreamy-gradient":
          "linear-gradient(135deg, #ffe4ec 0%, #ffd6e7 25%, #ffe7d6 55%, #f3e5ff 100%)",
        "sunset-gradient":
          "linear-gradient(180deg, #ffcce0 0%, #ffe7d6 60%, #fff3dc 100%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        spin3d: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-4px, 2px) skewX(-2deg)" },
          "40%": { transform: "translate(3px, -2px) skewX(1deg)" },
          "60%": { transform: "translate(-2px, 3px)" },
          "80%": { transform: "translate(2px, -1px)" },
          "100%": { transform: "translate(0)" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pop: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        twinkle: "twinkle 2s ease-in-out infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        spin3d: "spin3d 20s linear infinite",
        glitch: "glitch 0.25s steps(2, end) infinite",
        wobble: "wobble 3s ease-in-out infinite",
        pop: "pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
