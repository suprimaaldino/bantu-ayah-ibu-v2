// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'game': ['Fredoka', 'Quicksand', 'sans-serif'],
        'fun': ['Quicksand', 'sans-serif'],
      },
      colors: {
        'game-purple': '#8B5CF6',
        'game-pink': '#EC4899',
        'game-orange': '#F59E0B',
        'game-green': '#10B981',
        'game-blue': '#3B82F6',
        'game-cyan': '#06B6D4',
      },
      backgroundImage: {
        'gradient-purple-pink': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'gradient-blue-cyan': 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
        'gradient-orange-yellow': 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)',
        'gradient-green-teal': 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
        'gradient-rainbow': 'linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6)',
        'gradient-game': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(236, 72, 153, 0.3)',
        'glow-gold': '0 0 30px rgba(245, 158, 11, 0.7), 0 0 60px rgba(245, 158, 11, 0.4)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 15px 40px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'sparkle': 'sparkle 1s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'coin-spin': 'coin-spin 1s ease-in-out',
        'shimmer': 'shimmer 2s infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 50px rgba(236, 72, 153, 0.5)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'coin-spin': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
