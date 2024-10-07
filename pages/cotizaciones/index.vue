<script setup>
    import {ref, onMounted} from "vue";
    import {getUserId, getToken} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

    const quotations = ref([]);
    const error = ref(null);
    const userId = getUserId();

    const fetchQuotationsByUserId = async () => {
        try {
            if (!userId) {
                throw new Error("User ID not found");
            }

            const response = await fetch(apiurl(`/user/cotizaciones/getquotationbyid/${userId}`), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch quotations");
            }

            const data = await response.json();
            quotations.value = data.data;
        } catch (err) {
            console.error("Error fetching quotations:", err);
            error.value = "Error fetching quotations";
        }
    };

    onMounted(fetchQuotationsByUserId);
</script>
<template>
    <container>
        <h2 class="mb-4 text-xl font-bold text-gray-900">Mis Cotizaciones</h2>
        <div class="bg-white px-4 md:mt-2">
            <div class="flow-root">
                <div class="grid grid-cols-4 gap-4 border-b py-2 font-semibold text-gray-700 md:grid-cols-5">
                    <div class=" ">Número</div>
                    <div>Fecha</div>
                    <div>Nombre</div>
                    <div>Cantidad</div>
                    <div class="sr-only sm:text-right">Acciones</div>
                </div>
                <div class="divide-y divide-gray-200 overflow-x-auto">
                    <div class="relative grid grid-cols-4 gap-4 py-2 md:grid-cols-5" v-for="quotation in quotations" :key="quotation.id">
                        <div class="content-center">
                            <a href="#" class="text-base font-semibold text-gray-900 hover:underline">#{{ quotation.quotationNumber }}</a>
                        </div>

                        <div class="content-center">
                            <div class="flex gap-2">
                                <p class="text-sm font-medium text-gray-500">{{ quotation.date }}</p>
                            </div>
                        </div>

                        <div class="content-center">
                            <div class="flex gap-2">
                                <p class="text-sm text-gray-500">{{ quotation.name }}</p>
                            </div>
                        </div>

                        <div class="absolute right-0 top-3 content-center sm:relative sm:top-auto">
                            <span class="inline-flex rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                                {{ quotation.quotationCount }}
                            </span>
                        </div>

                        <div class="col-span-5 content-center md:col-span-1">
                            <NuxtLink :to="{name: 'cotizaciones-id', params: {id: quotation.id}}" class="">
                                <PrimaryButton>Ver detalles</PrimaryButton>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </container>
</template>
