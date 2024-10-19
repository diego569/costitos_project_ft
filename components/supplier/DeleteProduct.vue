<script setup>
    import {ref} from "vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

    const props = defineProps({
        showModal: Boolean,
        supplierProductId: String,
        productName: String,
        closeModal: Function,
    });

    const emit = defineEmits(["productDeleted"]);

    const isLoading = ref(false);
    const errorMessage = ref("");

    const deleteProduct = async () => {
        if (!props.supplierProductId) return;

        isLoading.value = true;
        try {
            const response = await fetchWithAuth(apiurl(`/supplier/misproductos/delete/${props.supplierProductId}`), "DELETE");

            if (response.message === "Producto eliminado correctamente.") {
                console.log("Producto eliminado:", props.supplierProductId);
                emit("productDeleted", props.supplierProductId);
                props.closeModal();
            } else {
                errorMessage.value = "Error al eliminar el producto.";
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            errorMessage.value = "Error interno del servidor.";
        } finally {
            isLoading.value = false;
        }
    };
</script>

<template>
    <UiModal :showModal="showModal" :closeModal="closeModal" title="Eliminar Producto">
        <div class="mt-2">
            <p>
                ¿Estás seguro de que deseas eliminar el producto <strong>{{ productName }}</strong
                >?
            </p>
            <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
        </div>
        <template #actions>
            <UiButton variant="secondary" defaultText="Cancelar" @click="closeModal" />
            <UiButton variant="danger" :isLoading="isLoading" loadingText="Eliminando..." defaultText="Eliminar" @click="deleteProduct" />
        </template>
    </UiModal>
</template>
