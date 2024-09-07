<template>
    <main class="grid min-h-full bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
            <p class="text-base font-semibold text-primary-600">404</p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Pagina no encontrada</h1>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <a :href="url()" class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Ir al Inicio</a>
            </div>
        </div>
    </main>
</template>
<script setup>
    import {url} from "~/services/api.js";
</script>
