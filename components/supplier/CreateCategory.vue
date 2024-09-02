<script setup>
    import {ref} from "vue";
    import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

    const props = defineProps({
        showModal: Boolean,
        closeModal: Function,
        onCategoryCreated: Function,
    });

    const categoryName = ref("");

    const createCategory = async () => {
        if (!categoryName.value.trim()) return;

        try {
            const response = await fetchWithAuth(apiurl("//supplier/misproductos/categories"), "POST", {
                name: categoryName.value,
            });

            if (response && response.category) {
                if (typeof props.onCategoryCreated === "function") {
                    props.onCategoryCreated(response.category);
                }
                props.closeModal();
            } else {
                console.error("Error creating category:", response);
            }
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };
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
                        <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Crear Nueva Categoría</DialogTitle>
                            <hr class="mb-4" />
                            <div class="mt-2">
                                <input v-model="categoryName" type="text" placeholder="Nombre de la categoría" class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500" />
                            </div>
                            <div class="mt-6 flex justify-end space-x-2">
                                <button @click="closeModal" class="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">Cancelar</button>
                                <button @click="createCategory" class="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">Crear</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
