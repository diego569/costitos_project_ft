<script setup>
    import {ref, onMounted} from "vue";
    import {getUserId} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

    const supplier = ref({
        name: "",
        ruc: "",
        email: "",
        password: "",
        enabled: true,
        role: "",
        adminAuthorizedId: "",
        imageId: "",
        contributorType: "",
        documentType: "",
        commercialName: "",
        registrationDate: "",
        activityStartDate: "",
        contributorStatus: "",
        contributorCondition: "",
        fiscalAddress: "",
        invoiceEmissionSystem: "",
        foreignTradeActivity: "",
        accountingSystem: "",
        mainEconomicActivity: "",
        secondaryEconomicActivity1: "",
        authorizedPaymentReceipts: "",
        electronicEmissionSystem: "",
        electronicIssuerSince: "",
        electronicReceipts: "",
        affiliatedToPLE: false,
        registries: "",
    });

    const isLoading = ref(false);
    const message = ref({text: "", type: ""});
    const supplierId = getUserId();
    const fetchSupplierProfile = async () => {
        try {
            isLoading.value = true;
            const response = await fetch(apiurl(`/supplier/perfil/${supplierId}`));

            if (!response.ok) throw new Error("Error al obtener el perfil del proveedor.");

            const data = await response.json();
            supplier.value = data.data;
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
            const response = await fetch(apiurl(`/supplier/perfil/${supplierId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(supplier.value),
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
        fetchSupplierProfile();
    });
</script>
<template>
    <div class="flex items-center">
        <NuxtLink to="/catalogo" class="inline-flex items-center rounded pt-2 text-gray-500 hover:text-primary-800">
            <Icon name="my-icon:arrow-back" size="15" />
            Volver a explorar
        </NuxtLink>
    </div>
    <div class="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-8">
        <div class="w-full rounded-lg bg-white p-6 shadow-md">
            <h1 class="mb-6 text-xl font-bold text-gray-700">Perfil del Proveedor</h1>

            <div v-if="message.text" :class="message.type === 'success' ? 'text-green-500' : 'text-red-500'" class="mb-4">
                {{ message.text }}
            </div>

            <div class="space-y-4">
                <div>
                    <UiLabel forId="name" text="Nombre del proveedor:" />
                    <UiInput id="name" v-model="supplier.name" placeholder="Ingrese el nombre del proveedor" />
                </div>
                <div>
                    <UiLabel forId="ruc" text="RUC:" />
                    <UiInput id="ruc" v-model="supplier.ruc" placeholder="Ingrese el RUC" />
                </div>
                <div>
                    <UiLabel forId="email" text="Correo Electrónico:" />
                    <UiInput id="email" type="email" v-model="supplier.email" placeholder="Ingrese el correo electrónico" />
                </div>
                <div>
                    <UiLabel forId="role" text="Rol del proveedor:" />
                    <UiInput id="role" v-model="supplier.role" placeholder="Ingrese el rol del proveedor" />
                </div>
                <div>
                    <UiLabel forId="contributorType" text="Tipo de contribuyente:" />
                    <UiInput id="contributorType" v-model="supplier.contributorType" placeholder="Ingrese el tipo de contribuyente" />
                </div>
                <div>
                    <UiLabel forId="documentType" text="Tipo de documento:" />
                    <UiInput id="documentType" v-model="supplier.documentType" placeholder="Ingrese el tipo de documento" />
                </div>
                <div>
                    <UiLabel forId="commercialName" text="Nombre comercial:" />
                    <UiInput id="commercialName" v-model="supplier.commercialName" placeholder="Ingrese el nombre comercial" />
                </div>
                <div>
                    <UiLabel forId="mainEconomicActivity" text="Actividad económica principal:" />
                    <UiInput id="mainEconomicActivity" v-model="supplier.mainEconomicActivity" placeholder="Ingrese la actividad económica principal" />
                </div>
                <div>
                    <UiLabel forId="fiscalAddress" text="Dirección fiscal:" />
                    <UiInput id="fiscalAddress" v-model="supplier.fiscalAddress" placeholder="Ingrese la dirección fiscal" />
                </div>
                <div>
                    <UiLabel forId="invoiceEmissionSystem" text="Sistema de emisión de facturas:" />
                    <UiInput id="invoiceEmissionSystem" v-model="supplier.invoiceEmissionSystem" placeholder="Ingrese el sistema de emisión de facturas" />
                </div>
                <div>
                    <UiLabel forId="foreignTradeActivity" text="Actividad de comercio exterior:" />
                    <UiInput id="foreignTradeActivity" v-model="supplier.foreignTradeActivity" placeholder="Ingrese la actividad de comercio exterior" />
                </div>
                <div>
                    <UiLabel forId="accountingSystem" text="Sistema contable:" />
                    <UiInput id="accountingSystem" v-model="supplier.accountingSystem" placeholder="Ingrese el sistema contable" />
                </div>
                <div>
                    <UiLabel forId="authorizedPaymentReceipts" text="Recibos de pago autorizados:" />
                    <UiInput id="authorizedPaymentReceipts" v-model="supplier.authorizedPaymentReceipts" placeholder="Ingrese los recibos de pago autorizados" />
                </div>
                <div>
                    <UiLabel forId="electronicEmissionSystem" text="Sistema de emisión electrónica:" />
                    <UiInput id="electronicEmissionSystem" v-model="supplier.electronicEmissionSystem" placeholder="Ingrese el sistema de emisión electrónica" />
                </div>
                <div>
                    <UiLabel forId="registries" text="Registros adicionales:" />
                    <UiInput id="registries" v-model="supplier.registries" placeholder="Ingrese los registros adicionales" />
                </div>
                <div>
                    <UiLabel forId="affiliatedToPLE" text="Afiliado al PLE:" />
                    <UiInput id="affiliatedToPLE" v-model="supplier.affiliatedToPLE" />
                </div>

                <div class="mt-6 flex justify-center space-x-4">
                    <UiButton variant="primary" :isLoading="isLoading" loadingText="Guardando..." defaultText="Guardar cambios" @click="saveChanges" />
                </div>
            </div>
        </div>
    </div>
</template>
