<template></template>

<script setup>
    import {useRouter} from "vue-router";

    const router = useRouter();

    onMounted(() => {
        redirectToCatalogo();
    });

    const redirectToCatalogo = () => {
        router.push({name: "catalogo"});
    };
</script>

<!-- <template>
    {{ user }}
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
        <div v-if="!user" class="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
            <h2 class="mb-4 text-2xl font-bold">Iniciar Sesión</h2>
            <button @click="navigateToLogin" class="w-full rounded bg-blue-500 p-2 text-white transition duration-200 hover:bg-blue-700">Ir a Iniciar Sesión</button>
        </div>
        <div v-else class="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
            <h2 class="mb-4 text-2xl font-bold">Bienvenido, {{ user.name }}</h2>
            <p class="text-gray-700">Rol: {{ user.rol }}</p>
            <button @click="logout" class="mt-4 rounded bg-red-500 p-2 text-white transition duration-200 hover:bg-red-700">Cerrar Sesión</button>
        </div>
    </div>
</template>

<script setup>
    import {ref, onMounted} from "vue";
    import {useRouter} from "vue-router";

    const user = ref(null);
    const router = useRouter();

    const navigateToLogin = () => {
        localStorage.setItem("previousRoute", router.currentRoute.value.fullPath);
        router.push({name: "ingresar"});
    };

    const logout = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/auth/salir/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al cerrar sesión");
            }

            user.value = null;
            localStorage.removeItem("token");
            localStorage.removeItem("userData");

            router.push({name: "ingresar"});
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const isLocalStorageAvailable = () => {
        try {
            const test = "__localStorageTest__";
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    onMounted(() => {
        if (isLocalStorageAvailable()) {
            const storedUser = localStorage.getItem("userData");
            if (storedUser) {
                user.value = JSON.parse(storedUser);
            }
        }
    });
</script>

<style scoped></style> -->
