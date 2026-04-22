/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,svelte,md,ts,js}'],
	theme: {
		extend: {
			fontFamily: {
				serif: ['Source Serif 4', 'Georgia', 'serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
			},
			colors: {
				background: 'rgb(var(--background) / <alpha-value>)',
				foreground: 'rgb(var(--foreground) / <alpha-value>)',
				card: 'rgb(var(--card) / <alpha-value>)',
				'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
				primary: 'rgb(var(--primary) / <alpha-value>)',
				'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
				accent: 'rgb(var(--accent) / <alpha-value>)',
				'accent-foreground': 'rgb(var(--accent-foreground) / <alpha-value>)',
				muted: 'rgb(var(--muted) / <alpha-value>)',
				'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
				border: 'rgb(var(--border) / <alpha-value>)',
				destructive: 'rgb(var(--destructive) / <alpha-value>)'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
