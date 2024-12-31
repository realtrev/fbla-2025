import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			boxShadow: {
				glow: '0px 4px 20px 1px rgb(0 0 0 / 0.05)',
				'glow-lg': '0px 4px 35px 1px rgb(0 0 0 / 0.05)',
			},
			colors: {
				primary: {
					1: '#E5EEFF',
					2: '#B3CCFF',
					3: '#80AAFF',
					4: '#4D88FF',
					5: '#1A66FF',
					6: '#004CE6',
					7: '#003BB3',
					8: '#002A80',
					9: '#00194D',
					10: '#00081A',
				},
				accent: {
					1: '#EBFAF5',
					2: '#C3EFE1',
					3: '#9BE4CD',
					4: '#73D9B8',
					5: '#4BCEA4',
					6: '#31B48B',
					7: '#268C6C',
					8: '#1B644D',
					9: '#103C2E',
					10: '#0B281F',
				},
				surface: {
					0: '#EFEFF5',
					1: '#E0E0EB',
					2: '#D0D0E1',
					3: '#B1B1CD',
					4: '#9292B9',
					5: '#7373A5',
					6: '#5A5A8C',
					7: '#46466D',
					8: '#32324E',
					9: '#1E1E2F',
					10: '#101019',
				},
			},
		},
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;