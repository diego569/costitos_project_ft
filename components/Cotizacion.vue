<script setup>
    import {ref, onMounted, computed} from "vue";
    import {useRoute} from "vue-router";
    import {getCart, fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

    const props = defineProps({
        quotationId: {
            type: String,
            required: true,
        },
        selectedArea: {
            type: Object,
            required: true,
        },
    });

    const route = useRoute();
    const quotation = ref(null);
    const quotationName = ref("");
    const formattedDate = ref("");
    const totalLowerPrice = ref(0);
    const totalLowerPriceWithQuantity = ref(0);

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

    onMounted(() => {
        if (props.quotationId) {
            fetchQuotationById(props.quotationId);
        }
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

    const calculateTotals = () => {
        totalLowerPrice.value = uniqueProducts.value.reduce((total, product) => {
            return total + getLowestPrice(product.productId);
        }, 0);

        totalLowerPriceWithQuantity.value = uniqueProducts.value.reduce((total, product) => {
            return total + getLowestPrice(product.productId) * product.productQuantity;
        }, 0);
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
            await fetchWithAuth(apiurl(`/user/cotizaciones/quotationdatails/${quotationId}`), "PUT", {name: newQuotationName.value});
            quotationName.value = newQuotationName.value;
            closeModal();
        } catch (err) {
            console.error("Error updating quotation name:", err);
        }
    };

    const isLowestPrice = (productId, supplierId) => {
        const prices = quotation.value.filter((product) => product.productId === productId).map((product) => parseFloat(product.supplierUnitPrice));
        const lowestPrice = Math.min(...prices);
        const currentPrice = quotation.value.find((product) => product.productId === productId && product.supplierId === supplierId)?.supplierUnitPrice;
        return parseFloat(currentPrice) === lowestPrice;
    };

    const calculatePriceWithoutIGV = (price) => {
        return (price / 1.18).toFixed(2); // Divide entre 1.18 para eliminar el IGV
    };

    const getSupplierWithLowestPrice = (productId) => {
        const productPrices = quotation.value.filter((product) => product.productId === productId);
        if (productPrices.length === 0) return "N/A";

        const supplierWithLowestPrice = productPrices.reduce((lowest, current) => {
            return parseFloat(current.supplierUnitPrice) < parseFloat(lowest.supplierUnitPrice) ? current : lowest;
        });

        return supplierWithLowestPrice.supplierName || "N/A";
    };

    import ExcelJS from "exceljs";
    import {saveAs} from "file-saver";

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Cotización");

        // Configuración de estilos
        const headerStyle = {
            font: {size: 13, bold: true, color: {argb: "FF000000"}}, // Negro oscuro
            alignment: {vertical: "middle", horizontal: "center", wrapText: true},
            fill: {type: "pattern", pattern: "solid", fgColor: {argb: "FFCCCCCC"}}, // Background color
            border: {
                top: {style: "thin", color: {argb: "FF374151"}}, // Gray-700 border solid
                left: {style: "thin", color: {argb: "FF374151"}},
                bottom: {style: "thin", color: {argb: "FF374151"}},
                right: {style: "thin", color: {argb: "FF374151"}},
            },
        };

        const cellStyle = {
            font: {size: 12, color: {argb: "FF000000"}}, // Negro oscuro
            alignment: {vertical: "middle", wrapText: true},
            border: {
                top: {style: "thin", color: {argb: "FF374151"}}, // Gray-700 border solid
                left: {style: "thin", color: {argb: "FF374151"}},
                bottom: {style: "thin", color: {argb: "FF374151"}},
                right: {style: "thin", color: {argb: "FF374151"}},
            },
        };

        const puCellStyle = {
            ...cellStyle,
            alignment: {vertical: "middle", horizontal: "center", wrapText: true},
        };

        const bgHighlightStyle = {
            fill: {type: "pattern", pattern: "solid", fgColor: {argb: "FFCCCCCC"}}, // Background color
        };

        // Nombre de la cotización y fecha
        worksheet.mergeCells("A1", `F1`); // Ajusta el rango de celdas según el número total de columnas que tengas
        worksheet.mergeCells("A2", `F2`); // Ajusta el rango de celdas según el número total de columnas que tengas

        const row1 = worksheet.getCell("A1");
        row1.value = `Cotización: ${quotationName.value}`;
        row1.font = {size: 14, bold: true, color: {argb: "FF000000"}};
        row1.alignment = {vertical: "middle", horizontal: "center"};
        row1.height = 25;

        const row2 = worksheet.getCell("A2");
        row2.value = `Fecha: ${formattedDate.value}`;
        row2.font = {size: 12, italic: true, color: {argb: "FF000000"}};
        row2.alignment = {vertical: "middle", horizontal: "center"};
        row2.height = 25;

        worksheet.addRow([]); // Espacio entre tablas

        // Información de proveedores
        const supplierHeaders = ["Nombre o razón social", "", "", ...uniqueSuppliers.value.map((supplier) => supplier.supplierName)];
        const supplierRUC = ["RUC", "", "", ...uniqueSuppliers.value.map((supplier) => supplier.supplierRuc)];
        const supplierAddress = ["Domicilio fiscal", "", "", ...uniqueSuppliers.value.map((supplier) => supplier.supplierAddress)];
        const supplierContact = ["Contactar al proveedor", "", "", ...uniqueSuppliers.value.map((supplier) => supplier.supplierPhone)];

        const supplierHeaderRow = worksheet.addRow(supplierHeaders);
        supplierHeaderRow.getCell(1).style = {...headerStyle, ...bgHighlightStyle};
        supplierHeaderRow.eachCell((cell, colNumber) => {
            if (colNumber > 1 && cell.value) {
                cell.style = headerStyle;
            }
        });
        supplierHeaderRow.height = 25;

        const supplierRUCRow = worksheet.addRow(supplierRUC);
        supplierRUCRow.getCell(1).style = {...cellStyle, ...bgHighlightStyle};
        supplierRUCRow.eachCell((cell, colNumber) => {
            if (colNumber > 1 && cell.value) {
                cell.style = cellStyle;
            }
        });
        supplierRUCRow.height = 20;

        const supplierAddressRow = worksheet.addRow(supplierAddress);
        supplierAddressRow.getCell(1).style = {...cellStyle, ...bgHighlightStyle};
        supplierAddressRow.eachCell((cell, colNumber) => {
            if (colNumber > 1 && cell.value) {
                cell.style = cellStyle;
            }
        });
        supplierAddressRow.height = 20;

        const supplierContactRow = worksheet.addRow(supplierContact);
        supplierContactRow.getCell(1).style = {...cellStyle, ...bgHighlightStyle};
        supplierContactRow.eachCell((cell, colNumber) => {
            if (colNumber > 1 && cell.value) {
                cell.style = cellStyle;
            }
        });
        supplierContactRow.height = 20;

        worksheet.addRow([]); // Espacio entre tablas

        // Combinar las primeras tres celdas para "Nombre o razón social"
        worksheet.mergeCells(supplierHeaderRow.number, 1, supplierHeaderRow.number, 3);
        worksheet.mergeCells(supplierRUCRow.number, 1, supplierRUCRow.number, 3);
        worksheet.mergeCells(supplierAddressRow.number, 1, supplierAddressRow.number, 3);
        worksheet.mergeCells(supplierContactRow.number, 1, supplierContactRow.number, 3);

        // Cabeceras para productos
        const headers = ["Descripción", "Unidad", "Cantidad"];
        uniqueSuppliers.value.forEach(() => {
            headers.push("P.U.");
        });
        headers.push("P. menor", "P. menor x Cantidad");

        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell, colNumber) => {
            if (cell.value) {
                cell.style = {...headerStyle, ...bgHighlightStyle};
            }
        });
        headerRow.height = 25;

        // Productos
        uniqueProducts.value.forEach((product) => {
            const rowValues = [product.productName, product.productUnitOfMeasure, product.productQuantity];

            uniqueSuppliers.value.forEach((supplier) => {
                const price = quotation.value.find((item) => item.productId === product.productId && item.supplierId === supplier.supplierId)?.supplierUnitPrice || "-";
                rowValues.push(price);
            });

            rowValues.push(getLowestPrice(product.productId).toLocaleString(), (getLowestPrice(product.productId) * product.productQuantity).toLocaleString());

            const row = worksheet.addRow(rowValues);
            row.eachCell((cell, colNumber) => {
                if (colNumber > 3 && colNumber <= 3 + uniqueSuppliers.value.length && cell.value) {
                    cell.style = puCellStyle;
                } else if (cell.value) {
                    cell.style = cellStyle;
                }
            });

            // Ajuste de altura basado en el contenido
            const descriptionLength = row.getCell(1).value.length;
            row.height = descriptionLength > 30 ? Math.ceil(descriptionLength / 30) * 25 : 25;
        });

        // Totales
        const totalRowValues = new Array(3 + uniqueSuppliers.value.length).fill("");
        totalRowValues.push(`  ${totalLowerPrice.value.toLocaleString()}`, `  ${totalLowerPriceWithQuantity.value.toLocaleString()}`);
        const totalRow = worksheet.addRow(totalRowValues);
        totalRow.eachCell((cell, colNumber) => {
            if (cell.value) {
                cell.style = headerStyle;
            }
        });
        totalRow.height = 25;

        worksheet.columns.forEach((column, index) => {
            if (index === 0) {
                column.width = 60;
            } else if (index === 1 || index === 2) {
                column.width = 20;
            } else {
                column.width = 20;
            }
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: "application/octet-stream"});
        saveAs(blob, `${quotationName.value}.xlsx`);
    };
