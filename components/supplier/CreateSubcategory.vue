<script setup>
    import {ref} from "vue";
    import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";
    import {fetchWithAuth} from "@/services/auth";

    const props = defineProps({
        showModal: Boolean,
        closeModal: Function,
        categoryId: String,
        onSubcategoryCreated: Function,
    });

    const subcategoryName = ref("");
    const isLoading = ref(false);
    const errorMessage = ref("");

    const createSubcategory = async () => {
        if (!subcategoryName.value.trim()) return;

        isLoading.value = true;
        try {
            const response = await fetchWithAuth(`http://localhost:8000/api/supplier/misproductos/subcategories`, "POST", {
                name: subcategoryName.value,
                categoryId: props.categoryId,
            });

            if (response && response.subcategory) {
                if (typeof props.onSubcategoryCreated === "function") {
                    props.onSubcategoryCreated(response.subcategory);
                }
                props.closeModal();
            } else {
                console.error("Error creating subcategory:", response);
                errorMessage.value = "Error creating subcategory";
            }
        } catch (error) {
            console.error("Error creating subcategory:", error);
            errorMessage.value = "Error interno del servidor";
        } finally {
            isLoading.value = false;
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
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Crear Nueva Subcategoría</DialogTitle>
                            <hr class="mb-4" />
                            <div class="mt-2">
                                <input v-model="subcategoryName" type="text" placeholder="Nombre de la subcategoría" class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500" />
                            </div>
                            <div class="mt-6 flex justify-end space-x-2">
                                <button @click="closeModal" class="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">Cancelar</button>
                                <button @click="createSubcategory" class="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">Crear</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
