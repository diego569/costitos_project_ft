<template>
    <div class="flex h-screen">
        <div class="flex w-full items-center justify-center bg-gray-100 lg:w-2/5">
            <div class="flex h-full max-w-[300px] items-center text-center text-gray-500">
                <h1 class="items-center text-2xl font-bold">Regístrate y únete a nuestra comunidad</h1>
            </div>

            <div class="absolute inset-0 flex items-center justify-center">
                <div class="z-10 mx-auto min-h-screen w-full bg-white p-8 shadow-lg md:min-h-0 md:max-w-sm md:rounded-lg">
                    <div class="mb-6 flex flex-col items-center border-b pb-6">
                        <a href="http://localhost:3000/" class="flex flex-col items-center space-y-3">
                            <LogosFigura class="size-16" />
                            <LogosTexto class="h-4 w-auto" />
                        </a>
                    </div>

                    <div class="mb-4 flex justify-center space-x-4">
                        <button @click="isSupplier = false" :class="{'bg-orange-500 text-white': !isSupplier}" class="rounded-lg px-4 py-2">Usuario</button>
                        <button @click="isSupplier = true" :class="{'bg-orange-500 text-white': isSupplier}" class="rounded-lg px-4 py-2">Proveedor</button>
                    </div>

                    <form @submit.prevent="register">
                        <input type="hidden" v-model="registerData.role" />

                        <div v-if="isSupplier">
                            <div class="mb-4">
                                <label for="businessName" class="block text-gray-700">Razón Social</label>
                                <input v-model="registerData.businessName" type="text" id="businessName" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                            </div>
                            <div class="mb-4">
                                <label for="ruc" class="block text-gray-700">RUC</label>
                                <input v-model="registerData.ruc" type="text" id="ruc" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                            </div>
                            <div class="mb-4">
                                <label for="legalRepresentative" class="block text-gray-700">Representante Legal</label>
                                <input v-model="registerData.legalRepresentative" type="text" id="legalRepresentative" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                            </div>
                            <div class="mb-4">
                                <label for="phone" class="block text-gray-700">Teléfono</label>
                                <input v-model="registerData.phone" type="text" id="phone" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                            </div>
                        </div>

                        <div v-else>
                            <div class="mb-4">
                                <label for="dni" class="block text-gray-700">DNI</label>
                                <input v-model="registerData.dni" type="text" id="dni" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                            </div>
                            <div class="mb-4">
                                <label for="firstName" class="block text-gray-700">Nombre</label>
                                <input v-model="registerData.firstName" type="text" id="firstName" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                            </div>
                            <div class="mb-4">
                                <label for="lastName" class="block text-gray-700">Apellido</label>
                                <input v-model="registerData.lastName" type="text" id="lastName" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="email" class="block text-gray-700">Correo electrónico</label>
                            <input v-model="registerData.email" type="email" id="email" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                        </div>
                        <div class="mb-4">
                            <label for="password" class="block text-gray-700">Contraseña</label>
                            <input v-model="registerData.password" type="password" id="password" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                        </div>
                        <div class="mb-6">
                            <label for="confirmPassword" class="block text-gray-700">Confirme su contraseña</label>
                            <input v-model="registerData.confirmPassword" type="password" id="confirmPassword" class="mt-2 w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring" required />
                        </div>

                        <div class="mb-6 flex items-center">
                            <input v-model="registerData.terms" type="checkbox" id="terms" class="mr-2" required />
                            <label for="terms" class="block text-gray-700">Acepto los <a href="terminos-de-uso" class="text-orange-500">términos de uso</a> y las <a href="politicas-de-privacidad" class="text-orange-500">políticas de privacidad</a></label>
                        </div>
                        <button type="submit" class="w-full rounded-lg bg-orange-500 py-2 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50">Registrarse</button>
                        <p v-if="error" class="mt-4 text-center text-red-500">{{ error }}</p>
                        <p class="mt-4 text-center text-gray-700">¿Ya tienes una cuenta? <router-link to="/ingresar" class="text-orange-500">Inicia sesión aquí</router-link></p>
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

<script setup>
    import {ref} from "vue";
    import {useRouter} from "vue-router";

    const registerData = ref({
        dni: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        paymentType: "",
        terms: false,
        businessName: "",
        ruc: "",
        legalRepresentative: "",
        phone: "",
        role: "user", // Rol por defecto
    });

    const isSupplier = ref(false); // Estado para alternar entre usuario y proveedor
    const error = ref("");
    const router = useRouter();

    const register = async () => {
        // Actualizar el rol en función del tipo de registro seleccionado
        registerData.value.role = isSupplier.value ? "supplier" : "user";

        if (isSupplier.value) {
            registerData.value.name = registerData.value.businessName;
        }

        if (registerData.value.password !== registerData.value.confirmPassword) {
            error.value = "Las contraseñas no coinciden";
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/auth/registrarse/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData.value),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            localStorage.setItem("userData", JSON.stringify(data.data));
            localStorage.setItem("token", data.token);
            error.value = "";

            router.push({name: "index"});
        } catch (err) {
            error.value = err.message;
        }
    };
</script>

<style scoped></style>
