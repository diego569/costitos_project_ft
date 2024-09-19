<script setup>
    import {ref} from "vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

    const props = defineProps({
        showModal: Boolean,
        closeModal: Function,
        onCategoryCreated: Function,
    });

    const categoryName = ref("");
    const isLoading = ref(false);
    const errorMessage = ref("");

    const createCategory = async () => {
        if (!categoryName.value.trim()) return;

        isLoading.value = true;
        try {
            const response = await fetchWithAuth(apiurl("/supplier/misproductos/categories"), "POST", {
                name: categoryName.value,
            });

            if (response && response.category) {
                if (typeof props.onCategoryCreated === "function") {
                    props.onCategoryCreated(response.category);
                }
                props.closeModal();
            } else {
                console.error("Error creating category:", response);
                errorMessage.value = "Error creating category";
            }
        } catch (error) {
            console.error("Error creating category:", error);
            errorMessage.value = "Error interno del servidor";
        } finally {
            isLoading.value = false;
        }
    };
</script>
<template>
    <UiModal :showModal="showModal" :closeModal="closeModal" title="Crear Nueva Categoría">
        <div class="mt-2">
            <UiLabel forId="categoryName" text="Nombre de la categoría:" />
            <UiInput id="categoryName" v-model="categoryName" type="text" placeholder="Escribe el nombre de la categoría" required />
            <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
        </div>
        <template #actions>
            <UiButton variant="secondary" defaultText="Cancelar" @click="closeModal" />
            <UiButton variant="primary" :isLoading="isLoading" loadingText="Creando..." defaultText="Crear" @click="createCategory" />
        </template>
    </UiModal>
</template>
