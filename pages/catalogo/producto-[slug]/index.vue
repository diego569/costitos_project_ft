<template>
    <div class="mx-auto max-w-screen-lg bg-white p-2 font-sans sm:p-4">
        <div v-for="product in products" :key="product.id">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div class="flex justify-center">
                    <div class="flex aspect-square h-96 items-center justify-center text-center">
                        <img :src="product.photo" alt="Product" class="flex size-full rounded-md" />
                    </div>
                </div>

                <div>
                    <div class="flex flex-wrap items-start gap-4">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">{{ product.name }} - {{ product.unitOfMeasure }}</h2>
                            <p class="mt-2 text-sm text-gray-500">Medida: {{ product.unitOfMeasure }}</p>
                        </div>
                    </div>
                    <hr class="my-8" />
                    <div class="flex flex-wrap items-start gap-4">
                        <div>
                            <p class="text-2xl font-bold text-gray-800">Descripcion</p>
                            <p class="mt-2 text-sm text-gray-500">
                                {{ product.description }}
                            </p>
                        </div>
                    </div>
                    <hr class="my-8" />
                    <div class="flex gap-2">
                        <div class="mt-4 flex items-center">
                            <button @click="decrementarCantidad(product)" class="h-10 w-10 rounded-lg bg-gray-200 text-gray-700">-</button>
                            <input type="number" v-model.number="product.cantidad" class="mx-2 h-10 w-16 rounded-lg border border-gray-200 bg-white text-center text-gray-900" @change="updateCantidad(product)" />
                            <button @click="incrementarCantidad(product)" class="h-10 w-10 rounded-lg bg-gray-200 text-gray-700">+</button>
                        </div>
                        <button @click="agregarAlCarrito(product)" class="mt-4 w-full rounded bg-primary-500 p-2 text-white">Añadir</button>
                    </div>
                </div>
            </div>

            <div class="mt-6">
                <h2 class="text-xl font-semibold">Características</h2>
                <ul class="mt-2">
                    <li v-for="feature in product.features" :key="feature.id" class="mt-1">
                        <p class="font-semibold">
                            {{ feature.name }}:
                            <span class="text-sm font-light text-gray-600">
                                {{ feature.description }}
                            </span>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, onMounted} from "vue";
    import {useRoute} from "vue-router";
    import {obtenerCarrito, agregarProducto, incrementarCantidad as incrementarCantidadCarrito, decrementarCantidad as decrementarCantidadCarrito, updateCantidad as updateCantidadCarrito} from "~/services/carrito.js";

    const route = useRoute();
    const productSlug = route.params.slug;

    const products = ref([]);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/guest/producto/getproductdetailsbysupplierproductslug/${productSlug}`);
            if (!response.ok) throw new Error("Failed to fetch product details");

            const data = await response.json();
            data.data.cantidad = 1;
            products.value = [data.data];
        } catch (error) {
            console.error(error);
        }
    };

    const incrementarCantidad = (product) => {
        product.cantidad += 1;
    };

    const decrementarCantidad = (product) => {
        if (product.cantidad > 1) {
            product.cantidad -= 1;
        }
    };

    const updateCantidad = (product) => {
        if (product.cantidad < 1) {
            product.cantidad = 1;
        }
    };

    const agregarAlCarrito = (product) => {
        agregarProducto(product, {unitOfMeasure: product.unitOfMeasure, cantidad: product.cantidad});
        updateCantidadCarrito(product.id, product.unitOfMeasure, product.cantidad);
    };

    onMounted(fetchProductDetails);
</script>
