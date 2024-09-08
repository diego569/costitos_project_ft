<script setup>
    import {ref, watch} from "vue";
    import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

    const props = defineProps({
        showModal: Boolean,
        product: Object,
        closeModal: Function,
    });

    const features = ref([]);
    const isLoading = ref(false);

    const fetchProductFeatures = async () => {
        isLoading.value = true;
        try {
            const data = await fetchWithAuth(apiurl(`/supplier/producto/${props.product.id}/features`), "GET");

            features.value = data.features;
        } catch (error) {
            console.error("Error fetching product features:", error);
        } finally {
            isLoading.value = false;
        }
    };

    watch(
        () => props.showModal,
        (newValue) => {
            if (newValue && props.product && props.product.id) {
                fetchProductFeatures();
            }
        }
    );
</script>

<template>
    <TransitionRoot appear :show="showModal" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                        <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Detalles del Producto</DialogTitle>
                            <hr class="mb-4" />

                            <div class="mt-2 flex flex-col md:flex-row">
                                <div class="mb-4 w-full md:mb-0 md:w-1/3 md:pr-4">
                                    <img :src="product.photo" alt="product image" class="aspect-square size-full rounded-md object-cover" />
                                </div>

                                <div class="flex w-full flex-col gap-2 md:w-2/3">
                                    <p class="text-2xl font-semibold">{{ product.name }}</p>
                                    <p class="text-sm">{{ product.description }}</p>

                                    <div class="mt-4">
                                        <h4 class="font-semibold">Características:</h4>
                                        <div v-if="isLoading" class="mt-4">Cargando características...</div>
                                        <div v-else-if="features.length === 0" class="mt-4 text-gray-500">Este producto no tiene características.</div>
                                        <ul v-else>
                                            <li v-for="feature in features" :key="feature.id" class="mt-2">
                                                <strong>{{ feature.name }}:</strong> {{ feature.value }} <br />
                                                <span class="text-sm text-gray-500">{{ feature.description }}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6 flex justify-end space-x-2">
                                <button @click="closeModal" class="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">Cerrar</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
