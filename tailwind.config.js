/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './**/*.html',
    './assets/**/*.{js,html}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#0A0A0A',
        'secondary-black': '#1A1A1A',
        'tertiary-black': '#2A2A2A',
        'accent-gold': '#FFD700',
        'light-gold': '#FFF4B3',
        'dark-gold': '#B8860B',
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-gold': 'rgba(255, 215, 0, 0.1)',
        'accent-blue': '#00D9FF',
        'soft-gold': '#F4E1A1',
        'success-green': '#00FF88',
        'warning-orange': '#FF6B35',
        'error-red': '#FF4444',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'futuristic': ['Orbitron', 'monospace'],
        'display': ['Orbitron', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '20px',
        'heavy': '30px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 215, 0, 0.4)',
        'inner-glow': 'inset 0 0 10px rgba(255, 215, 0, 0.2)',
        'neon': '0 0 5px theme(colors.accent-gold), 0 0 10px theme(colors.accent-gold), 0 0 15px theme(colors.accent-gold)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        'cursor': '9999',
        'modal': '1000',
        'dropdown': '100',
        'sticky': '10',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'typing': 'typing 3.5s steps(40, end), blink-caret .75s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'particle-float': 'particleFloat 8s ease-in-out infinite',
        'blink': 'blink-caret .75s step-end infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'zoom-in': 'zoomIn 0.5s ease-out',
        'rotate-slow': 'spin 3s linear infinite',
        'gradient-x': 'gradientX 3s ease infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        gradientX: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
