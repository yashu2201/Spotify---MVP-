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
        brand: {
          DEFAULT: '#5eead4', // A neon teal/green similar to the screenshot
          green: '#7bfca2',
          dark: '#0f1110',    // Main background
          sidebar: '#161918', // Sidebar background
          card: '#1a1d1c',    // Card background
        }
      }
    },
  },
  plugins: [],
};

export default config;
