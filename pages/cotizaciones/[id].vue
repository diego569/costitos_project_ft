<script setup>
    import {ref, onMounted, computed} from "vue";
    import {useRoute} from "vue-router";

    const route = useRoute();
    const quotation = ref(null);

    const fetchQuotationById = async (quotationId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/cotizaciones/quotationdatails/${quotationId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch quotation");
            }
            const data = await response.json();
            quotation.value = data.data;
        } catch (err) {
            console.error("Error fetching quotation:", err);
        }
    };

    onMounted(() => {
        const quotationId = route.params.id;
        fetchQuotationById(quotationId);
        // addProductsToQuotation(quotationId);
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

    // -----
    const cart = ref([]);
    const isLocalStorageAvailable = () => {
        try {
            const test = "__localStorageTest__";
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    if (isLocalStorageAvailable()) {
        cart.value = JSON.parse(localStorage.getItem("cart")) || [];
    }
    const getToken = () => {
        if (isLocalStorageAvailable()) {
            return localStorage.getItem("token");
        }
        return null;
    };

    // const addProductsToQuotation = async (quotationId, cart) => {
    //     try {
    //         const token = getToken();
    //         if (!token) {
    //             throw new Error("No token found");
    //         }

    //         const products = cart.map((item) => ({
    //             productId: item.id,
    //             quantity: item.quantity,
    //         }));

    //         const response = await fetch(`http://localhost:8000/api/quotations/${quotationId}/`, {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({products}),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Error al agregar productos a la cotización");
    //         }

    //         const data = await response.json();
    //         console.log("Productos agregados a la cotización:", data);
    //         console.table(data);
    //         const qpIds = data.qpId;

    //         const pricesResponse = await fetch(`http://localhost:8000/api/quotation/products/prices`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({qpIds}),
    //         });

    //         if (!pricesResponse.ok) {
    //             throw new Error("Error al obtener precios de los proveedores");
    //         }

    //         const pricesData = await pricesResponse.json();
    //         console.log("Precios de los proveedores:", pricesData);
    //         console.table(pricesData);

    //         const supplierProductsResponse = await fetch("http://localhost:8000/api/quotation3/supplier-products", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(pricesData), // Asegúrate de que pricesData es la variable que contiene tu array de productos
    //         });

    //         if (supplierProductsResponse.ok) {
    //             const responseData = await supplierProductsResponse.json();
    //             console.log("Productos creados:", responseData);
    //         } else {
    //             console.error("Error al crear productos:", supplierProductsResponse.statusText);
    //         }

    //         console.log("Productos y precios de los proveedores agregados a la cotización con éxito");

    //         showAlertMessage("Productos y precios de los proveedores agregados a la cotización con éxito");
    //     } catch (error) {
    //         console.error("Error al agregar productos a la cotización:", error);
    //         showAlertMessage("Error al agregar productos a la cotización");
    //     }
    // };
</script>
<template>
    <div class=" ">
        <h2 class="mb-4 text-xl font-bold">Cotizar</h2>
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
