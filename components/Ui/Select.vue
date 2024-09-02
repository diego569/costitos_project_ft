<template>
    <select :id="id" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :class="['block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500', customClasses]" :required="required">
        <option v-for="option in options" :key="option.id" :value="option.id">
            {{ option.name }}
        </option>
    </select>
</template>

<script setup>
    const props = defineProps({
        id: {
            type: String,
            required: true,
        },
        modelValue: {
            type: [String, Number],
            required: true,
        },
        options: {
            type: Array,
            required: true,
            default: () => [],
        },
        customClasses: {
            type: String,
            default: "",
        },
        required: {
            type: Boolean,
            default: false,
        },
    });

    const emit = defineEmits(["update:modelValue"]);
</script>
