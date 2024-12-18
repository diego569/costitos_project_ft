<script setup>
    import {ref, computed, onMounted} from "vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api";
    import ExcelJS from "exceljs";
    import {saveAs} from "file-saver";

    const props = defineProps({
        quotationIds: {
            type: Array,
            required: true,
        },
    });

    const quotations = ref([]);
    const maxSuppliers = 6;

    const qid = ref([null]);

    const fetchQuotationsDetails = async (quotationIds) => {
        try {
            // Asegúrate de enviar el valor real de quotationIds
            const payload = {quotationIds: quotationIds.value || quotationIds};

            // Mostrar en consola lo que se está enviando
            console.log("Sending data to backend:", payload);

            const response = await fetchWithAuth(apiurl("/user/proyectos/quotations/details"), "POST", payload);

            if (!response.ok) {
                throw new Error("Failed to fetch quotation details.");
            }
            g;
            const data = await response.json();

            // Mostrar en consola lo que se recibe del backend
            console.log("Received data from backend:", data);

            // Guardar los datos en la variable `quotations`
            quotations.value = data.data;
        } catch (err) {
            // Mostrar el error en la consola
            console.error("Error fetching quotation details:", err);
        }
    };

    // Calcular precios más bajos para un producto
    const getLowestPrice = (productId, products) => {
        const prices = products.filter((product) => product.productId === productId).map((product) => parseFloat(product.supplierUnitPrice));
        return Math.min(...prices);
    };

    // Obtener proveedores únicos (limitado por `maxSuppliers`)
    const uniqueSuppliers = computed(() => {
        const suppliersMap = {};
        quotations.value.forEach((quote) => {
            quote.products.forEach((product) => {
                if (!suppliersMap[product.supplierId]) {
                    suppliersMap[product.supplierId] = {
                        supplierId: product.supplierId,
                        supplierName: product.supplierName,
                    };
                }
            });
        });
        const suppliersList = Object.values(suppliersMap);
        while (suppliersList.length < maxSuppliers) {
            suppliersList.push({supplierId: null, supplierName: ""});
        }
        return suppliersList.slice(0, maxSuppliers);
    });

    // Productos únicos
    const uniqueProducts = computed(() => {
        const productsMap = {};
        quotations.value.forEach((quote) => {
            quote.products.forEach((product) => {
                if (!productsMap[product.productId]) {
                    productsMap[product.productId] = {
                        productId: product.productId,
                        productName: product.productName,
                        productUnitOfMeasure: product.productUnitOfMeasure,
                        productQuantity: product.productQuantity,
                    };
                }
            });
        });
        return Object.values(productsMap);
    });

    onMounted(() => {
        if (props.quotationIds.length > 0) {
            console.log("Preparing to send quotation IDs:", props.quotationIds);

            // Asegurarte de que es un array de strings
            const isValid = Array.isArray(props.quotationIds) && props.quotationIds.every((id) => typeof id === "string");

            if (isValid) {
                fetchQuotationsDetails(props.quotationIds);
            } else {
                console.error("Invalid quotationIds format:", props.quotationIds);
            }
        }
    });
</script>
<template>
    <br />
    <br />
    recibe{{ quotationIds }} <br /><br />
    reemplaza{{ qid }}
    <div>
        <button @click="exportToExcel" class="ml-4 text-sm text-primary-500 hover:underline">Exportar a Excel</button>

        <div v-if="quotations.length > 0" class="mt-4 bg-white">
            <div v-for="quote in quotations" :key="quote.quotationId" class="quotation-section">
                <h3 class="mb-4 text-lg font-bold">{{ quote.quotationName }}</h3>
                <table class="min-w-full table-fixed border-collapse border border-gray-300">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="border border-gray-300 p-2">Nº</th>
                            <th class="border border-gray-300 p-2">Descripción</th>
                            <th class="border border-gray-300 p-2">UND</th>
                            <th v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="border border-gray-300 p-2">
                                {{ supplier.supplierName || "N/A" }}
                            </th>
                            <th class="border border-gray-300 p-2">Precio Menor (IGV)</th>
                            <th class="border border-gray-300 p-2">Precio Menor (sin IGV)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in uniqueProducts" :key="product.productId">
                            <td class="border border-gray-300 p-2">{{ index + 1 }}</td>
                            <td class="border border-gray-300 p-2">{{ product.productName }}</td>
                            <td class="border border-gray-300 p-2">{{ product.productUnitOfMeasure }}</td>
                            <td v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="border border-gray-300 p-2">
                                {{ quotations.flatMap((quote) => quote.products).find((item) => item.productId === product.productId && item.supplierId === supplier.supplierId)?.supplierUnitPrice || "-" }}
                            </td>
                            <td class="border border-gray-300 p-2">
                                {{
                                    getLowestPrice(
                                        product.productId,
                                        quotations.flatMap((quote) => quote.products)
                                    )
                                }}
                            </td>
                            <td class="border border-gray-300 p-2">
                                {{
                                    (
                                        getLowestPrice(
                                            product.productId,
                                            quotations.flatMap((quote) => quote.products)
                                        ) / 1.18
                                    ).toFixed(2)
                                }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else>
            <p>Cargando cotizaciones...</p>
        </div>
    </div>
</template>
