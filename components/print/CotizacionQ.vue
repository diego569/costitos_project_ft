<script setup>
    import {ref, computed, onMounted} from "vue";
    import {useRoute} from "vue-router";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api";
    import ExcelJS from "exceljs";
    import {saveAs} from "file-saver";

    const props = defineProps({
        quotationId: {
            type: String,
            required: true,
        },
    });

    const route = useRoute();
    const quotation = ref(null);
    const quotationName = ref("");
    const formattedDate = ref("");
    const totalLowerPrice = ref(0);
    const totalLowerPriceWithQuantity = ref(0);
    const maxSuppliers = 6; // Máximo número de columnas de proveedores (cotizaciones)

    // Función para obtener la cotización
    const fetchQuotationById = async (quotationId) => {
        try {
            const data = await fetchWithAuth(apiurl(`/user/cotizaciones/quotationdatails/${quotationId}`), "GET");
            quotation.value = data.data;
            quotationName.value = data.name;
            formattedDate.value = data.formattedDate;
            calculateTotals();
        } catch (err) {
            console.error("Error fetching quotation:", err);
        }
    };

    // Calcular totales
    const calculateTotals = () => {
        totalLowerPrice.value = uniqueProducts.value.reduce((total, product) => {
            return total + getLowestPrice(product.productId);
        }, 0);

        totalLowerPriceWithQuantity.value = uniqueProducts.value.reduce((total, product) => {
            return total + getLowestPrice(product.productId) * product.productQuantity;
        }, 0);
    };
    const isLowestPrice = (productId, supplierId) => {
        const prices = quotation.value.filter((product) => product.productId === productId).map((product) => parseFloat(product.supplierUnitPrice));
        const lowestPrice = Math.min(...prices);
        const currentPrice = quotation.value.find((product) => product.productId === productId && product.supplierId === supplierId)?.supplierUnitPrice;
        return parseFloat(currentPrice) === lowestPrice;
    };

    const getSupplierWithLowestPrice = (productId) => {
        const productPrices = quotation.value.filter((product) => product.productId === productId);
        if (productPrices.length === 0) return "N/A";

        const supplierWithLowestPrice = productPrices.reduce((lowest, current) => {
            return parseFloat(current.supplierUnitPrice) < parseFloat(lowest.supplierUnitPrice) ? current : lowest;
        });

        return supplierWithLowestPrice.supplierName || "N/A";
    };
    const calculatePriceWithoutIGV = (price) => {
        return (price / 1.18).toFixed(2); // Divide entre 1.18 para eliminar el IGV
    };

    // Proveedores únicos (hasta maxSuppliers)
    const uniqueSuppliers = computed(() => {
        const suppliersMap = {};
        if (quotation.value) {
            quotation.value.forEach((product) => {
                if (!suppliersMap[product.supplierId]) {
                    suppliersMap[product.supplierId] = {
                        supplierId: product.supplierId,
                        supplierName: product.supplierName,
                    };
                }
            });
        }
        const suppliersList = Object.values(suppliersMap);
        while (suppliersList.length < maxSuppliers) {
            suppliersList.push({supplierId: null, supplierName: ""}); // Añadir espacios vacíos
        }
        return suppliersList.slice(0, maxSuppliers);
    });

    // Productos únicos
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

    // Obtener precio más bajo para un producto
    const getLowestPrice = (productId) => {
        const prices = quotation.value.filter((product) => product.productId === productId).map((product) => parseFloat(product.supplierUnitPrice));
        return Math.min(...prices);
    };

    // Exportar a Excel
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Cotización");

        // Estilo de cabeceras
        const headerStyle = {
            font: {size: 13, bold: true},
            alignment: {vertical: "middle", horizontal: "center"},
            border: {
                top: {style: "thin"},
                left: {style: "thin"},
                bottom: {style: "thin"},
                right: {style: "thin"},
            },
        };

        const cellStyle = {
            font: {size: 12},
            alignment: {vertical: "middle", horizontal: "center"},
            border: {
                top: {style: "thin"},
                left: {style: "thin"},
                bottom: {style: "thin"},
                right: {style: "thin"},
            },
        };

        // Nombre y fecha de cotización
        worksheet.mergeCells("A1:F1");
        worksheet.getCell("A1").value = `Cotización: ${quotationName.value}`;
        worksheet.getCell("A1").style = headerStyle;

        // Espacio en blanco
        worksheet.addRow([]);

        // Cabecera de columnas
        const headers = ["Nº", "Descripción", "UND"];
        for (let i = 1; i <= maxSuppliers; i++) {
            headers.push(`Cotización ${i}`);
        }
        headers.push("P. menor con IGV", "P. menor sin IGV");
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.style = headerStyle;
        });

        // Productos
        uniqueProducts.value.forEach((product, index) => {
            const rowValues = [index + 1, product.productName, product.productUnitOfMeasure];
            uniqueSuppliers.value.forEach((supplier) => {
                const price = quotation.value.find((item) => item.productId === product.productId && item.supplierId === supplier.supplierId)?.supplierUnitPrice || "-";
                rowValues.push(price);
            });
            rowValues.push(getLowestPrice(product.productId).toLocaleString(), (getLowestPrice(product.productId) / 1.18).toFixed(2));
            const row = worksheet.addRow(rowValues);
            row.eachCell((cell) => {
                cell.style = cellStyle;
            });
        });

        // Totales
        const totalRow = worksheet.addRow(["", "", "", ...new Array(maxSuppliers).fill(""), totalLowerPrice.value.toLocaleString(), (totalLowerPrice.value / 1.18).toFixed(2)]);
        totalRow.eachCell((cell) => {
            cell.style = headerStyle;
        });

        // Ajustar columnas
        worksheet.columns.forEach((column, index) => {
            column.width = index === 1 ? 30 : 15;
        });

        // Descargar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: "application/octet-stream"});
        saveAs(blob, `${quotationName.value}.xlsx`);
    };

    // Montar datos iniciales
    onMounted(() => {
        if (props.quotationId) {
            fetchQuotationById(props.quotationId);
        }
    });
