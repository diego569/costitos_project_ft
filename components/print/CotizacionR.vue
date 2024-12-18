<script setup>
    import {ref, onMounted, watch} from "vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "@/services/api";

    const props = defineProps({
        quotationIds: {
            type: Array,
            required: true,
        },
        selectedProject: {
            type: Object,
            required: true,
        },
        selectedArea: {
            type: Object,
            required: true,
        },
    });

    const quotations = ref([]);
    const supplierDetails = ref({});

    // Fetch quotations by IDs
    const fetchQuotationsByIds = async (quotationIds) => {
        try {
            const data = await fetchWithAuth(apiurl("/user/proyectos/quotationdetails/multiple"), "POST", {quotationIds});
            quotations.value = data.data;
            fetchAllSuppliersDetails();
        } catch (err) {
            console.error("Error fetching quotations:", err);
        }
    };

    // Fetch supplier details by supplier IDs
    // Fetch supplier details by supplier IDs
    const fetchSupplierDetails = async (supplierId) => {
        try {
            const response = await fetchWithAuth(apiurl(`/user/proyectos/suppliers/${supplierId}`), "GET");
            supplierDetails.value[supplierId] = response.data; // Asumiendo que `fetchWithAuth` devuelve un JSON directamente
        } catch (err) {
            console.error(`Error fetching supplier details for ID ${supplierId}:`, err);
        }
    };

    // Fetch all unique supplier details for the quotations
    const fetchAllSuppliersDetails = () => {
        const uniqueSupplierIds = new Set();
        quotations.value.forEach((quotation) => {
            quotation.products.forEach((product) => {
                uniqueSupplierIds.add(product.supplierId);
            });
        });
        uniqueSupplierIds.forEach((id) => fetchSupplierDetails(id));
    };

    // Compute unique suppliers
    const computeUniqueSuppliers = (quotation) => {
        const suppliersMap = {};
        quotation?.products?.forEach((product) => {
            if (!suppliersMap[product.supplierId]) {
                suppliersMap[product.supplierId] = product.supplierName || "-";
            }
        });
        return Object.keys(suppliersMap).map((id) => ({
            id,
            name: suppliersMap[id],
        }));
    };

    // Compute unique products for a specific supplier
    const computeUniqueProductsForSupplier = (quotation, supplierName) => {
        const productsMap = {};
        quotation?.products
            ?.filter((product) => product.supplierName === supplierName)
            ?.forEach((product) => {
                if (!productsMap[product.productId]) {
                    productsMap[product.productId] = {
                        productId: product.productId,
                        productName: product.productName,
                        productUnitOfMeasure: product.productUnitOfMeasure,
                        supplierUnitPrice: product.supplierUnitPrice || 0,
                        productQuantity: product.productQuantity || 1,
                    };
                }
            });
        return Object.values(productsMap);
    };

    // Calculate total price for a supplier
    const calculateTotalPriceForSupplier = (products) => {
        return products.reduce((total, product) => {
            const price = parseFloat(product.supplierUnitPrice) || 0;
            const quantity = parseFloat(product.productQuantity) || 0;
            return total + price * quantity;
        }, 0);
    };

    watch(
        () => props.quotationIds,
        (newIds) => {
            if (newIds.length > 0) {
                fetchQuotationsByIds(newIds);
            }
        },
        {immediate: true}
    );

    onMounted(() => {
        if (props.quotationIds?.length) {
            fetchQuotationsByIds(props.quotationIds);
        }
    });
