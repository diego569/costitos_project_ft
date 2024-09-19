<script setup>
    import {ref} from "vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

    const props = defineProps({
        showModal: Boolean,
        closeModal: Function,
        onUnitOfMeasureCreated: Function,
    });

    const unitOfMeasureValue = ref("");
    const unitOfMeasureName = ref("");
    const isLoading = ref(false);

    const createUnitOfMeasure = async () => {
        if (!unitOfMeasureValue.value.trim() || !unitOfMeasureName.value.trim()) return;

        isLoading.value = true;
        try {
            const response = await fetchWithAuth(apiurl("/supplier/misproductos/unitofmeasures"), "POST", {
                value: unitOfMeasureValue.value,
                name: unitOfMeasureName.value,
            });

            if (response && response.unitOfMeasure) {
                if (typeof props.onUnitOfMeasureCreated === "function") {
                    props.onUnitOfMeasureCreated(response.unitOfMeasure);
                }
                props.closeModal();
            } else {
                console.error("Error creating unit of measure:", response);
            }
        } catch (error) {
            console.error("Error creating unit of measure:", error);
        } finally {
            isLoading.value = false;
        }
    };
</script>
<template>
    <UiModal :showModal="showModal" :closeModal="closeModal" title="Crear Nueva Unidad de Medida">
        <div class="mt-2">
            <UiLabel forId="unitOfMeasureValue" text="Valor (e.g., kg):" />
            <UiInput id="unitOfMeasureValue" v-model="unitOfMeasureValue" type="text" placeholder="Valor (e.g., kg)" required />

            <UiLabel forId="unitOfMeasureName" text="Nombre (e.g., Kilogramo):" />
            <UiInput id="unitOfMeasureName" v-model="unitOfMeasureName" type="text" placeholder="Nombre (e.g., Kilogramo)" required />
        </div>
        <template #actions>
            <UiButton variant="secondary" defaultText="Cancelar" @click="closeModal" />
            <UiButton variant="primary" :isLoading="isLoading" loadingText="Creando..." defaultText="Crear" @click="createUnitOfMeasure" />
        </template>
    </UiModal>
</template>
