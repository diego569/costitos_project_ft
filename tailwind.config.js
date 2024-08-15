/** @type {import('tailwindcss').Config} */
export default {
    content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./plugins/**/*.{js,ts}", "./app.vue", "./error.vue"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#FFF8EC",
                    100: "#FFF0D3",
                    200: "#FFDEA5",
                    300: "#FFC56D",
                    400: "#FFA032",
                    500: "#FF830A",
                    600: "#FF6A00",
                    700: "#CC4C02",
                    800: "#A13B0B",
                    900: "#82330C",
                    950: "#461704",
                },
            },
            height: {
                navbar: "64px",
            },
        },
    },
    plugins: [],
};
