<script setup>
    import {ref} from "vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

    const props = defineProps({
        showModal: Boolean,
        closeModal: Function,
        onFeatureCreated: Function,
    });

    const featureName = ref("");
    const featureDescription = ref("");
    const isLoading = ref(false);
    const errorMessage = ref("");

    const createFeature = async () => {
        if (!featureName.value.trim()) return;

        isLoading.value = true;
        try {
            const response = await fetchWithAuth(apiurl("/supplier/misproductos/features"), "POST", {
                name: featureName.value,
                description: featureDescription.value,
            });

            if (response && response.feature) {
                if (typeof props.onFeatureCreated === "function") {
                    props.onFeatureCreated(response.feature);
                }
                props.closeModal();
            } else {
                console.error("Error creando característica:", response);
                errorMessage.value = "Error creando característica";
            }
        } catch (error) {
            console.error("Error creando característica:", error);
            errorMessage.value = "Error interno del servidor";
        } finally {
            isLoading.value = false;
        }
    };
</script>

<template>
    <UiModal :showModal="showModal" :closeModal="closeModal" title="Crear Nueva Característica">
        <div class="mt-2">
            <UiLabel forId="featureName" text="Nombre de la característica:" />
            <UiInput id="featureName" v-model="featureName" type="text" placeholder="Escribe el nombre de la característica" required />
            <UiLabel forId="featureDescription" text="Descripción de la característica:" />
            <UiInput id="featureDescription" v-model="featureDescription" type="text" placeholder="Escribe la descripción de la característica" />
            <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
        </div>
        <template #actions>
            <UiButton variant="secondary" defaultText="Cancelar" @click="closeModal" />
            <UiButton variant="primary" :isLoading="isLoading" loadingText="Creando..." defaultText="Crear" @click="createFeature" />
        </template>
    </UiModal>
</template>