</script>
<template>
    <button @click="exportToExcel" class="ml-4 text-sm text-primary-500 hover:underline">Imprimir</button>
    <!-- 
    <div class="bg-white">
        <table v-if="quotation" class="min-w-full table-fixed overflow-auto border-2 border-gray-800 text-center">
            <thead class="bg-white text-xs font-bold text-gray-900 md:text-xs">
                <tr class="bg-white">
                    <th colspan="12" class="border border-gray-800 bg-yellow-500 p-1 text-center text-sm">{{ quotationName }}</th>
                </tr>
                <tr class="bg-gray-200">
                    <th colspan="3" class="border border-gray-800 p-1 text-sm"></th>

                    <th v-for="index in 6" :key="index" class="whitespace-nowrap border border-gray-800 p-1">COTIZACION {{ index }}</th>
                    <th colspan="3" class="border border-gray-800 p-1 text-sm"></th>
                </tr>
                <tr class="border border-gray-800 bg-gray-200">
                    <th class="w-10 border border-gray-800 p-1">Nº</th>
                    <th class="w-1/3 border border-gray-800 p-1 text-start">DESCRIPCION</th>
                    <th class="w-20 border border-gray-800 p-1">UND</th>

                    <th v-for="index in 6" :key="index" class="w-24 border border-gray-800 p-1 text-sm">
                        {{ uniqueSuppliers[index - 1]?.supplierName || "" }}
                    </th>
                    <th class="w-24 border border-gray-800 p-1">PRECIO PREP. MENOR CON IGV</th>

                    <th class="w-24 border border-gray-800 bg-red-300 p-1">PRECIO PRESUPUESTO SIN IGV</th>
                    <th class="w-32 border border-gray-800 p-1">COMENTARIO</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in uniqueProducts" :key="product.productId" class="border border-gray-800 bg-white text-center text-xs md:text-xs">
                    <td class="border border-gray-800 px-1">{{ index + 1 }}</td>
                    <td class="whitespace-normal break-words border border-gray-800 p-1 text-start font-medium text-gray-900">
                        {{ product.productName }}
                    </td>
                    <td class="border border-gray-800 px-1">{{ product.productUnitOfMeasure }}</td>

                    <td v-for="index in 6" :key="index" class="border border-gray-800 px-1">
                        <span v-if="uniqueSuppliers[index - 1]">
                            <span :class="{'font-bold text-gray-800': isLowestPrice(product.productId, uniqueSuppliers[index - 1].supplierId)}">
                                {{ quotation.find((item) => item.productId === product.productId && item.supplierId === uniqueSuppliers[index - 1].supplierId)?.supplierUnitPrice || "-" }}
                            </span>
                        </span>
                    </td>
                    <td class="border border-gray-800 px-1">{{ getLowestPrice(product.productId).toLocaleString() }}</td>
                    <td class="border border-gray-800 bg-red-300 px-1">
                        {{ calculatePriceWithoutIGV(getLowestPrice(product.productId)).toLocaleString() }}
                    </td>
                    <td class="border border-gray-800 p-1">
                        {{ getSupplierWithLowestPrice(product.productId) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div> -->
</template>
