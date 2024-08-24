<script setup>
    import {ref, onMounted, computed} from "vue";
    import {useRoute} from "vue-router";
    import {getToken, getCart, isLocalStorageAvailable} from "@/services/auth";

    const route = useRoute();
    const quotation = ref(null);
    const quotationName = ref("");

    const fetchQuotationById = async (quotationId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/cotizaciones/quotationdatails/${quotationId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch quotation");
            }
            const data = await response.json();
            quotation.value = data.data;
            quotationName.value = data.name;
        } catch (err) {
            console.error("Error fetching quotation:", err);
        }
    };

    onMounted(() => {
        const quotationId = route.params.id;
        fetchQuotationById(quotationId);
    });

    const uniqueSuppliers = computed(() => {
        const suppliersMap = {};
        if (quotation.value) {
            quotation.value.forEach((product) => {
                if (!suppliersMap[product.supplierId]) {
                    suppliersMap[product.supplierId] = {
                        supplierId: product.supplierId,
                        supplierName: product.supplierName,
                        supplierEmail: product.supplierEmail,
                        supplierPhoto: product.supplierPhoto,
                        supplierRuc: product.supplierRuc,
                        supplierAddress: product.supplierAddress,
                        supplierPhone: product.supplierPhone,
                    };
                }
            });
        }
        return Object.values(suppliersMap);
    });

    const uniqueProducts = computed(() => {
        const productsMap = {};
        if (quotation.value) {
            quotation.value.forEach((product) => {
                if (!productsMap[product.productId]) {
                    productsMap[product.productId] = {
                        productId: product.productId,
                        productName: product.productName,
                        productUnitOfMeasure: product.productUnitOfMeasure,
                        productQuantity: product.productQuantity,
                    };
                }
            });
        }
        return Object.values(productsMap);
    });

    const getLowestPrice = (productId) => {
        const prices = quotation.value.filter((product) => product.productId === productId).map((product) => parseFloat(product.supplierUnitPrice));
        return Math.min(...prices);
    };

    const cart = ref(getCart()); // Obtener el carrito usando la función de auth.js

    const newQuotationName = ref("");
    const isModalOpen = ref(false);

    const openModal = () => {
        newQuotationName.value = quotationName.value;
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
    };

    const updateQuotationName = async () => {
        const quotationId = route.params.id;

        try {
            const response = await fetch(`http://localhost:8000/api/user/cotizaciones/quotationdatails/${quotationId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({name: newQuotationName.value}),
            });

            if (!response.ok) {
                throw new Error("Failed to update quotation name");
            }

            quotationName.value = newQuotationName.value;
            closeModal();
        } catch (err) {
            console.error("Error updating quotation name:", err);
        }
    };
</script>
<template>
    <div class=" ">
        <div>
            <h2 class="mb-4 text-xl font-bold">
                {{ quotationName }}
                <button @click="openModal" class="ml-4 text-sm text-blue-500 hover:underline">Editar</button>
            </h2>

            <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="rounded-md bg-white p-6">
                    <h3 class="mb-4 text-lg font-semibold">Editar Nombre de Cotización</h3>
                    <input v-model="newQuotationName" type="text" class="mb-4 w-full border p-2" placeholder="Nuevo nombre de cotización" />
                    <div class="flex justify-end">
                        <button @click="closeModal" class="mr-2 rounded-md bg-gray-300 px-4 py-2">Cancelar</button>
                        <button @click="updateQuotationName" class="rounded-md bg-blue-500 px-4 py-2 text-white">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
        <table v-if="quotation" class="min-w-full">
            <thead class=" ">
                <tr class="bg-white">
                    <th colspan="3" class="border p-2 text-start text-sm font-normal">Nombre o razón social</th>
                    <th v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="border p-2 text-sm font-normal">
                        {{ supplier.supplierName }}
                    </th>
                </tr>
                <tr class="bg-white">
                    <th colspan="3" class="border p-2 text-start text-sm font-normal">RUC</th>
                    <th v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="border p-2 text-sm font-normal">{{ supplier.supplierRuc }}</th>
                </tr>
                <tr class="bg-white">
                    <th colspan="3" class="border p-2 text-start text-sm font-normal">Domicilio fiscal</th>
                    <th v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="border p-2 text-sm font-normal">
                        {{ supplier.supplierAddress }}
                    </th>
                </tr>
                <tr class="bg-white">
                    <th colspan="3" class="border p-2 text-start text-sm font-normal">Contactar al proveedor</th>
                    <th v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="border p-2 text-sm font-normal">
                        <span class="text-green-500">{{ supplier.supplierPhone }}</span>
                    </th>
                </tr>
                <tr>
                    &nbsp;
                </tr>
                <tr class="bg-gray-200">
                    <th class="p-2 text-sm font-medium">Descripción</th>
                    <th class="p-2 text-sm font-medium">Unidad</th>
                    <th class="p-2 text-sm font-medium">Cantidad</th>
                    <th v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="p-2 text-sm font-medium">P.U.</th>
                    <th class="p-2 text-sm font-medium">P. menor</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in uniqueProducts" :key="product.productId" class="bg-white">
                    <td class="border px-4 py-2 text-sm font-normal">{{ product.productName }}</td>
                    <td class="border px-4 py-2 text-sm font-normal">{{ product.productUnitOfMeasure }}</td>
                    <td class="border px-4 py-2 text-sm font-normal">{{ product.productQuantity }}</td>
                    <td v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="border px-4 py-2 text-sm font-normal">{{ quotation.find((item) => item.productId === product.productId && item.supplierId === supplier.supplierId)?.supplierUnitPrice || "-" }}</td>
                    <td class="border px-4 py-2 text-sm font-normal">S/ {{ getLowestPrice(product.productId) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
