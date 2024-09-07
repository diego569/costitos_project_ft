<script setup>
    import {ref} from "vue";
    import {register} from "@/services/auth";
    import {url} from "~/services/api.js";

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
    });

    const isSupplier = ref(false);
    const error = ref("");

    const handleRegister = () => {
        register(registerData.value, error);
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
            <div class="flex h-auto w-full max-w-md flex-col items-center justify-center overflow-auto rounded-lg bg-white p-8 md:max-w-[400px] md:shadow-lg">
                <div class="mb-3 flex w-full flex-col items-center border-b pb-3">
                    <a :href="url()" class="flex flex-col items-center space-y-3">
                        <LogosFigura class="size-16" />
                        <LogosTexto class="h-4 w-auto" />
                    </a>
                </div>

                <div class="mb-4 flex justify-center space-x-4">
                    <button @click="isSupplier = false" :class="{'bg-orange-500 text-white': !isSupplier}" class="rounded-lg border border-primary-300 px-3 py-1.5 text-sm transition-all duration-200 hover:bg-primary-500 hover:text-white">Usuario</button>
                    <button @click="isSupplier = true" :class="{'bg-orange-500 text-white': isSupplier}" class="rounded-lg border border-primary-300 px-3 py-1.5 text-sm transition-all duration-200 hover:bg-primary-500 hover:text-white">Proveedor</button>
                </div>

                <div class="flex flex-col gap-2 md:gap-4">
                    <div v-if="isSupplier" class="flex flex-col gap-2 md:gap-4">
                        <div class=" ">
                            <UiLabel forId="businessName" text="Razón Social" />
                            <UiInput id="businessName" type="text" v-model="registerData.businessName" placeholder="Ingrese su razón social" required />
                        </div>
                        <div class=" ">
                            <UiLabel forId="ruc" text="RUC" />
                            <UiInput id="ruc" type="text" v-model="registerData.ruc" placeholder="Ingrese su RUC" required />
                        </div>
                        <div class=" ">
                            <UiLabel forId="legalRepresentative" text="Representante Legal" />
                            <UiInput id="legalRepresentative" type="text" v-model="registerData.legalRepresentative" placeholder="Ingrese el representante legal" required />
                        </div>
                        <div class=" ">
                            <UiLabel forId="phone" text="Teléfono" />
                            <UiInput id="phone" type="text" v-model="registerData.phone" placeholder="Ingrese el teléfono" required />
                        </div>
                    </div>

                    <div v-else class="flex flex-col gap-2 md:gap-4">
                        <div class=" ">
                            <UiLabel forId="dni" text="DNI" />
                            <UiInput id="dni" type="text" v-model="registerData.dni" placeholder="Ingrese su DNI" required />
                        </div>
                        <div class=" ">
                            <UiLabel forId="firstName" text="Nombre" />
                            <UiInput id="firstName" type="text" v-model="registerData.firstName" placeholder="Ingrese su nombre" required />
                        </div>
                        <div class=" ">
                            <UiLabel forId="lastName" text="Apellido" />
                            <UiInput id="lastName" type="text" v-model="registerData.lastName" placeholder="Ingrese su apellido" required />
                        </div>
                    </div>

                    <div class=" ">
                        <UiLabel forId="email" text="Correo electrónico" />
                        <UiInput id="email" type="email" v-model="registerData.email" placeholder="Ingrese su correo electrónico" required />
                    </div>
                    <div class=" ">
                        <UiLabel forId="password" text="Contraseña" />
                        <UiInput id="password" type="password" v-model="registerData.password" placeholder="Ingrese su contraseña" required />
                    </div>
                    <div class=" ">
                        <UiLabel forId="confirmPassword" text="Confirme su contraseña" />
                        <UiInput id="confirmPassword" type="password" v-model="registerData.confirmPassword" placeholder="Confirme su contraseña" required />
                    </div>

                    <div class="flex flex-row">
                        <input v-model="registerData.terms" type="checkbox" id="terms" class="mr-2" required />
                        <label for="terms" class="block text-sm text-gray-700">Acepto los <a href="terminos-de-uso" class="text-orange-500">términos de uso</a> y las <a href="politicas-de-privacidad" class="text-orange-500">políticas de privacidad</a></label>
                    </div>

                    <button @click="handleRegister" class="w-full rounded-lg bg-orange-500 py-2 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50">Registrarse</button>
                    <p v-if="error" class="mt-4 text-center text-red-500">{{ error }}</p>
                    <p class="text-center text-gray-700">¿Ya tienes una cuenta? <router-link to="/ingresar" class="text-orange-500">Inicia sesión aquí</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template>
