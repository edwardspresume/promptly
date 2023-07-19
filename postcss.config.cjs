const tailwind = require('tailwindcss');
const prefixer = require('autoprefixer');
const presetEnv = require('postcss-preset-env');
const simpleVars = require('postcss-simple-vars');
const nested = require('postcss-nested');
const tailwindNesting = require('tailwindcss/nesting');
const mixins = require('postcss-mixins');
const importPlugin = require('postcss-import');

const config = {
    plugins: [
        //Some plugins, like tailwindcss/nesting, need to run before Tailwind,

        mixins(),

        importPlugin(),

        tailwindNesting(nested),

        tailwind(),

        //But others, like autoprefixer, need to run after,

        simpleVars(),

        presetEnv({
            stage: 1,
            features: { 'nesting-rules': false },
        }),

        prefixer,
    ],
};

module.exports = config;
