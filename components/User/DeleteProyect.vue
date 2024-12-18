<script setup>
    import {ref} from "vue";
    import {apiurl} from "~/services/api.js";

    const props = defineProps(["project", "refresh"]);
    const emit = defineEmits(["close", "refresh"]);
    const isDeleting = ref(false);

    const deleteProject = async () => {
        try {
            isDeleting.value = true;
            const response = await fetch(apiurl(`/user/proyectos/eliminarproyecto/${props.project.id}`), {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("No se pudo eliminar el proyecto.");

            emit("refresh");
            emit("close");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar el proyecto.");
        } finally {
            isDeleting.value = false;
        }
    };
</script>

<template>
    <UiModal :showModal="true" @close="emit('close')" title="Eliminar Proyecto">
        <p class="mb-4 text-gray-600">
            ¿Estás seguro de que deseas eliminar el proyecto <strong>{{ project.name }}</strong
            >? Esta acción no se puede deshacer.
        </p>
        <template #actions>
            <UiButton variant="secondary" text="Cancelar" @click="emit('close')" />
            <UiButton variant="danger" :isLoading="isDeleting" text="Eliminar" @click="deleteProject" />
        </template>
    </UiModal>
</template>
