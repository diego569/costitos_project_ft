<script setup>
    import {ref, watch} from "vue";

    const props = defineProps({
        message: String,
        type: String, // 'success' o 'error'
        duration: {
            type: Number,
            default: 3000, // Duración por defecto de 3 segundos
        },
    });

    const isVisible = ref(false);

    // Mostrar la notificación cuando cambian las props
    watch(
        () => props.message,
        (newMessage) => {
            if (newMessage) {
                isVisible.value = true;
                setTimeout(() => {
                    isVisible.value = false;
                }, props.duration);
            }
        }
    );
</script>

<template>
    <div v-if="isVisible" :class="['fixed bottom-4 left-4 rounded-lg p-4 shadow-lg transition-transform', type === 'success' ? 'bg-primary-600 text-white' : 'bg-red-600 text-white']">
        {{ message }}
    </div>
</template>
