<script setup>
    import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";
    import {ref} from "vue";

    const props = defineProps({
        showModal: Boolean,
        closeModal: Function,
        title: String,
        size: {
            type: String,
            default: "md",
        },
    });

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-3xl",
    };

    const isShaking = ref(false);

    const handleBackdropClick = () => {
        isShaking.value = true;

        setTimeout(() => {
            isShaking.value = false;
        }, 500);
    };
</script>

<style scoped>
    @keyframes shake {
        0% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-10px);
        }
        50% {
            transform: translateX(10px);
        }
        75% {
            transform: translateX(-10px);
        }
        100% {
            transform: translateX(0);
        }
    }

    .shake {
        animation: shake 0.5s ease-in-out;
    }
</style>

<template>
    <TransitionRoot appear :show="showModal" as="template">
        <Dialog as="div" @close="handleBackdropClick" class="relative z-50">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                        <DialogPanel :class="['w-full', sizeClasses[size] || sizeClasses.md, 'transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all', isShaking ? 'shake' : '']">
                            <DialogTitle as="h3" class="mb-2 flex text-lg font-medium leading-6 text-gray-900">
                                {{ title }}
                            </DialogTitle>
                            <hr class="mb-4" />
                            <slot />
                            <div class="mt-6 flex justify-end space-x-2">
                                <slot name="actions" />
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
