<template>
    <label :for="forId" class="mb-2 block text-sm font-medium text-gray-900">
        {{ text }}
    </label>
</template>

<script setup>
    const props = defineProps({
        forId: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    });
</script>
