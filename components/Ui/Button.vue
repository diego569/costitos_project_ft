<script setup>
    import {computed} from "vue";

    const props = defineProps({
        type: {
            type: String,
            default: "button",
        },
        variant: {
            type: String,
            default: "primary",
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        loadingText: {
            type: String,
            default: "Loading...",
        },
        defaultText: {
            type: String,
            default: "Submit",
        },
    });

    const emit = defineEmits(["click"]);

    const handleClick = (event) => {
        if (!props.isLoading) {
            emit("click", event);
        }
    };

    const buttonClasses = computed(() => {
        switch (props.variant) {
            case "primary":
                return "inline-flex justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";
            case "secondary":
                return "inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";
            default:
                return "inline-flex justify-center rounded-lg border px-4 py-2 text-sm font-medium focus:outline-none";
        }
    });
</script>

<template>
    <button :type="type" :class="buttonClasses" @click="handleClick" :disabled="disabled || isLoading">
        <span v-if="isLoading">{{ loadingText }}</span>
        <span v-else>{{ defaultText }}</span>
    </button>
</template>
