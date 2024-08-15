<template>
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 class="mb-6 text-center text-2xl font-bold">Iniciar Sesión</h2>
        <div class="mb-4">
            <label for="email" class="block text-gray-700">Email</label>
            <input v-model="credentials.email" type="email" id="email" class="mt-2 w-full rounded border border-gray-300 p-2" required />
        </div>
        <div class="mb-6">
            <label for="password" class="block text-gray-700">Contraseña</label>
            <input v-model="credentials.password" type="password" id="password" class="mt-2 w-full rounded border border-gray-300 p-2" required />
        </div>
        <button @click="login" class="w-full rounded bg-blue-500 p-2 text-white transition duration-200 hover:bg-blue-700">Iniciar Sesión</button>
        <p v-if="error" class="mt-4 text-center text-red-500">{{ error }}</p>
    </div>
</template>

<script setup>
    import {useRouter} from "vue-router";

    const credentials = ref({
        email: "",
        password: "",
    });
    const error = ref("");

    const router = useRouter();

    const login = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/auth/ingresar/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials.value),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            localStorage.setItem("userData", JSON.stringify(data.data));
            localStorage.setItem("token", data.token);
            error.value = "";

            // Navegar al componente principal para mostrar el usuario logueado
            // router.push({name: "home"});
        } catch (err) {
            error.value = err.message;
        }
    };
</script>

<style scoped></style>
