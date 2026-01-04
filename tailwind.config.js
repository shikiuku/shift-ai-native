/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: NativeWind v4 requires the "nativewind/babel" preset in babel.config.js
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {},
    },
    plugins: [],
};
