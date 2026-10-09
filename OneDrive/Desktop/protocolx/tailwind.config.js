/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ARCTIC AURORA DESIGN TOKENS (DYNAMIC CSS VARIABLES)
        aurora: {
          bg: withOpacity('--color-background'),
          surface: withOpacity('--color-surface'),
          elevated: withOpacity('--color-surface-elevated'),
          input: withOpacity('--color-input'),
          border: withOpacity('--color-border'),
          primary: withOpacity('--color-primary'),
          'primary-hover': withOpacity('--color-primary-hover'),
          'primary-pressed': withOpacity('--color-primary-pressed'),
          secondary: withOpacity('--color-secondary'),
          text: withOpacity('--color-text'),
          muted: withOpacity('--color-muted'),
          subtle: withOpacity('--color-subtle'),
          success: withOpacity('--color-success'),
          warning: withOpacity('--color-warning'),
          error: withOpacity('--color-error'),
          info: withOpacity('--color-info'),
        },
        // Backward-compatible mappings seamlessly re-skinned
        midnight: {
          950: withOpacity('--color-background'),
          900: withOpacity('--color-surface'),
          850: withOpacity('--color-input'),
          800: withOpacity('--color-surface'),
          750: withOpacity('--color-surface-elevated'),
          700: withOpacity('--color-border'),
        },
        brand: {
          primary: withOpacity('--color-primary'),
          secondary: withOpacity('--color-secondary'),
          mint: withOpacity('--color-primary'),
          periwinkle: withOpacity('--color-secondary'),
          teal: withOpacity('--color-surface'),
          dark: withOpacity('--color-background'),
          violet: withOpacity('--color-secondary'),
          blue: withOpacity('--color-secondary'),
          cyan: withOpacity('--color-primary'),
          success: withOpacity('--color-success'),
        },
        accent: {
          mint: withOpacity('--color-primary'),
          periwinkle: withOpacity('--color-secondary'),
          violet: withOpacity('--color-secondary'),
          blue: withOpacity('--color-secondary'),
          cyan: withOpacity('--color-primary'),
          success: withOpacity('--color-success'),
          warning: withOpacity('--color-warning'),
          danger: withOpacity('--color-error'),
        },
        electric: {
          mint: '#45E0C1',
          periwinkle: '#8AA8FF',
          violet: '#8AA8FF',
          blue: '#8AA8FF',
          cyan: '#45E0C1',
          coral: '#FF7F91',
          amber: '#FFC777',
        },
        txt: {
          primary: '#F0FFFC',
          secondary: '#9BBDB8',
          muted: '#6A8F8A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-mint': '0 0 35px -5px rgba(69, 224, 193, 0.3)',
        'glow-periwinkle': '0 0 35px -5px rgba(138, 168, 255, 0.25)',
        'glow-aurora': '0 0 45px -8px rgba(69, 224, 193, 0.25), 0 0 30px -10px rgba(138, 168, 255, 0.2)',
        'card': '0 4px 20px -2px rgba(4, 15, 17, 0.7), inset 0 1px 0 0 rgba(69, 224, 193, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
