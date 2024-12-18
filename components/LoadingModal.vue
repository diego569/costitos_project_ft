<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-lg">
            <p class="text-lg font-medium text-gray-700">Cargando<span v-if="animatedDots">...</span></p>
            <div class="flex items-center justify-center space-x-2">
                <div class="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-500"></div>
                <div class="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-500 delay-200"></div>
                <div class="delay-400 h-2.5 w-2.5 animate-bounce rounded-full bg-orange-500"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, watchEffect} from "vue";

    // Props para controlar la visibilidad y las opciones del modal
    const props = defineProps({
        show: {
            type: Boolean,
            default: false,
        },
        animatedDots: {
            type: Boolean,
            default: true,
        },
    });
</script>

<style scoped>
    /* Animación personalizada para los puntos */
    .animate-bounce {
        animation: bounce 0.6s infinite;
    }

    @keyframes bounce {
        0%,
        80%,
        100% {
            transform: scale(0);
        }
        40% {
            transform: scale(1);
        }
    }

    /* Añade retraso para los puntos */
    .delay-200 {
        animation-delay: 0.2s;
    }
    .delay-400 {
        animation-delay: 0.4s;
    }
</style>
