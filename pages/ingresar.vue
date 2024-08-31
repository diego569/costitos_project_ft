<script setup>
    import {ref, onMounted} from "vue";
    import {useRouter} from "vue-router";
    import {login} from "@/services/auth";

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
                    <form @submit.prevent="handleLogin">
                        <div class="mb-4">
                            <Label forId="email" text="Email" />
                            <Input id="email" type="email" v-model="credentials.email" placeholder="Ingrese su email" required />
                        </div>
                        <div class="mb-6">
                            <Label forId="password" text="Contraseña" />
                            <Input id="password" type="password" v-model="credentials.password" placeholder="Ingrese su contraseña" required />
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
