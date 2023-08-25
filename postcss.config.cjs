const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const tailwindNesting = require('tailwindcss/nesting');
const presetEnv = require('postcss-preset-env');

const config = {
	plugins: [
		tailwindNesting,

		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss(),

		presetEnv({
			stage: 1,
			features: { 'nesting-rules': false }
		}),
		//But others, like autoprefixer, need to run after,
		autoprefixer
	]
};

module.exports = config;
