/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			'custom-dark': '#0f0f1a',
  			'custom-dark-blue': '#1a1a2e',
  			'custom-blue': '#4da8ff',
  			'space-blue': 'rgb(77 168 255)',
  			'space-purple': 'rgb(147 51 234)',
  			'space-cyan': 'rgb(34 211 238)',
  			'quantum-glow': 'rgb(168 85 247)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'2xl': '1rem',
  			'3xl': '1.5rem',
  			'4xl': '2rem'
  		},
  		fontFamily: {
  			sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
  			mono: ['var(--font-geist-mono)', 'monospace'],
  			inter: ['var(--font-inter)', 'system-ui', 'sans-serif']
  		},
  		fontSize: {
  			'2xs': '0.625rem',
  			'3xl': '1.953rem',
  			'4xl': '2.441rem',
  			'5xl': '3.052rem'
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem'
  		},
  		animation: {
  			'float': 'float 3s ease-in-out infinite',
  			'float-slow': 'float-slow 6s ease-in-out infinite',
  			'orbit': 'orbit 20s linear infinite',
  			'glow': 'glow 2s ease-in-out infinite',
  			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
  			'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
  			'aurora': 'aurora 8s ease-in-out infinite',
  			'data-stream': 'data-stream 3s ease-in-out infinite',
  			'shimmer': 'shimmer 2.5s infinite',
  			'gradient-shift': 'gradient-shift 3s ease infinite'
  		},
  		keyframes: {
  			float: {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-10px)' }
  			},
  			'float-slow': {
  				'0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
  				'25%': { transform: 'translateY(-15px) translateX(5px)' },
  				'75%': { transform: 'translateY(-5px) translateX(-5px)' }
  			},
  			orbit: {
  				'0%': { transform: 'rotate(0deg) translateX(50px) rotate(0deg)' },
  				'100%': { transform: 'rotate(360deg) translateX(50px) rotate(-360deg)' }
  			},
  			glow: {
  				'0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
  				'50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' }
  			},
  			'pulse-glow': {
  				'0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
  				'50%': { opacity: '0.6', transform: 'scale(1.05)' }
  			},
  			'pulse-ring': {
  				'0%': { transform: 'scale(0.9)', opacity: '1' },
  				'100%': { transform: 'scale(1.3)', opacity: '0' }
  			},
  			aurora: {
  				'0%, 100%': { opacity: '0.3', transform: 'translateY(0) scale(1)' },
  				'50%': { opacity: '0.6', transform: 'translateY(-10px) scale(1.05)' }
  			},
  			'data-stream': {
  				'0%': { transform: 'translateY(-100%)', opacity: '0' },
  				'50%': { opacity: '1' },
  				'100%': { transform: 'translateY(100%)', opacity: '0' }
  			},
  			shimmer: {
  				'0%': { transform: 'translateX(-100%)' },
  				'100%': { transform: 'translateX(100%)' }
  			},
  			'gradient-shift': {
  				'0%, 100%': { backgroundPosition: '0% center' },
  				'50%': { backgroundPosition: '100% center' }
  			}
  		},
  		backdropBlur: {
  			xs: '2px',
  			'3xl': '64px'
  		},
  		boxShadow: {
  			'glow-sm': '0 0 10px rgba(168, 85, 247, 0.3)',
  			'glow-md': '0 0 20px rgba(168, 85, 247, 0.4)',
  			'glow-lg': '0 0 30px rgba(168, 85, 247, 0.5)',
  			'neon': '0 0 5px theme("colors.cyan.400"), 0 0 20px theme("colors.purple.500")',
  			'inner-glow': 'inset 0 0 20px rgba(168, 85, 247, 0.2)'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  			'gradient-quantum': 'linear-gradient(135deg, rgb(77 168 255) 0%, rgb(147 51 234) 50%, rgb(34 211 238) 100%)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}