</script>
<template>
    <div class="bg-white">
        <table v-if="quotation" class="min-w-full table-fixed overflow-auto border-2 border-gray-800 text-center">
            <thead class="bg-white text-xs font-bold text-gray-900 md:text-xs">
                <tr class="bg-white">
                    <!-- <th colspan="12" class="border border-gray-800 bg-yellow-500 p-1 text-center text-sm">{{ quotationName }}</th> -->
                    <th colspan="12" class="border border-gray-800 bg-yellow-500 p-1 text-center text-sm uppercase">CUADRO COMPARATIVO DE COTIZACIÓN DE MATERIALES DE CONSTRUCCIÓN - {{ props.selectedArea.type }}</th>
                </tr>
                <tr class="bg-gray-200">
                    <th colspan="3" class="border border-gray-800 p-1 text-sm"></th>

                    <!-- <th v-for="(supplier, index) in uniqueSuppliers" :key="supplier.supplierId" class="whitespace-nowrap border border-gray-800 p-1">COTIZACION {{ index + 1 }}</th> -->
                    <th v-for="index in 6" :key="index" class="whitespace-nowrap border border-gray-800 p-1">COTIZACION {{ index }}</th>
                    <th colspan="3" class="border border-gray-800 p-1 text-sm"></th>
                </tr>
                <tr class="border border-gray-800 bg-gray-200">
                    <th class="w-10 border border-gray-800 p-1">Nº</th>
                    <th class="w-1/3 border border-gray-800 p-1 text-start">DESCRIPCION</th>
                    <th class="w-20 border border-gray-800 p-1">UND</th>

                    <!-- <th v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="w-24 border border-gray-800 p-1 text-sm">
                        {{ supplier.supplierName }}
                    </th> -->
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
                    <!-- <td v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="border border-gray-800 px-1">
                        <span :class="{'font-bold text-gray-800': isLowestPrice(product.productId, supplier.supplierId)}">
                            {{ quotation.find((item) => item.productId === product.productId && item.supplierId === supplier.supplierId)?.supplierUnitPrice || "-" }}
                        </span>
                    </td> -->
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
    </div>
</template>
