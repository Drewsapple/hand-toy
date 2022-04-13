module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#f97316',
					secondary: '#fdba74',
					accent: '#fef08a',
					neutral: '#ffedd5',
					'base-100': '#FFFFFF',
					info: '#3ABFF8',
					success: '#36D399',
					warning: '#fde047',
					error: '#dc2626'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
