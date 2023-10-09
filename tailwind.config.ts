import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--f-montserrat)', 'var(--f-zenkaku)', ...defaultTheme.fontFamily.sans],
      mono: ['var(--f-jetbrains-mono)', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        tablet: '768px',
        desktop: '1280px',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
