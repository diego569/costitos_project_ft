<script setup>
    import {ref, computed, onMounted} from "vue";
    import {obtenerCarrito, quitarProducto, incrementarCantidad, decrementarCantidad, updateCantidad, vaciarCarrito} from "~/services/usercart.js";
    import {getUserId, fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api";
    import {showMenu} from "@/services/menuService";
    import {totalProductosSeleccionados} from "~/services/usercart.js";
    import {fetchQuotationCount} from "@/services/user";

    const defaultData = ref({
        project: null,
        area: null,
    });

    const newArea = computed(() => defaultData.value.area);

    const carrito = computed(() => obtenerCarrito());
    const totalProductos = computed(() => carrito.value.length);
    const totalProdu = computed(() => totalProductosSeleccionados());

    const userId = getUserId();

    const quotationData = ref({
        userId,
        name: "Nueva cotización",
        type: "regular",
        status: "pending",
        quotationCount: totalProdu.value,
    });

    const supplierCount = ref(3);
    const maxSuppliers = 6;
    const errorMessage = ref("");

    const suppliers = ref([]);
    const selectedSuppliers = ref([]);
    const selectedSupplierDetails = ref([]);
    const showModalSuppliers = ref(false);
    const showAllSuppliers = ref(false);
    const errorSuppliersMessage = ref("");
    const supplierLoadingError = ref("");
    const supplierSearchQuery = ref("");

    const supplierSelectionText = computed(() => {
        const count = selectedSuppliers.value.length;
        return count === 0 ? "0 proveedores" : count === 1 ? "1 proveedor" : `${count} proveedores`;
    });

    const modalSelectionText = computed(() => {
        return `${selectedSuppliers.value.length} de ${maxSuppliers} proveedores seleccionados`;
    });

    const unselectedSupplierList = computed(() => {
        const filtered = suppliers.value.filter((supplier) => !selectedSuppliers.value.includes(supplier.supplierId) && (supplier.supplierName.toLowerCase().includes(supplierSearchQuery.value.toLowerCase()) || supplierSearchQuery.value === ""));
        return filtered;
    });

    const selectedSupplierList = computed(() => {
        return suppliers.value.filter((supplier) => selectedSuppliers.value.includes(supplier.supplierId));
    });

    const fetchSuppliersWithProducts = async () => {
        try {
            supplierLoadingError.value = "";

            const cartProducts = carrito.value.map((item) => ({
                productId: item.producto.productoId,
                unitId: item.producto.unitId,
            }));

            const suppliersData = await fetchWithAuth(apiurl("/user/carrito/suppliers-with-products"), "POST", {cartProducts});

            suppliers.value = suppliersData;
        } catch (error) {
            console.error("Error al cargar proveedores:", error);
            supplierLoadingError.value = "No se pudo cargar la lista de proveedores.";
        }
    };

    const openSuppliersModal = () => {
        fetchSuppliersWithProducts();
        showModalSuppliers.value = true;
    };

    const closeSuppliersModal = () => {
        showModalSuppliers.value = false;
        errorSuppliersMessage.value = "";
    };

    const toggleSupplierSelection = (supplier) => {
        const {supplierId, supplierName} = supplier;

        if (selectedSuppliers.value.includes(supplierId)) {
            selectedSuppliers.value = selectedSuppliers.value.filter((id) => id !== supplierId);
            selectedSupplierDetails.value = selectedSupplierDetails.value.filter((s) => s.id !== supplierId);
        } else if (selectedSuppliers.value.length < maxSuppliers) {
            selectedSuppliers.value.push(supplierId);
            selectedSupplierDetails.value.push({id: supplierId, name: supplierName});
        }
    };

    const confirmSuppliersSelection = () => {
        if (selectedSuppliers.value.length < 1) {
            errorSuppliersMessage.value = "Debe seleccionar al menos 1 proveedor.";
            return;
        }
        closeSuppliersModal();
    };

    const vaciarCarritoUser = () => vaciarCarrito();

    const quitarProductoDelCarrito = (productoId, unitOfMeasure) => {
        quitarProducto(productoId, unitOfMeasure);
        fetchSuppliersWithProducts();
    };

    const incrementarCantidadProducto = (productoId, unitOfMeasure) => {
        incrementarCantidad(productoId, unitOfMeasure);
        fetchSuppliersWithProducts();
    };

    const decrementarCantidadProducto = (productoId, unitOfMeasure) => {
        decrementarCantidad(productoId, unitOfMeasure);
        fetchSuppliersWithProducts();
    };

    const actualizarCantidadProducto = (productoId, unitOfMeasure, cantidad) => {
        updateCantidad(productoId, unitOfMeasure, cantidad);
        fetchSuppliersWithProducts();
    };

    const createQuotation = async () => {
        errorMessage.value = "";

        try {
            const response = await fetchWithAuth(apiurl("/user/carrito/createquotation"), "POST", quotationData.value);

            const {quotationId, quotationNumber} = response;

            await addProductsToQuotation(quotationId);

            fetchQuotationCount();

            return {quotationId, quotationNumber};
        } catch (error) {
            console.error("==> Error durante la creación de la cotización:", error);

            if (error.message.includes("No tiene suficientes cotizaciones disponibles")) {
                errorMessage.value = "No tiene suficientes cotizaciones disponibles.";
            } else {
                errorMessage.value = "Error al crear la cotización.";
            }
        }
    };

    const toggleShowAllSuppliers = () => {
        showAllSuppliers.value = !showAllSuppliers.value;
    };

    const addProductsToQuotation = async (quotationId) => {
        try {
            const products = carrito.value.map((item) => ({
                productId: item.producto.id,
                quantity: item.cantidad,
            }));

            const response = await fetchWithAuth(apiurl("/user/carrito/addproductstoquotation"), "POST", {
                quotationId,
                products,
            });

            const {quotationProducts} = response;

            await addQuotationSupplierProducts(quotationId, quotationProducts);
        } catch (error) {
            console.error("Error al agregar productos a la cotización:", error);
        }
    };

    const addQuotationSupplierProducts = async (quotationId, quotationProducts) => {
        try {
            const selectedSupplierIds = selectedSupplierList.value.map((supplier) => supplier.supplierId);

            const data = await fetchWithAuth(apiurl("/user/carrito/addquotationsupplierproducts"), "POST", {
                quotationProducts,
                selectedSupplierIds,
                quotationCount: supplierCount.value,
            });

            vaciarCarritoUser();
            showMenu.value = false;
            window.location.href = `/cotizaciones/${quotationId}`;
        } catch (error) {
            console.error("Error al agregar productos a QuotationSupplierProducts:", error);
        }
    };

    const handleCreateQuotation = async () => {
        await createQuotation();
    };
    onMounted(() => {
        fetchSuppliersWithProducts();
    });
</script>
<template>
    <div class="w-full transition-all duration-500 lg:block">
        <div class="flex items-center justify-between border-b p-2">
            <h2 class="text-base font-semibold">Carrito</h2>
            <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/10"> {{ totalProductos }} productos </span>
        </div>

        <div class="max-h-[calc(100vh_-_300px)] min-h-[calc(100vh_-_300px)] overflow-x-hidden">
            <div v-if="carrito.length > 0">
                <div v-for="item in carrito" :key="item.producto.id + '-' + item.producto.unitOfMeasure" class="flex w-full gap-4 border-b border-dotted p-4">
                    <img :src="item.producto.photo" alt="Imagen del producto" class="size-20 rounded object-cover" />
                    <div class="flex w-full flex-col gap-1">
                        <div class="flex h-full justify-between text-sm">
                            <div>
                                <p class="font-semibold text-gray-900">{{ item.producto.name }}</p>
                                <p class="font-base text-gray-500">{{ item.producto.unitOfMeasure }}</p>
                            </div>
                            <button @click="quitarProductoDelCarrito(item.producto.id, item.producto.unitOfMeasure)" class="text-red-500 hover:underline">
                                <Icon name="my-icon:trash" size="20" />
                            </button>
                        </div>
                        <div class="flex items-center gap-2">
                            <button @click="decrementarCantidadProducto(item.producto.id, item.producto.unitOfMeasure)" class="flex items-center rounded bg-gray-200 p-2"><Icon name="my-icon:baseline-minus" size="20" /></button>
                            <input type="text" v-model.number="item.cantidad" class="w-10 rounded border text-center" />
                            <button @click="incrementarCantidadProducto(item.producto.id, item.producto.unitOfMeasure)" class="rounded bg-gray-200 px-2 py-1.5"><Icon name="my-icon:baseline-plus" size="14" /></button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>No hay productos en el carrito.</p>
            </div>
        </div>

        <div class="flex flex-col justify-center gap-3 border-t p-2 sm:p-4">
            <button @click="openSuppliersModal" class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Seleccionar Proveedores ({{ supplierSelectionText }})</button>
            <UiButton class="w-full" variant="primary" :isLoading="false" :disabled="carrito.length === 0 || selectedSuppliers.length < 1" defaultText="Realizar Cotización" @click="handleCreateQuotation" />
            <small v-if="errorMessage" class="mt-2 text-red-500">{{ errorMessage }}</small>
        </div>

        <UiModal v-if="showModalSuppliers" size="lg" :showModal="showModalSuppliers" :closeModal="closeSuppliersModal" title="Seleccionar Proveedores">
            <template #default>
                <div class="text-md mb-2 text-primary-700">{{ modalSelectionText }}</div>

                <div class="flex gap-4">
                    <div class="w-full border-r pr-3">
                        <div class="mb-4">
                            <input v-model="supplierSearchQuery" type="text" placeholder="Buscar proveedores no seleccionados" class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div v-if="unselectedSupplierList.length > 0">
                            <h4 class="mb-2 text-sm font-semibold text-gray-800">Proveedores No Seleccionados</h4>
                            <div v-for="supplier in showAllSuppliers ? unselectedSupplierList : unselectedSupplierList.slice(0, 5)" :key="supplier.supplierId" class="flex items-center justify-between py-2">
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" :value="supplier.supplierId" v-model="selectedSuppliers" class="size-4 border-gray-300 text-primary-600 checked:rounded-full focus:ring-primary-500" />
                                    <label @click="toggleSupplierSelection(supplier)" class="cursor-pointer text-sm">
                                        {{ supplier.supplierName }}
                                    </label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div v-if="supplier.missingProducts <= 0" class="text-green-500">
                                        <Icon name="my-icon:check" size="12" />
                                    </div>
                                    <div v-else class="flex items-center gap-1 text-red-500">
                                        <span class="text-sm">{{ supplier.missingProducts }}</span>
                                        <Icon name="my-icon:x" size="20" />
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2">
                                <button @click="toggleShowAllSuppliers" class="text-sm text-primary-500 hover:underline">
                                    {{ showAllSuppliers ? "Mostrar menos" : "Mostrar más" }}
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <p class="text-gray-500">No hay proveedores disponibles.</p>
                        </div>
                    </div>

                    <div class="w-full">
                        <div v-if="selectedSupplierList.length > 0" class="mb-4">
                            <h4 class="mb-2 text-sm font-semibold text-gray-800">Proveedores Seleccionados</h4>
                            <div v-for="supplier in selectedSupplierList" :key="supplier.supplierId" class="flex items-center justify-between py-2">
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" :value="supplier.supplierId" v-model="selectedSuppliers" class="size-4 border-gray-300 text-primary-600 checked:rounded-full focus:ring-primary-500" />
                                    <label @click="toggleSupplierSelection(supplier)" class="cursor-pointer text-sm">
                                        {{ supplier.supplierName }}
                                    </label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div v-if="supplier.missingProducts <= 0" class="text-green-500">
                                        <Icon name="my-icon:check" size="12" />
                                    </div>
                                    <div v-else class="flex items-center gap-1 text-red-500">
                                        <span class="text-sm">{{ supplier.missingProducts }}</span>
                                        <Icon name="my-icon:x" size="20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <small v-if="errorSuppliersMessage" class="text-red-500">{{ errorSuppliersMessage }}</small>
                <small v-if="supplierLoadingError" class="text-red-500">{{ supplierLoadingError }}</small>
            </template>
            <template #actions>
                <button @click="closeSuppliersModal" class="mr-2 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">Cancelar</button>
                <button :disabled="selectedSuppliers.length < 1 || selectedSuppliers.length > maxSuppliers" @click="confirmSuppliersSelection" class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Confirmar</button>
            </template>
        </UiModal>
    </div>
</template>
