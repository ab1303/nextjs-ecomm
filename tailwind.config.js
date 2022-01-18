/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  content: [
    './src/**/*.{html,js}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      orange: colors.orange,
      gray: colors.gray,
      blue: colors.blueGray,
      white: colors.white,
    },
    screens: {
      sm: '300px',
      lg: '700px',
    },
    extend: {
      backgroundImage: (theme) => ({
        hero: "url('/images/hero.png')",
        action: "url('/images/action.png')",
      }),
      fontFamily: {
        primary: ['Inter', ...fontFamily.sans],
      },
      // textColor: {
      //   skin: {
      //     base: 'var(--color-text-base)',
      //     muted: 'var(--color-text-muted)',
      //     inverted: 'var(--color-text-inverted)',
      //   },
      // },
      // backgroundColor: {
      //   skin: {
      //     fill: 'var(--color-fill)',
      //     'button-accent': 'var(color-button-accent)',
      //     'color-button-accent-hover': 'var(color-button-accent-hover)',
      //     'color-button-muted': 'var(color-button-muted)',
      //   },
      // },
      // gradientColorStops: {
      //   skin: {
      //     hue: 'var(--color-fill)',
      //   },
      // },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: 0.99,
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: 0.4,
            filter: 'none',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('tw-elements/dist/plugin')],
};
