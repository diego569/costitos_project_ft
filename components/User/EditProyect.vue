<script setup>
    import {ref, watch} from "vue";
    import {apiurl} from "~/services/api.js";

    const props = defineProps(["project", "refresh"]);
    const emit = defineEmits(["close", "refresh"]);
    const editedProject = ref({});

    watch(
        () => props.project,
        (newValue) => {
            editedProject.value = {...newValue};
        },
        {immediate: true}
    );

    const isUpdating = ref(false);

    const updateProject = async () => {
        try {
            isUpdating.value = true;
            const response = await fetch(apiurl(`/user/proyectos/editarproyecto/${editedProject.value.id}`), {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(editedProject.value),
            });

            if (!response.ok) throw new Error("No se pudo actualizar el proyecto.");

            emit("refresh");
            emit("close");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar el proyecto.");
        } finally {
            isUpdating.value = false;
        }
    };
</script>

<template>
    <UiModal :showModal="true" @close="emit('close')" title="Editar Proyecto">
        <div class="mb-4">
            <UiLabel forId="name" text="Nombre del Proyecto" />
            <UiInput id="name" v-model="editedProject.name" />
        </div>
        <div class="mb-4">
            <UiLabel forId="unifiedCode" text="Código Unificado" />
            <UiInput id="unifiedCode" v-model="editedProject.unifiedCode" />
        </div>
        <template #actions>
            <UiButton variant="secondary" text="Cancelar" @click="emit('close')" />
            <UiButton variant="primary" :isLoading="isUpdating" text="Guardar" @click="updateProject" />
        </template>
    </UiModal>
</template>
