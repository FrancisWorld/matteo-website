import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',  // Full HD
        '4xl': '2560px',  // 1440p/4K
        'tv': '3840px',   // 4K TV
      },
      borderWidth: {
        '3': '3px',
        '6': '6px',
      },
    },
  },
  plugins: [],
} satisfies Config;
