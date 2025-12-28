/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 몽글몽글 파스텔 색상
        cream: {
          DEFAULT: '#FFF8F0',
          50: '#FFFDFB',
          100: '#FFF8F0',
          200: '#FFF0E0',
        },
        peach: {
          50: '#FFF5F0',
          100: '#FFE8DD',
          200: '#FFD4C4',
          300: '#FFB8A0',
          400: '#FF9A7B',
          500: '#FF7B5C',
          600: '#E85A3D',
        },
        lavender: {
          50: '#F8F5FF',
          100: '#EDE5FF',
          200: '#DFD1FF',
          300: '#C9B3FF',
          400: '#B195FF',
          500: '#9A7BFF',
          600: '#7B5CE8',
        },
        mint: {
          50: '#F0FFF8',
          100: '#D5FFEC',
          200: '#B0FFDC',
          300: '#7BFFC4',
          400: '#4CDFAA',
          500: '#2DC48E',
          600: '#1FA876',
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#B9E5FF',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
        },
        rose: {
          50: '#FFF5F7',
          100: '#FFE4EA',
          200: '#FFCCD7',
          300: '#FFB3C4',
          400: '#FF8FA8',
          500: '#FF6B8A',
          600: '#E8506D',
        },
        sunshine: {
          50: '#FFFBEB',
          100: '#FFF3C4',
          200: '#FFE58F',
          300: '#FFD666',
          400: '#FFC53D',
          500: '#FAAD14',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 12px 40px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(154, 123, 255, 0.3)',
        'glow-rose': '0 0 20px rgba(255, 107, 138, 0.3)',
        'glow-mint': '0 0 20px rgba(45, 196, 142, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'bounce-soft': 'bounce-soft 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
