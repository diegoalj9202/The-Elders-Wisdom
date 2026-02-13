/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mahogany: { 
          DEFAULT: '#3E2723', 
          dark: '#2C1A18',
          light: '#4E342E'
        },
        leather: { 
          DEFAULT: '#5D4037', 
          light: '#6D4C41',
          dark: '#4E342E'
        },
        gold: { 
          DEFAULT: '#D4AF37', 
          bright: '#FFD700',
          dark: '#B8930A'
        },
        parchment: { 
          DEFAULT: '#F5E6D3', 
          aged: '#E8D4B8',
          light: '#FAF3E8'
        },
        sepia: {
          DEFAULT: '#704214',
          light: '#8B5A1E',
          dark: '#5C3610'
        },
        burgundy: {
          DEFAULT: '#800020',
          dark: '#660019',
          light: '#A0002D'
        },
        emerald: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20'
        },
        amber: {
          DEFAULT: '#FF8F00',
          dark: '#E65100'
        },
        purple: {
          DEFAULT: '#4A148C',
          dark: '#311B92'
        },
        charcoal: {
          DEFAULT: '#212121',
          light: '#424242'
        }
      },
      fontFamily: {
        display: ['EB Garamond', 'Cinzel', 'serif'],
        body: ['Crimson Text', 'Lora', 'serif'],
        decorative: ['Cinzel Decorative', 'serif'],
        garamond: ['EB Garamond', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        crimson: ['Crimson Text', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'leather': '0 4px 6px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'embossed': 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(255, 255, 255, 0.2)',
        'gold-glow': '0 0 10px rgba(212, 175, 55, 0.5), 0 0 20px rgba(212, 175, 55, 0.3)',
        'inset-deep': 'inset 0 4px 8px rgba(0, 0, 0, 0.4)',
        'ornate': '0 8px 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'leather-texture': "url('/textures/leather.jpg')",
        'parchment-texture': "url('/textures/parchment.jpg')",
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'page-curl': 'pageCurl 0.6s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        pageCurl: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(180deg)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)' }
        }
      },
    },
  },
  plugins: [],
}
