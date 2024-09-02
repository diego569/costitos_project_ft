<script setup>
    import {ref, onMounted, computed} from "vue";
    import {useRoute} from "vue-router";
    import {getCart, fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";

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

    //
    //
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
        supplierHeaderRow.getCell(1).style = {...headerStyle, ...bgHighlightStyle}; // Solo la primera celda tiene bg
        supplierHeaderRow.eachCell((cell, colNumber) => {
            if (colNumber > 1 && cell.value) {
                cell.style = headerStyle; // Aplica bordes solo a celdas con texto
            }
        });
        supplierHeaderRow.height = 25;

        const supplierRUCRow = worksheet.addRow(supplierRUC);
        supplierRUCRow.getCell(1).style = {...cellStyle, ...bgHighlightStyle}; // Solo la primera celda tiene bg
        supplierRUCRow.eachCell((cell, colNumber) => {
            if (colNumber > 1 && cell.value) {
                cell.style = cellStyle; // Aplica bordes solo a celdas con texto
            }
        });
        supplierRUCRow.height = 20;

        const supplierAddressRow = worksheet.addRow(supplierAddress);
        supplierAddressRow.getCell(1).style = {...cellStyle, ...bgHighlightStyle}; // Solo la primera celda tiene bg
        supplierAddressRow.eachCell((cell, colNumber) => {
            if (colNumber > 1 && cell.value) {
                cell.style = cellStyle; // Aplica bordes solo a celdas con texto
            }
        });
        supplierAddressRow.height = 20;

        const supplierContactRow = worksheet.addRow(supplierContact);
        supplierContactRow.getCell(1).style = {...cellStyle, ...bgHighlightStyle}; // Solo la primera celda tiene bg
        supplierContactRow.eachCell((cell, colNumber) => {
            if (colNumber > 1 && cell.value) {
                cell.style = cellStyle; // Aplica bordes solo a celdas con texto
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
        headerRow.height = 25; // Mayor altura para cabeceras

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
                    // Aplicar estilo centrado solo a las celdas P.U.
                    cell.style = puCellStyle;
                } else if (cell.value) {
                    cell.style = cellStyle;
                }
            });

            // Ajuste de altura basado en el contenido
            const descriptionLength = row.getCell(1).value.length;
            row.height = descriptionLength > 30 ? Math.ceil(descriptionLength / 30) * 25 : 25; // Mayor altura para contenido
        });

        // Totales
        const totalRowValues = new Array(3 + uniqueSuppliers.value.length).fill("");
        totalRowValues.push(`S/. ${totalLowerPrice.value.toLocaleString()}`, `S/. ${totalLowerPriceWithQuantity.value.toLocaleString()}`);
        const totalRow = worksheet.addRow(totalRowValues);
        totalRow.eachCell((cell, colNumber) => {
            if (cell.value) {
                cell.style = headerStyle;
            }
        });
        totalRow.height = 25; // Mayor altura para la fila de totales

        // Ajustar el ancho de las columnas
        worksheet.columns.forEach((column, index) => {
            if (index === 0) {
                column.width = 60; // Ancho para la primera columna
            } else if (index === 1 || index === 2) {
                column.width = 20; // Ancho para la segunda y tercera columna
            } else {
                column.width = 20; // Ancho estándar para las demás columnas
            }
        });

        // Guardar el archivo con el nombre de la cotización
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: "application/octet-stream"});
        saveAs(blob, `${quotationName.value}.xlsx`);
    };
</script>
<template>
    <div class="flex items-center justify-between">
        <NuxtLink to="/cotizaciones" class="inline-flex items-center rounded py-2 text-primary-600 hover:text-primary-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="mr-2 h-4 w-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Cotizaciones
        </NuxtLink>
        <button @click="exportToExcel" class="inline-flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="mr-2 h-4 w-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Imprimir
        </button>
    </div>

    <div class="bg-white md:p-4">
        <div>
            <h2 class="px-4 py-2 text-xl font-bold md:text-center">
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
            <h2 class="mb-4 px-4 text-sm font-medium md:text-center">({{ formattedDate }})</h2>
        </div>
        <table v-if="quotation" class="min-w-full">
            <thead class="bg-white text-xs text-gray-900 md:text-sm">
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
                <hr />
                <tr class="bg-gray-100">
                    <th scope="col" class="px-4 py-4">Descripción</th>
                    <th scope="col" class="px-4 py-3">Unidad</th>
                    <th scope="col" class="px-4 py-3">Cantidad</th>
                    <th v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="px-4 py-3 text-sm font-normal">P.U.</th>
                    <th class="p-2 text-sm font-medium">P. menor</th>
                    <th class="p-2 text-sm font-medium">P. menor x Cantidad</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in uniqueProducts" :key="product.productId" class="border-b bg-white text-xs md:text-sm">
                    <td class="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{{ product.productName }}</td>
                    <td class="px-4 py-3">{{ product.productUnitOfMeasure }}</td>
                    <td class="px-4 py-3">{{ product.productQuantity }}</td>
                    <td v-for="supplier in uniqueSuppliers" :key="supplier.supplierId" class="px-4 py-3">
                        <span :class="{'font-bold text-gray-800': isLowestPrice(product.productId, supplier.supplierId)}">
                            {{ quotation.find((item) => item.productId === product.productId && item.supplierId === supplier.supplierId)?.supplierUnitPrice || "-" }}
                        </span>
                    </td>
                    <td class="px-4 py-3">S/. {{ getLowestPrice(product.productId).toLocaleString() }}</td>
                    <td class="px-4 py-3">S/. {{ (getLowestPrice(product.productId) * product.productQuantity).toLocaleString() }}</td>
                </tr>

                <tr>
                    <td :colspan="3 + uniqueSuppliers.length"></td>
                    <td class="border bg-white px-4 py-2 text-sm font-bold">S/. {{ totalLowerPrice.toLocaleString() }}</td>
                    <td class="border bg-white px-4 py-2 text-sm font-bold">S/. {{ totalLowerPriceWithQuantity.toLocaleString() }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