</script>
<template>
    <div>
        <h1 class="mb-4 text-center text-2xl font-bold">SOLICITUD DE COTIZACIÓN</h1>

        <div v-for="(quotation, qIndex) in quotations" :key="qIndex" class="mb-8">
            <div class="mb-4 text-center">
                <h2 class="text-xl font-semibold">Cotización {{ qIndex + 1 }}</h2>
            </div>

            <div v-for="supplier in computeUniqueSuppliers(quotation)" :key="supplier.id" class="mb-6">
                <div class="mb-4">
                    <p><strong>Número de RUC:</strong> {{ supplierDetails[supplier.id]?.ruc }} - {{ supplierDetails[supplier.id]?.name }}</p>
                    <p><strong>Tipo Contribuyente:</strong> {{ supplierDetails[supplier.id]?.contributorType || "No registrado" }}</p>
                    <p><strong>Nombre Comercial:</strong> {{ supplierDetails[supplier.id]?.commercialName || "No registrado" }}</p>
                    <p><strong>Fecha de Inscripción:</strong> {{ supplierDetails[supplier.id]?.registrationDate || "No registrado" }}</p>
                    <p><strong>Fecha de Inicio de Actividades:</strong> {{ supplierDetails[supplier.id]?.activityStartDate || "No registrado" }}</p>
                    <p><strong>Estado del Contribuyente:</strong> {{ supplierDetails[supplier.id]?.contributorStatus || "No registrado" }}</p>
                    <p><strong>Condición del Contribuyente:</strong> {{ supplierDetails[supplier.id]?.contributorCondition || "No registrado" }}</p>
                    <p><strong>Domicilio Fiscal:</strong> {{ supplierDetails[supplier.id]?.fiscalAddress || "No registrada" }}</p>
                    <p><strong>Sistema Emisión de Comprobante:</strong> {{ supplierDetails[supplier.id]?.invoiceEmissionSystem || "No registrado" }}</p>
                    <p><strong>Actividad Comercio Exterior:</strong> {{ supplierDetails[supplier.id]?.foreignTradeActivity || "No registrado" }}</p>
                    <p><strong>Sistema Contabilidad:</strong> {{ supplierDetails[supplier.id]?.accountingSystem || "No registrado" }}</p>
                    <p>
                        <strong>Actividad (es) Económica(s):</strong>
                        <br />
                        Principal - {{ supplierDetails[supplier.id]?.mainEconomicActivity || "No registrada" }}
                        <br />
                        Secundaria 1 - {{ supplierDetails[supplier.id]?.secondaryEconomicActivity1 || "No registrada" }}
                        <br />
                        Secundaria 2 - {{ supplierDetails[supplier.id]?.secondaryEconomicActivity2 || "No registrada" }}
                    </p>
                    <p><strong>Comprobantes de Pago c/aut. de impresión:</strong> {{ supplierDetails[supplier.id]?.authorizedPaymentReceipts || "No registrados" }}</p>
                    <p><strong>Sistema de Emisión Electrónica:</strong> {{ supplierDetails[supplier.id]?.electronicEmissionSystem || "No registrado" }}</p>
                    <p><strong>Emisor electrónico desde:</strong> {{ supplierDetails[supplier.id]?.electronicIssuerSince || "No registrado" }}</p>
                    <p><strong>Comprobantes Electrónicos:</strong> {{ supplierDetails[supplier.id]?.electronicReceipts || "No registrados" }}</p>
                    <p><strong>Afiliado al PLE desde:</strong> {{ supplierDetails[supplier.id]?.affiliatedToPLE ? "Sí" : "No registrado" }}</p>
                    <p><strong>Padrones:</strong> {{ supplierDetails[supplier.id]?.registries || "No registrados" }}</p>
                </div>

                <div class="mb-4 text-center">
                    <p>
                        <strong>Señores:</strong> {{ supplier.name }}
                        <br />
                        <strong>RUC:</strong> {{ supplierDetails[supplier.id]?.ruc || "No registrado" }}
                    </p>
                    <p>
                        <strong>N° C.C.l:</strong> {{ supplierDetails[supplier.id]?.registries || "No registrado" }}
                        <br />
                        <strong>Teléfono:</strong> {{ supplierDetails[supplier.id]?.phone || "No registrado" }}
                    </p>
                    <p><strong>Dirección:</strong> {{ supplierDetails[supplier.id]?.fiscalAddress || "No registrada" }}</p>
                </div>

                <table class="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th class="border border-gray-300 px-4 py-2" colspan="3">ARTICULOS</th>
                            <th class="border border-gray-300 px-4 py-2" colspan="2">PRECIOS</th>
                        </tr>
                        <tr>
                            <th class="border border-gray-300 px-4 py-2">CANT.</th>
                            <th class="border border-gray-300 px-4 py-2">UNIDAD MEDIDA</th>
                            <th class="border border-gray-300 px-4 py-2">DESCRIPCION</th>
                            <th class="border border-gray-300 px-4 py-2 text-right">P. UNITARIO</th>
                            <th class="border border-gray-300 px-4 py-2 text-right">P. TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in computeUniqueProductsForSupplier(quotation, supplier.name)" :key="product.productId">
                            <td class="border border-gray-300 px-4 py-2 text-center">{{ product.productQuantity }}</td>
                            <td class="border border-gray-300 px-4 py-2 text-center">{{ product.productUnitOfMeasure }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ product.productName }}</td>
                            <td class="border border-gray-300 px-4 py-2 text-right">{{ product.supplierUnitPrice }}</td>
                            <td class="border border-gray-300 px-4 py-2 text-right">
                                {{ (parseFloat(product.supplierUnitPrice) * parseFloat(product.productQuantity)).toFixed(2) }}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="border border-gray-300 border-b-transparent border-l-transparent px-4 py-2 text-right font-bold"></td>
                            <td class="border border-gray-300 px-4 py-2 text-right font-bold">TOTAL:</td>
                            <td class="border border-gray-300 px-4 py-2 text-right font-bold">
                                {{ calculateTotalPriceForSupplier(computeUniqueProductsForSupplier(quotation, supplier.name)).toFixed(2) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
