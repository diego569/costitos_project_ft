<script setup>
    import {ref, onMounted} from "vue";
    import {getUserId} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

    const user = ref({
        dni: "",
        email: "",
        firstName: "",
        lastName: "",
    });

    const isLoading = ref(false);
    const message = ref({text: "", type: ""});
    const userId = getUserId();

    const fetchUserProfile = async () => {
        try {
            isLoading.value = true;
            const response = await fetch(apiurl(`/user/perfil/${userId}`));

            if (!response.ok) throw new Error("Error al obtener el perfil del usuario.");

            const data = await response.json();
            user.value = data.data;
        } catch (error) {
            console.error(error);
            message.value = {text: "Error al cargar el perfil.", type: "error"};
        } finally {
            isLoading.value = false;
        }
    };

    const saveChanges = async () => {
        try {
            isLoading.value = true;
            const response = await fetch(apiurl(`/user/perfil/${userId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user.value),
            });

            if (!response.ok) throw new Error("Error al guardar los cambios.");

            message.value = {text: "Perfil actualizado con éxito.", type: "success"};
        } catch (error) {
            console.error(error);
            message.value = {text: "Error al guardar el perfil.", type: "error"};
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (!userId) {
            message.value = {text: "No se encontró el ID del usuario.", type: "error"};
            return;
        }
        fetchUserProfile();
    });
</script>
<template>
    <div class="flex items-center">
        <NuxtLink to="/catalogo" class="inline-flex items-center rounded py-2 text-gray-500 hover:text-primary-800">
            <Icon name="my-icon:arrow-back" size="15" />
            Volver a catalogo
        </NuxtLink>
    </div>

    <div class="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-4">
        <div class="w-full rounded-lg bg-white p-6 shadow-md">
            <h1 class="mb-6 text-xl font-bold text-gray-700">Mi perfil</h1>

            <div v-if="message.text" :class="message.type === 'success' ? 'text-green-500' : 'text-red-500'" class="mb-4">
                {{ message.text }}
            </div>

            <div class="space-y-4">
                <div class="items-center space-y-2 md:flex md:space-x-4">
                    <div class="w-full">
                        <UiLabel forId="dni" text="DNI" />
                        <UiInput id="dni" type="text" v-model="user.dni" placeholder="Ingrese su DNI" required />
                    </div>

                    <div class="w-full">
                        <UiLabel forId="email" text="Correo electrónico" />
                        <UiInput id="email" type="email" v-model="user.email" placeholder="Ingrese su correo electrónico" required />
                    </div>
                </div>

                <div class="w-full">
                    <UiLabel forId="firstName" text="Nombres" />
                    <UiInput id="firstName" type="text" v-model="user.firstName" placeholder="Ingrese sus nombres" required />
                </div>

                <div class="w-full">
                    <UiLabel forId="lastName" text="Apellidos" />
                    <UiInput id="lastName" type="text" v-model="user.lastName" placeholder="Ingrese sus apellidos" required />
                </div>
            </div>

            <div class="mt-6 flex justify-center space-x-4">
                <UiButton variant="primary" :isLoading="isLoading" loadingText="Guardando..." defaultText="Guardar cambios" @click="saveChanges" />
            </div>
        </div>
    </div>
</template>
