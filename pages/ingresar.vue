<script setup>
    import {ref, onMounted} from "vue";
    import {useRouter} from "vue-router";

    const user = ref(null);
    const credentials = ref({
        email: "",
        password: "",
    });
    const error = ref("");
    const router = useRouter();

    onMounted(() => {
        // Verificar si el usuario está autenticado al cargar el componente
        const userData = localStorage.getItem("userData");
        if (userData) {
            user.value = JSON.parse(userData);
            // Redirigir a la página principal si el usuario ya está autenticado
            router.push({name: "index"});
        }
    });

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

            const previousRoute = localStorage.getItem("previousRoute");
            if (previousRoute) {
                router.push(previousRoute);
            } else {
                router.push({name: "index"});
            }
        } catch (err) {
            error.value = err.message;
        }
    };
</script>
<template>
    <div class="flex h-screen">
        <div class="flex w-full items-center justify-center bg-gray-100 lg:w-2/5">
            <div class="flex h-full max-w-[300px] items-center text-center text-gray-500">
                <h1 class="items-center text-2xl font-bold">Accede y expande tu presencia comercial</h1>
            </div>

            <div class="absolute inset-0 flex items-center justify-center">
                <div class="z-10 mx-auto min-h-screen w-full bg-white p-8 shadow-lg md:min-h-0 md:max-w-sm md:rounded-lg">
                    <div class="mb-6 flex flex-col items-center border-b pb-6">
                        <a href="http://localhost:3000/" class="flex flex-col items-center space-y-3">
                            <LogosFigura class="size-16" />
                            <LogosTexto class="h-4 w-auto" />
                        </a>
                    </div>
                    <form @submit.prevent="login">
                        <div class="mb-4">
                            <label for="email" class="block text-gray-700">Email</label>
                            <input v-model="credentials.email" type="email" id="email" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                        </div>
                        <div class="mb-6">
                            <label for="password" class="block text-gray-700">Contraseña</label>
                            <input v-model="credentials.password" type="password" id="password" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                        </div>
                        <button type="submit" class="w-full rounded-lg bg-orange-500 py-2 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50">Iniciar sesión</button>
                        <p v-if="error" class="mt-4 text-center text-red-500">{{ error }}</p>
                        <p class="mt-4 text-center text-gray-700">¿No tienes una cuenta? <router-link to="/registrarse" class="text-orange-500">Regístrate aquí</router-link></p>
                    </form>
                </div>
            </div>
        </div>

        <div class="relative hidden w-3/5 lg:block">
            <img src="/login.png" alt="Imagen de fondo" class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-orange-500 opacity-50"></div>
        </div>
    </div>
</template>

<style scoped></style>
