export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#14b8a6", // Kilo 500
                "primary-light": "#ccfbf1",
                "primary-dark": "#0f766e",
                "background-light": "#f6f6f8",
                "background-dark": "#121022",
                kilo: { 50: '#f0fdfa', 100: '#ccfbf1', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' }
            },
            fontFamily: {
                "display": ["Space Grotesk", "system-ui", "sans-serif"]
            },
        },
    },
    plugins: [],
}
