// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: false},
    ssr: true,

    css: ["~/assets/css/main.css"],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    runtimeConfig: {
        public: {
            BASE_URL: process.env.NUXT_DEV_VITE_URL,
        },
    },

    modules: ["@nuxt/icon"],

    icon: {
        customCollections: [
            {
                prefix: "my-icon",
                dir: "./assets/my-icons",
            },
        ],
    },

    compatibilityDate: "2024-07-13",
});
