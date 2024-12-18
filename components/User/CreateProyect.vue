<script setup>
    import {ref} from "vue";
    import {apiurl} from "~/services/api.js";
    import {getUserId} from "~/services/auth";
    const props = defineProps(["refresh"]);
    const emit = defineEmits(["close", "refresh"]);
    const newProject = ref({name: "", unifiedCode: ""});
    const isCreating = ref(false);

    const createProject = async () => {
        try {
            isCreating.value = true;
            const response = await fetch(apiurl("/user/proyectos/crearproyecto"), {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newProject.value),
            });

            if (!response.ok) throw new Error("No se pudo crear el proyecto.");

            emit("refresh");
            emit("close");
        } catch (error) {
            console.error(error);
            alert("Error al crear el proyecto.");
        } finally {
            isCreating.value = false;
        }
    };
</script>

<template>
    <UiModal :showModal="true" @close="emit('close')" title="Crear Nuevo Proyecto">
        <div class="mb-4">
            <UiLabel forId="name" text="Nombre del Proyecto" />
            <UiInput id="name" v-model="newProject.name" />
        </div>
        <div class="mb-4">
            <UiLabel forId="unifiedCode" text="Código Unificado" />
            <UiInput id="unifiedCode" v-model="newProject.unifiedCode" />
        </div>
        <template #actions>
            <UiButton variant="secondary" text="Cancelar" @click="emit('close')" />
            <UiButton variant="primary" :isLoading="isCreating" text="Crear" @click="createProject" />
        </template>
    </UiModal>
</template>
