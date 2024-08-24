<script setup>
    import {ref, computed} from "vue";
    import {obtenerCarrito, quitarProducto, incrementarCantidad, decrementarCantidad, totalProductosSeleccionados, updateCantidad} from "~/services/carrito.js";
    import {useRouter} from "vue-router";
    import {showMenu} from "@/services/menuService";
    import {getUserId, fetchWithAuth} from "@/services/auth"; // Importar funciones de auth.js
    import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";

    const router = useRouter();

    const carrito = computed(() => obtenerCarrito());
    const totalProductos = computed(() => totalProductosSeleccionados());

    const userId = getUserId();
    const quotationCount = ref(3);
    const quotationData = ref({
        userId,
        name: "Nueva cotización",
        type: "regular",
        status: "pending",
        quotationCount: 1,
    });

    const open = ref(false);
    const supplierCount = ref(3);

    const showModal = () => {
        open.value = true;
    };

    const createQuotation = async () => {
        try {
            const {quotationId, quotationNumber} = await fetchWithAuth("http://localhost:8000/api/user/carrito/createquotation", "POST", quotationData.value);

            console.log("Cotización creada con ID:", quotationId, "y Número de Cotización:", quotationNumber);
            await addProductsToQuotation(quotationId);
            return {quotationId, quotationNumber};
        } catch (error) {
            console.error("Error al crear la cotización:", error);
        }
    };

    const addProductsToQuotation = async (quotationId) => {
        try {
            const products = carrito.value.map((item) => ({
                productId: item.producto.id,
                quantity: item.cantidad,
            }));

            console.log("Añadiendo productos a la cotización:", quotationId, products);

            const {quotationProducts} = await fetchWithAuth("http://localhost:8000/api/user/carrito/addproductstoquotation", "POST", {quotationId, products});

            console.log("Productos agregados a la cotización:", quotationProducts);
            await addQuotationSupplierProducts(quotationId, quotationProducts);
        } catch (error) {
            console.error("Error al agregar productos a la cotización:", error);
        }
    };

    const addQuotationSupplierProducts = async (quotationId, quotationProducts) => {
        try {
            const data = await fetchWithAuth("http://localhost:8000/api/user/carrito/addquotationsupplierproducts", "POST", {
                quotationProducts,
                quotationCount: supplierCount.value,
            });

            console.log(data.message);
            router.push(`/cotizaciones/${quotationId}`);
            showMenu.value = false;
        } catch (error) {
            console.error("Error al agregar productos a QuotationSupplierProducts:", error);
        }
    };

    const handleCreateQuotation = async () => {
        open.value = false;
        await createQuotation();
    };
</script>
<template>
    <div class="w-full transition-all duration-500 lg:block">
        <div class="flex items-center justify-between border-b p-2 sm:p-4">
            <h2 class="text-base font-semibold">Carrito</h2>
            <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/10"> {{ totalProductos }} productos </span>
        </div>
        <div class="max-h-[calc(100vh_-_230px)] min-h-[calc(100vh_-_230px)] overflow-x-hidden">
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
                            <div class="flex items-end gap-2">
                                <button @click="decrementarCantidad(item.producto.id, item.producto.unitOfMeasure)" class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-gray-700">-</button>
                                <input type="number" v-model.number="item.cantidad" class="flex h-8 w-14 rounded-lg border border-gray-200 bg-white text-center text-gray-900" @change="updateCantidad(item.producto.id, item.producto.unitOfMeasure, item.cantidad)" />
                                <button @click="incrementarCantidad(item.producto.id, item.producto.unitOfMeasure)" class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-gray-700">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>No hay productos en el carrito.</p>
            </div>
        </div>
        <div class="flex justify-center border-t p-2 disabled:cursor-not-allowed sm:p-4">
            <button :disabled="carrito.length === 0" @click="showModal" class="rounded bg-blue-500 p-2 text-white">Enviar</button>
        </div>
    </div>

    <TransitionRoot as="template" :show="open">
        <Dialog class="relative z-10" @close="open = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div class="sm:flex sm:items-start">
                                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ExclamationTriangleIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
                                    </div>
                                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Seleccionar cantidad de proveedores</DialogTitle>
                                        <div class="mt-2">
                                            <p class="text-sm text-gray-500">Elige la cantidad de proveedores para la cotización (mínimo 3, máximo 10).</p>
                                            <input type="number" v-model="supplierCount" min="3" max="10" class="mt-3 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="button" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto" @click="handleCreateQuotation">Confirmar</button>
                                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="open = false">Cancelar</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
