<script setup>
    import {ref, onMounted} from "vue";
    import {useRouter} from "vue-router";
    import {login} from "@/services/auth";
    import {url} from "~/services/api.js";

    const user = ref(null);
    const credentials = ref({
        email: "",
        password: "",
    });
    const error = ref("");
    const router = useRouter();

    onMounted(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            user.value = JSON.parse(userData);
            router.push({name: "index"});
        }
    });

    const handleLogin = () => {
        login(credentials.value, error);
    };
</script>

<template>
    <div class="absolute flex min-h-screen w-full overflow-auto">
        <div class="hidden w-2/5 items-center justify-center bg-gray-100 p-40 md:flex">
            <div class="text-center text-gray-500">
                <h1 class="text-2xl font-bold">Regístrate y únete a nuestra comunidad</h1>
            </div>
        </div>

        <div class="relative hidden w-3/5 md:block">
            <img src="/login.png" alt="Imagen de fondo" class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-orange-500 opacity-50"></div>
        </div>

        <div class="flex h-full w-full items-center justify-center overflow-auto p-4 md:absolute">
            <div class="flex h-auto w-full max-w-md flex-col items-center justify-center gap-4 overflow-auto rounded-lg bg-white p-8 md:max-w-[400px] md:gap-6 md:shadow-lg">
                <div class="flex w-full flex-col items-center border-b pb-6">
                    <a :href="url()" class="flex flex-col items-center space-y-3">
                        <LogosFigura class="size-16" />
                        <LogosTexto class="h-4 w-auto" />
                    </a>
                </div>

                <!-- Usamos v-on directamente para gestionar el envío -->
                <div class="w-full">
                    <UiLabel forId="email" text="Email" />
                    <UiInput id="email" type="email" v-model="credentials.email" placeholder="Ingrese su email" required />
                </div>
                <div class="w-full">
                    <UiLabel forId="password" text="Contraseña" />
                    <UiInput id="password" type="password" v-model="credentials.password" placeholder="Ingrese su contraseña" required />
                </div>
                <button @click="handleLogin" class="w-full rounded-lg bg-orange-500 py-2 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50">Iniciar sesión</button>
                <p v-if="error" class="mt-4 text-center text-red-500">{{ error }}</p>
                <p class="text-center text-gray-700">¿No tienes una cuenta? <router-link to="/registrarse" class="text-orange-500">Regístrate aquí</router-link></p>
            </div>
        </div>
    </div>
</template>
