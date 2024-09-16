<script setup>
    import {ref, computed} from "vue";
    import {obtenerCarrito, quitarProducto, incrementarCantidad, decrementarCantidad, totalProductosSeleccionados, updateCantidad, vaciarCarrito} from "~/services/usercart.js";
    import {useRouter} from "vue-router";
    import {showMenu} from "@/services/menuService";
    import {getUserId, fetchWithAuth} from "@/services/auth";
    import {apiurl} from "~/services/api.js";
    import {fetchQuotationCount} from "@/services/user";

    const router = useRouter();
    const carrito = computed(() => obtenerCarrito());
    const totalProductos = computed(() => carrito.value.length);
    const userId = getUserId();
    const quotationData = ref({
        userId,
        name: "Nueva cotización",
        type: "regular",
        status: "pending",
        quotationCount: 1,
    });

    const supplierCount = ref(3);
    const errorMessage = ref("");

    const vaciarCarritoUser = () => {
        vaciarCarrito();
    };

    const createQuotation = async () => {
        errorMessage.value = "";
        try {
            const {quotationId, quotationNumber} = await fetchWithAuth(apiurl("/user/carrito/createquotation"), "POST", quotationData.value);

            console.log("Cotización creada con ID:", quotationId, "y Número de Cotización:", quotationNumber);
            await addProductsToQuotation(quotationId);
            return {quotationId, quotationNumber};
            fetchQuotationCount();
        } catch (error) {
            console.error("Error al crear la cotización:", error);

            if (error.message.includes("No tiene suficientes cotizaciones disponibles")) {
                errorMessage.value = "No tiene suficientes cotizaciones disponibles.";
            } else {
                errorMessage.value = "Error al crear la cotización.";
            }
        }
    };

    const addProductsToQuotation = async (quotationId) => {
        try {
            const products = carrito.value.map((item) => ({
                productId: item.producto.id,
                quantity: item.cantidad,
            }));

            console.log("Añadiendo productos a la cotización:", quotationId, products);

            const {quotationProducts} = await fetchWithAuth(apiurl("/user/carrito/addproductstoquotation"), "POST", {quotationId, products});

            console.log("Productos agregados a la cotización:", quotationProducts);
            await addQuotationSupplierProducts(quotationId, quotationProducts);
        } catch (error) {
            console.error("Error al agregar productos a la cotización:", error);
        }
    };

    const addQuotationSupplierProducts = async (quotationId, quotationProducts) => {
        try {
            const data = await fetchWithAuth(apiurl("/user/carrito/addquotationsupplierproducts"), "POST", {
                quotationProducts,
                quotationCount: supplierCount.value,
            });

            console.log(data.message);
            window.location.href = `/cotizaciones/${quotationId}`;
            vaciarCarritoUser();
            showMenu.value = false;
        } catch (error) {
            console.error("Error al agregar productos a QuotationSupplierProducts:", error);
        }
    };

    const handleCreateQuotation = async () => {
        await createQuotation();
    };
</script>
<template>
    <div class="w-full transition-all duration-500 lg:block">
        <div class="flex items-center justify-between border-b p-2">
            <h2 class="text-base font-semibold">Carrito</h2>
            <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/10"> {{ totalProductos }} productos </span>
        </div>
        <div class="max-h-[calc(100vh_-_255px)] min-h-[calc(100vh_-_255px)] overflow-x-hidden">
            <div v-if="carrito.length > 0">
                <div v-for="item in carrito" :key="item.producto.id + '-' + item.producto.unitOfMeasure" class="flex w-full gap-4 border-b border-dotted p-4">
                    <img :src="item.producto.photo" alt="Product Image" class="size-20 rounded object-cover" />
                    <div class="flex w-full flex-col gap-1">
                        <div class="flex h-full justify-between text-sm">
                            <div>
                                <p class="font-semibold text-gray-900">{{ item.producto.name }}</p>
                                <p class="font-base text-gray-500">{{ item.producto.unitOfMeasure }}</p>
                            </div>
                            <button @click="quitarProducto(item.producto.id, item.producto.unitOfMeasure)" class="flex text-red-500">
                                <Icon name="my-icon:delete" size="20" />
                            </button>
                        </div>
                        <div class="flex w-full flex-row items-end gap-2">
                            <div class="flex items-center gap-2 md:max-w-[150px]">
                                <button @click="decrementarCantidad(item.producto.id, item.producto.unitOfMeasure)" class="flex aspect-square size-10 items-center justify-center rounded-lg bg-gray-200 px-4 text-gray-700">-</button>
                                <UiInput type="text" class="text-center" v-model.number="item.cantidad" @change="updateCantidad(item.producto.id, item.producto.unitOfMeasure, item.cantidad)" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');" />
                                <button @click="incrementarCantidad(item.producto.id, item.producto.unitOfMeasure)" class="flex aspect-square size-10 items-center justify-center rounded-lg bg-gray-200 px-4 text-gray-700">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>No hay productos en el carrito.</p>
            </div>
        </div>

        <div class="flex flex-col justify-center border-t p-2 disabled:cursor-not-allowed sm:p-4">
            <div v-if="errorMessage" class="py-2 text-red-500">{{ errorMessage }}</div>

            <div class="flex items-center gap-2 py-2 text-center">
                <div class="w-full text-base font-semibold leading-6 text-gray-900">Cantidad de proveedores</div>
                <div class="w-full">
                    <select v-model="supplierCount" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                        <option v-for="n in 8" :key="n" :value="n + 2">{{ n + 2 }}</option>
                    </select>
                </div>
            </div>

            <ButtonC :label="'Realizar Cotización'" :disabled="carrito.length === 0" @click="handleCreateQuotation" />
        </div>
    </div>
</template>
