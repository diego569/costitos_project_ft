<template>
    <button
        :disabled="props.disabled"
        @click="props.disabled ? null : $emit('click', $event)"
        class="inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-50">
        {{ props.label }}
    </button>
</template>

<script setup>
    const props = defineProps({
        label: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: "button",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    });
</script>
