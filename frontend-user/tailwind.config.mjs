/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				robotoCondensed: "var(--font-roboto-condensed)"
			},

			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				background_header: "var(--background-header)",
				navbar_inactive: "var(--navbar-inactive)",
				navbar_active: "var(--navbar-active)",
				post_border: "var(--post-border)",
				search_bar: "var(--search-bar)",
				bubble: "var(--bubble)",
				caption_text: "var(--caption-text)",
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)'
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)'
				},
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)'
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)'
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)'
				},
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				chart: {
					'1': 'var(--chart-1)',
					'2': 'var(--chart-2)',
					'3': 'var(--chart-3)',
					'4': 'var(--chart-4)',
					'5': 'var(--chart-5)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("daisyui"),
	],
	daisyui: {
		themes: ["light", "dark", "cupcake", "emerald", "bumblebee", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween",
			"garden", "forest", "aqua", "lofi", "pastel", "fantasy",
			"wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter",
			"dim", "nord", "sunset", "carammelate", "abyss", "silk"
		],
	}
};
