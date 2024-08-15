<template>
    <div class="w-full transition-all duration-500 lg:block">
        <div class="flex items-center justify-between border-b p-2 sm:p-4">
            <h2 class="text-base font-semibold">Carrito Proveedor</h2>
            <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/10">{{ totalProductos }} productos</span>
        </div>
        <div class="max-h-[calc(100vh_-_230px)] min-h-[calc(100vh_-_230px)] overflow-x-hidden">
            <div v-if="carrito.length > 0">
                <div v-for="item in carrito" :key="item.producto.id + '-' + item.producto.unitOfMeasure" class="flex w-full gap-4 border-b border-dotted p-4">
                    <img :src="item.producto.photo" alt="Product Image" class="size-24 rounded object-cover" />
                    <div class="flex w-full flex-col gap-1">
                        <div class="flex h-full justify-between">
                            <div>
                                <p class="font-semibold text-gray-900">{{ item.producto.name }}</p>
                                <div v-for="(medida, index) in item.medidas" :key="index" class="mt-2 flex items-baseline gap-2">
                                    ↳ <input v-model="medida.unitOfMeasure" placeholder="Unidad de medida" class="w-full rounded border p-2" @input="updateProducto(item.producto.id, index, 'unitOfMeasure', medida.unitOfMeasure)" /> S/.<input
                                        v-model.number="medida.price"
                                        placeholder="Precio"
                                        class="w-full rounded border p-2"
                                        type="number"
                                        @input="updateProducto(item.producto.id, index, 'price', medida.price)" />
                                    <button @click="quitarMedida(item.producto.id, index)" class="mt-2 rounded-md border border-red-500 bg-red-500 p-2 text-xs font-bold text-white">x</button>
                                </div>
                                <button @click="agregarMedida(item.producto.id)" class="mt-2 text-xs text-primary-500">+ Agregar unidad de medida</button>
                            </div>
                            <button @click="quitarProducto(item.producto.id)" class="flex text-red-500">
                                <Icon name="my-icon:delete" size="20" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>No hay productos en el carrito.</p>
            </div>
        </div>
        <div class="flex justify-center border-t p-2 disabled:cursor-not-allowed sm:p-4">
            <button :disabled="carrito.length === 0" @click="enviarCotizacion" class="rounded bg-blue-500 p-2 text-white">Enviar Cotización</button>
        </div>
    </div>
</template>

<script setup>
    import {ref, computed} from "vue";
    import {obtenerCarritoSupplier, quitarProductoSupplier, updateProductoSupplier, agregarMedidaSupplier, quitarMedidaSupplier} from "~/services/carritosupplier.js";

    const carrito = computed(() => obtenerCarritoSupplier());
    const totalProductos = computed(() => carrito.value.length);

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

    const enviarCotizacion = async () => {
        try {
            const products = carrito.value.flatMap((item) =>
                item.medidas.map((medida) => ({
                    productId: item.producto.id,
                    unitOfMeasure: medida.unitOfMeasure,
                    price: medida.price,
                }))
            );

            console.table(products);

            const userId = "92c05463-e920-4153-bc38-5c6352701769"; // Ajusta esto según tu lógica

            const response = await fetch("http://localhost:8000/api/supplier/carrito/addsupplierproducts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userId, products}),
            });

            if (!response.ok) throw new Error("Error al enviar la cotización al proveedor");

            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error(error);
        }
    };
</script>
