/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: '#F8FAFC',
        backgroundAlt: '#FFFFFF',
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#F1F5F9',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        brand: {
          navy: '#002B49',          // Official IdeaVerse 2.0 Deep Navy
          navyDark: '#001A2E',
          orange: '#FF6B00',        // Official IdeaVerse 2.0 Rocket Flame Orange
          orangeLight: '#FF8822',
          gold: '#F59E0B',
          blue: '#0B2B82',          // Spectrum Blue
          darkText: '#002B49',
          mutedText: '#475569',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        display: ['var(--font-display)', 'Syne', 'Cabinet Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'ideaverse-hero': 'radial-gradient(circle at 50% 15%, rgba(0, 43, 73, 0.06) 0%, rgba(255, 107, 0, 0.05) 40%, rgba(248, 250, 252, 1) 100%)',
        'ideaverse-gradient': 'linear-gradient(135deg, #002B49 0%, #001A2E 50%, #FF6B00 100%)',
        'navy-orange-gradient': 'linear-gradient(90deg, #002B49 0%, #FF6B00 100%)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
};
