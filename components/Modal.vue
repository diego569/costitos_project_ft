<script setup>
    import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";

    // const open = ref(true);
    const props = defineProps({
        model: Boolean,
    });
</script>
<template>
    <TransitionRoot as="template" :show="model">
        <Dialog class="relative z-10" @close="open = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div class="bg-white px-4 pb-4 pt-5 text-center sm:p-6 sm:pb-4">
                                <div class="text-center">
                                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full" v-if="$slots.icon">
                                        <slot name="icon" />
                                    </div>
                                    <div class="mt-3 text-center">
                                        <DialogTitle as="h3" class="text-2xl font-semibold leading-6 text-gray-900">
                                            <slot name="title" />
                                        </DialogTitle>
                                        <div class="mt-2 inline-block min-h-20 content-center">
                                            <p class="text-md text-gray-500">
                                                <slot name="default" />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-3 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <slot name="button" />
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
