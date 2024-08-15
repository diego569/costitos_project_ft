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
            <button :disabled="carrito.length === 0" @click="createQuotation" class="rounded bg-blue-500 p-2 text-white">Enviar</button>
        </div>
    </div>
</template>

<script setup>
    import {ref, computed} from "vue";
    import {obtenerCarrito, quitarProducto, incrementarCantidad, decrementarCantidad, totalProductosSeleccionados, updateCantidad} from "~/services/carrito.js";
    import {useRouter} from "vue-router";
    const router = useRouter();
    import {showMenu} from "@/services/menuService";

    const carrito = computed(() => obtenerCarrito());
    const totalProductos = computed(() => totalProductosSeleccionados());

    const userId = "966bdb00-1a87-4676-a5d8-d6f5fef52ab8";
    const quotationCount = ref(3);
    const quotationData = ref({
        userId,
        name: "Cotización de Ejemplo",
        type: "regular",
        status: "pending",
        quotationCount: 1,
    });

    const createQuotation = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/user/carrito/createquotation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(quotationData.value),
            });

            if (!response.ok) throw new Error("Error al crear la cotización");

            const {quotationId, quotationNumber} = await response.json();

            console.log("Cotización creada con ID:", quotationId, "y Número de Cotización:", quotationNumber);
            console.log("cot: ", quotationId);
            addProductsToQuotation(quotationId);
            return {quotationId, quotationNumber};
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const addProductsToQuotation = async (quotationId) => {
        try {
            const products = carrito.value.map((item) => ({
                productId: item.producto.id,
                quantity: item.cantidad,
            }));
            console.log("cotiza: ", quotationId);
            console.log("produt: ", products);
            const response = await fetch("http://localhost:8000/api/user/carrito/addproductstoquotation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({quotationId, products}),
            });

            if (!response.ok) throw new Error("Error al agregar productos a la cotización");

            const {quotationProducts} = await response.json();
            console.log("Productos agregados a la cotización:", quotationProducts);
            await addQuotationSupplierProducts(quotationId, quotationProducts);
        } catch (error) {
            console.error(error);
        }
    };
    const addQuotationSupplierProducts = async (quotationId, quotationProducts) => {
        try {
            const response = await fetch("http://localhost:8000/api/user/carrito/addquotationsupplierproducts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({quotationProducts, quotationCount: quotationCount.value}), // Enviar quotationCount
            });

            if (!response.ok) throw new Error("Error al agregar productos a QuotationSupplierProducts");
            router.push(`/cotizaciones/${quotationId}`);
            showMenu.value = false;
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error(error);
        }
    };
</script>
