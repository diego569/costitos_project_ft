<script setup>
    import {ref, onMounted, watch} from "vue";
    import {fetchWithAuth} from "@/services/auth";
    import {apiurl} from "@/services/api";
    import ExcelJS from "exceljs";
    import {saveAs} from "file-saver";

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

    const fetchQuotationsByIds = async (quotationIds) => {
        try {
            const data = await fetchWithAuth(apiurl("/user/proyectos/quotationdetails/multiple"), "POST", {quotationIds});
            quotations.value = data.data.map((quotation) => ({
                ...quotation,
                products: sortProductsByLowestPrice(quotation.products),
            }));
        } catch (err) {
            console.error("Error fetching quotations:", err);
        }
    };

    const sortProductsByLowestPrice = (products) => {
        return products.sort((a, b) => {
            const priceA = parseFloat(a.supplierUnitPrice) || Infinity;
            const priceB = parseFloat(b.supplierUnitPrice) || Infinity;
            return priceA - priceB;
        });
    };

    const computeUniqueSuppliers = (quotation) => {
        const suppliersMap = {};
        quotation?.products?.forEach((product) => {
            if (!suppliersMap[product.supplierId]) {
                suppliersMap[product.supplierId] = product.supplierName || "-";
            }
        });
        return Object.values(suppliersMap);
    };

    const computeUniqueProducts = (quotation) => {
        const productsMap = {};
        quotation?.products?.forEach((product) => {
            if (!productsMap[product.productId]) {
                productsMap[product.productId] = {
                    productId: product.productId,
                    productName: product.productName,
                    productUnitOfMeasure: product.productUnitOfMeasure,
                };
            }
        });
        return Object.values(productsMap);
    };

    const getLowestPrice = (quotation, productId) => {
        const prices = quotation?.products?.filter((product) => product.productId === productId)?.map((product) => parseFloat(product.supplierUnitPrice));
        return prices.length ? Math.min(...prices) : 0;
    };

    const getSupplierWithLowestPrice = (quotation, productId) => {
        const productPrices = quotation?.products?.filter((product) => product.productId === productId);
        if (!productPrices || productPrices.length === 0) return "N/A";
        const lowestPriceProduct = productPrices.reduce((lowest, current) => {
            return parseFloat(current.supplierUnitPrice) < parseFloat(lowest.supplierUnitPrice) ? current : lowest;
        });
        return lowestPriceProduct.supplierName || "N/A";
    };

    const calculatePriceWithoutIGV = (price) => (price / 1.18).toFixed(2);

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Cotizaciones");

        const headerStyle = {
            font: {name: "Calibri", size: 10, bold: true},
            alignment: {vertical: "middle", horizontal: "center", wrapText: true},
            border: {top: {style: "thin"}, left: {style: "thin"}, bottom: {style: "thin"}, right: {style: "thin"}},
        };

        const leftAlignStyle = {
            font: {name: "Calibri", size: 9, bold: false},
            alignment: {vertical: "middle", horizontal: "left", wrapText: true},
        };

        const contentStyle = {
            font: {name: "Calibri", size: 9, bold: false},
            alignment: {vertical: "middle", horizontal: "center", wrapText: true},
            border: {top: {style: "thin"}, left: {style: "thin"}, bottom: {style: "thin"}, right: {style: "thin"}},
        };

        const yellowStyle = {...headerStyle, fill: {type: "pattern", pattern: "solid", fgColor: {argb: "FFFF00"}}, alignment: {vertical: "middle", horizontal: "center", wrapText: true}};
        const grayStyle = {...headerStyle, fill: {type: "pattern", pattern: "solid", fgColor: {argb: "D9D9D9"}}, alignment: {vertical: "middle", horizontal: "center", wrapText: true}};
        const redStyle = {
            font: {name: "Calibri", size: 9, bold: false, color: {argb: "FF0000"}},
            alignment: {vertical: "middle", horizontal: "center", wrapText: true},
            fill: {type: "pattern", pattern: "solid", fgColor: {argb: "FFCCCC"}},
        };
        const noBorderStyle = {
            font: {name: "Calibri", size: 9, bold: false},
            border: {
                top: {style: "thin", color: {argb: "FFFFFF"}},
                left: {style: "thin", color: {argb: "FFFFFF"}},
                bottom: {style: "thin", color: {argb: "FFFFFF"}},
                right: {style: "thin", color: {argb: "FFFFFF"}},
            },
        };

        let currentRow = 1;

        const applyStyleToRow = (worksheet, startCol, endCol, row, style) => {
            for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
                const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                cell.style = style;
            }
        };

        worksheet.mergeCells(`A${currentRow}:L${currentRow}`);
        worksheet.getCell(`A${currentRow}`).value = `CUADRO COMPARATIVO DE ${props.selectedArea.type}`.toUpperCase();
        applyStyleToRow(worksheet, "A", "L", currentRow, Object.assign({}, grayStyle, noBorderStyle));

        currentRow++;

        worksheet.mergeCells(`A${currentRow}:L${currentRow}`);
        worksheet.getCell(`A${currentRow}`).value = `PROYECTO: ${props.selectedProject.name || "SIN NOMBRE"}`;
        applyStyleToRow(worksheet, "A", "L", currentRow, Object.assign({}, leftAlignStyle, noBorderStyle));
        currentRow++;

        worksheet.mergeCells(`A${currentRow}:L${currentRow}`);
        worksheet.getCell(`A${currentRow}`).value = `METAS: ${props.selectedProject.goals || "SIN META"}`;
        applyStyleToRow(worksheet, "A", "L", currentRow, Object.assign({}, leftAlignStyle, noBorderStyle));
        currentRow++;

        worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
        worksheet.getCell(`A${currentRow}`).value = `CÓDIGO UNIFICADO: ${props.selectedProject.unifiedCode || "N/A"}`;
        applyStyleToRow(worksheet, "A", "B", currentRow, Object.assign({}, leftAlignStyle, noBorderStyle));

        worksheet.mergeCells(`C${currentRow}:F${currentRow}`);
        worksheet.getCell(`C${currentRow}`).value = `CÓDIGO MODULAR: ${props.selectedProject.modularCode || "N/A"}`;
        applyStyleToRow(worksheet, "C", "F", currentRow, Object.assign({}, leftAlignStyle, noBorderStyle));

        worksheet.mergeCells(`G${currentRow}:L${currentRow}`);
        applyStyleToRow(worksheet, "G", "L", currentRow, Object.assign({}, leftAlignStyle, noBorderStyle));
        currentRow++;

        worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
        worksheet.getCell(`A${currentRow}`).value = `UBICACIÓN: ${props.selectedProject.location || "SIN UBICACIÓN"}`;
        applyStyleToRow(worksheet, "A", "C", currentRow, Object.assign({}, leftAlignStyle, noBorderStyle));

        worksheet.mergeCells(`D${currentRow}:F${currentRow}`);
        worksheet.getCell(`D${currentRow}`).value = `FECHA: ${new Date().toLocaleDateString()}`;
        applyStyleToRow(worksheet, "D", "F", currentRow, Object.assign({}, leftAlignStyle, noBorderStyle));

        worksheet.mergeCells(`G${currentRow}:J${currentRow}`);
        worksheet.getCell(`G${currentRow}`).value = `PROYECTISTA: ${props.selectedProject.designer || "SIN PROYECTISTA"}`;
        applyStyleToRow(worksheet, "G", "J", currentRow, Object.assign({}, leftAlignStyle, noBorderStyle));

        worksheet.mergeCells(`K${currentRow}:L${currentRow}`);
        worksheet.getCell(`K${currentRow}`).value = `PLAZO DE EJECUCIÓN: ${props.selectedProject.executionTime || "SIN PLAZO"} DÍAS CALENDARIOS`;
        applyStyleToRow(worksheet, "K", "L", currentRow, Object.assign({}, leftAlignStyle, noBorderStyle));
        currentRow++;

        applyStyleToRow(worksheet, "A", "L", currentRow, Object.assign({}, noBorderStyle));

        currentRow++;
        applyStyleToRow(worksheet, "A", "L", currentRow, Object.assign({}, noBorderStyle));

        currentRow++;

        quotations.value.forEach((quotation, index) => {
            if (index > 0) {
                currentRow++;
                applyStyleToRow(worksheet, "A", "L", currentRow, Object.assign({}, noBorderStyle));
                currentRow++;
            }

            worksheet.mergeCells(`A${currentRow}:L${currentRow}`);
            worksheet.getCell(`A${currentRow}`).value = `CUADRO COMPARATIVO DE COTIZACIÓN DE MATERIALES DE CONSTRUCCIÓN - ${props.selectedArea.type}`.toUpperCase();
            worksheet.getCell(`A${currentRow}`).style = yellowStyle;
            currentRow++;

            const cotizacionRow = ["", "", ""];

            for (let i = 1; i <= 6; i++) {
                cotizacionRow.push(`COTIZACIÓN ${i}`);
            }

            cotizacionRow.push("", "", "");

            const cotizacionHeaderRow = worksheet.addRow(cotizacionRow.map((text) => text.toUpperCase()));

            cotizacionHeaderRow.eachCell((cell) => {
                cell.style = grayStyle;
            });

            currentRow++;

            const supplierRow = ["Nº", "DESCRIPCIÓN", "UND"];

            const uniqueSuppliers = computeUniqueSuppliers(quotation);
            for (let i = 0; i < 6; i++) {
                supplierRow.push(uniqueSuppliers[i] ? uniqueSuppliers[i].toUpperCase() : "");
            }

            supplierRow.push("PRECIO PREP. MENOR CON IGV", "PRECIO PREP. SIN IGV", "COMENTARIO");
            const supplierHeaderRow = worksheet.addRow(supplierRow);

            supplierHeaderRow.eachCell((cell, colNumber) => {
                if (cell.value === "PRECIO PREP. SIN IGV") {
                    cell.style = redStyle;
                } else {
                    cell.style = grayStyle;
                }
            });
            currentRow++;

            computeUniqueProducts(quotation).forEach((product, index) => {
                const rowValues = [(index + 1).toString(), product.productName.toUpperCase(), product.productUnitOfMeasure.toUpperCase()];

                for (let i = 0; i < 6; i++) {
                    const supplier = computeUniqueSuppliers(quotation)[i];
                    if (supplier) {
                        const price = quotation.products.find((p) => p.productId === product.productId && p.supplierName === supplier)?.supplierUnitPrice;
                        rowValues.push(price !== undefined ? price.toString().toUpperCase() : "");
                    } else {
                        rowValues.push("");
                    }
                }

                const lowestPrice = getLowestPrice(quotation, product.productId).toFixed(2);
                rowValues.push(lowestPrice.toUpperCase(), calculatePriceWithoutIGV(lowestPrice).toUpperCase(), getSupplierWithLowestPrice(quotation, product.productId).toUpperCase());

                const row = worksheet.addRow(rowValues);

                row.eachCell((cell, colNumber) => {
                    if (colNumber === 2 || colNumber === rowValues.length) {
                        cell.style = leftAlignStyle;
                    } else {
                        cell.style = contentStyle;
                    }
                    if (colNumber === rowValues.length - 1) {
                        cell.style = {...cell.style, ...redStyle};
                    }
                    if (colNumber === 1 || colNumber === 3) {
                        worksheet.getColumn(colNumber).width = 6;
                    } else if (colNumber === 2) {
                        worksheet.getColumn(colNumber).width = 68;
                    } else if (colNumber === rowValues.length) {
                        worksheet.getColumn(colNumber).width = 39;
                    } else {
                        worksheet.getColumn(colNumber).width = 13.5;
                    }
                });

                currentRow++;
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: "application/octet-stream"});
        saveAs(blob, "Cuadro comparativo.xlsx");
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
    <div class="flex justify-between border-b">
        <div class="flex items-center">
            <Icon name="my-icon:arrow-down" size="16" class="mr-2 hover:text-red-400" />AREA:
            <p class="font-bold">{{ props.selectedArea.type }}</p>
        </div>
        <div class="flex items-center">
            Generar documentos:
            <button @click="exportToExcel" class="flex items-center justify-center p-2">
                <Icon name="my-icon:file-xls" size="25" class="mr-2" />
            </button>
        </div>
    </div>

    <!-- Tabla para mostrar las cotizaciones -->
    <!-- <div v-for="(quotation, index) in quotations" :key="index" class="mb-8">
        <h2 class="mb-4 text-xl font-semibold">Cuadro Comparativo de Cotización {{ index + 1 }}</h2>
        <table class="min-w-full border-collapse border border-gray-300">
            <thead>
                <tr>
                    <th class="border border-gray-300 px-4 py-2">Nº</th>
                    <th class="border border-gray-300 px-4 py-2">Descripción</th>
                    <th class="border border-gray-300 px-4 py-2">Unidad</th>
                    <th v-for="supplier in computeUniqueSuppliers(quotation)" :key="supplier" class="border border-gray-300 px-4 py-2">
                        {{ supplier }}
                    </th>
                    <th class="border border-gray-300 px-4 py-2">Precio Prep. Menor con IGV</th>
                    <th class="border border-gray-300 px-4 py-2 text-red-500">Precio Prep. Sin IGV</th>
                    <th class="border border-gray-300 px-4 py-2">Comentario</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, productIndex) in computeUniqueProducts(quotation)" :key="product.productId">
                    <td class="border border-gray-300 px-4 py-2 text-center">{{ productIndex + 1 }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ product.productName }}</td>
                    <td class="border border-gray-300 px-4 py-2 text-center">{{ product.productUnitOfMeasure }}</td>
                    <td v-for="supplier in computeUniqueSuppliers(quotation)" :key="supplier" class="border border-gray-300 px-4 py-2 text-center">
                        {{ quotation.products.find((p) => p.productId === product.productId && p.supplierName === supplier)?.supplierUnitPrice || "-" }}
                    </td>
                    <td class="border border-gray-300 px-4 py-2 text-center">
                        {{ getLowestPrice(quotation, product.productId).toFixed(2) }}
                    </td>
                    <td class="border border-gray-300 px-4 py-2 text-center text-red-500">
                        {{ calculatePriceWithoutIGV(getLowestPrice(quotation, product.productId)) }}
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                        {{ getSupplierWithLowestPrice(quotation, product.productId) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div> -->
</template>
