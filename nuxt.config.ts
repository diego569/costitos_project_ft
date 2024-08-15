// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: false},
  css: ["~/assets/css/main.css"],

  postcss: {
      plugins: {
          tailwindcss: {},
          autoprefixer: {},
      },
  },

  runtimeConfig: {
      public: {
          DATABASE_ID: process.env.NUXT_DATABASE_ID,
          COLLECTION_ID: process.env.NUXT_COLLECTION_ID,
          PROJECT_ID: process.env.NUXT_PROJECT_ID,
          API_ENDPOINT: process.env.NUXT_API_ENDPOINT,
          BASE_URL: process.env.DEV_VITE_URL,
      },
  },

  modules: ["@nuxt/icon"],

  icon: {
      customCollections: [
          {
              prefix: "my-icon", // Prefijo para tus iconos personalizados
              dir: "./assets/my-icons", // Directorio donde se encuentran los SVGs personalizados
          },
          // Puedes agregar más colecciones personalizadas aquí si es necesario
      ],
  },

  compatibilityDate: "2024-07-13",
});