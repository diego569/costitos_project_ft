<script setup>
    import {ref} from "vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

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
            const response = await fetchWithAuth(apiurl(`/supplier/misproductos/subcategories`), "POST", {
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
    <UiModal :showModal="showModal" :closeModal="closeModal" title="Crear Nueva Subcategoría">
        <div class="mt-2">
            <UiLabel forId="subcategoryName" text="Nombre de la subcategoría:" />
            <UiInput id="subcategoryName" v-model="subcategoryName" type="text" placeholder="Nombre de la subcategoría" required />
            <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
        </div>
        <template #actions>
            <UiButton variant="secondary" defaultText="Cancelar" @click="closeModal" />
            <UiButton variant="primary" :isLoading="isLoading" loadingText="Creando..." defaultText="Crear" @click="createSubcategory" />
        </template>
    </UiModal>
</template>
