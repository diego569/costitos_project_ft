<script setup>
    import {ref, computed, onMounted} from "vue";
    import {getUserId, fetchWithAuth} from "~/services/auth.js";
    import {obtenerCarritoSupplier, quitarProductoSupplier, updateProductoSupplier, agregarMedidaSupplier, quitarMedidaSupplier, vaciarCarritoSupplier} from "~/services/suppliercart";
    import {apiurl} from "~/services/api.js";
    import {showMenu} from "@/services/menuService";

    const carrito = computed(() => obtenerCarritoSupplier());
    const totalProductos = computed(() => carrito.value.length);

    const unitOfMeasures = ref([]);

    const fetchUnitOfMeasures = async () => {
        try {
            const response = await fetchWithAuth(apiurl("/supplier/misproductos/getunitofmeasures"), "GET");
            unitOfMeasures.value = response.data;
        } catch (error) {
            console.error("Error al obtener unidades de medida", error);
        }
    };

    onMounted(() => {
        fetchUnitOfMeasures();
    });

    const updateProducto = (productoId, medidaIndex, key, value) => {
        updateProductoSupplier(productoId, medidaIndex, key, value);
    };

    const agregarMedida = (productoId) => {
        agregarMedidaSupplier(productoId);
    };

    const quitarMedida = (productoId, medidaIndex) => {
        quitarMedidaSupplier(productoId, medidaIndex);
    };

    const quitarProducto = (productoId) => {
        quitarProductoSupplier(productoId);
    };

    const vaciarCarrito = () => {
        vaciarCarritoSupplier();
    };

    let isSubmitting = false;

    const enviarCotizacion = async () => {
        if (isSubmitting) return;
        isSubmitting = true;

        try {
            const products = carrito.value.flatMap((item) =>
                item.medidas.map((medida) => ({
                    productId: item.producto.id,
                    unitOfMeasureId: medida.selectedUnitOfMeasureId,
                    price: medida.price,
                }))
            );

            if (products.some((product) => !product.unitOfMeasureId)) {
                throw new Error("Cada producto debe tener una unidad de medida seleccionada.");
            }

            const userId = getUserId();
            if (!userId) {
                throw new Error("Usuario no autenticado.");
            }

            const response = await fetchWithAuth(apiurl("/supplier/carrito/addsupplierproducts"), "POST", {userId, products});

            vaciarCarrito();
            showMenu.value = false;
            console.log(response.message);
        } catch (error) {
            console.error("Error al enviar la cotización:", error);
        } finally {
            isSubmitting = false;
        }
    };

    const showCreateUnitOfMeasureModal = ref(false);

    const openCreateUnitOfMeasureModal = () => {
        showCreateUnitOfMeasureModal.value = true;
    };

    const closeCreateUnitOfMeasureModal = () => {
        showCreateUnitOfMeasureModal.value = false;
    };

    const handleUnitOfMeasureCreated = (unitOfMeasure) => {
        unitOfMeasures.value.push(unitOfMeasure);
    };
</script>

<template>
    {{ carrito }}
    <div class="w-full transition-all duration-500 lg:block">
        <div class="flex items-center justify-between border-b p-2 sm:p-4">
            <h2 class="text-base font-semibold">Carrito Proveedor</h2>
            <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/10">{{ totalProductos }} productos</span>
        </div>
        <div class="max-h-[calc(100vh_-_230px)] min-h-[calc(100vh_-_230px)] overflow-x-hidden">
            <div v-if="carrito.length > 0">
                <div v-for="item in carrito" :key="item.producto.id" class="flex w-full flex-col gap-2 border-b border-dotted p-4">
                    <div class="flex gap-4">
                        <img :src="item.producto.photo" alt="Product Image" class="size-16 rounded object-cover" />
                        <div class="flex- flex w-full gap-1">
                            <div class="flex h-full justify-between">
                                <p class="font-semibold text-gray-900">{{ item.producto.name }}</p>
                            </div>
                        </div>
                        <button @click="quitarProducto(item.producto.id)" class="flex text-red-500">
                            <Icon name="my-icon:delete" size="20" />
                        </button>
                    </div>
                    <div class="flex flex-col">
                        <div v-for="(medida, index) in item.medidas" :key="index" class="mt-2 flex items-baseline gap-2">
                            ↳
                            <div>
                                <UiLabel forId="unitofmeasure-select" />
                                <UiSelect id="unitofmeasure-select" v-model="medida.selectedUnitOfMeasureId" :options="unitOfMeasures" required />

                                <div @click="openCreateUnitOfMeasureModal" class="mt-2 cursor-pointer text-primary-600 hover:text-primary-800">
                                    <p class="select-none font-sans text-xs font-normal leading-normal antialiased">Crear nueva unidad de medida</p>
                                </div>

                                <SupplierCreateUnitOfMeasure :showModal="showCreateUnitOfMeasureModal" :closeModal="closeCreateUnitOfMeasureModal" :onUnitOfMeasureCreated="handleUnitOfMeasureCreated" />
                            </div>
                            <div>
                                <UiInput v-model.number="medida.price" type="number" :placeholder="'Precio'" @input="updateProducto(item.producto.id, index, 'price', medida.price)" />
                            </div>

                            <button @click="quitarMedida(item.producto.id, index)" class="mt-2 rounded-md border border-red-500 bg-red-500 p-2 text-xs font-bold text-white">x</button>
                        </div>
                        <button @click="agregarMedida(item.producto.id)" class="mt-2 text-xs text-primary-500">+ Agregar unidad de medida</button>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>No hay productos en el carrito.</p>
            </div>
        </div>
        <div class="flex justify-center border-t p-2 disabled:cursor-not-allowed sm:p-4">
            <ButtonC :label="'Agregar Productos'" :disabled="carrito.length === 0" @Click="enviarCotizacion" />
        </div>
    </div>
</template>
