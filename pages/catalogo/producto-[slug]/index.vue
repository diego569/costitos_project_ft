<script setup>
    import {ref, onMounted} from "vue";
    import {useRoute} from "vue-router";
    import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/vue";
    import {ChevronUpIcon} from "@heroicons/vue/20/solid";
    import {agregarProducto, updateCantidad as updateCantidadCarrito, incrementarCantidad as incrementarCantidadCarrito, decrementarCantidad as decrementarCantidadCarrito} from "~/services/usercart";
    import {apiurl} from "~/services/api.js";
    import {fetchWithAuth} from "~/services/auth.js";
    const productId = ref(null);
    const route = useRoute();
    const productSlug = route.params.slug;
    const categoryData = ref({category: null, subcategory: null});

    const products = ref([]);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch(apiurl(`/guest/producto/getproductdetailsbysupplierproductslug/${productSlug}`));
            if (!response.ok) throw new Error("Failed to fetch product details");

            const data = await response.json();
            data.data.cantidad = 1;
            products.value = [data.data];

            productId.value = data.data.productId;

            console.log("Product ID:", productId);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchProductCategoryAndSubcategory = async (productId) => {
        try {
            const categoryResponse = await fetchWithAuth(apiurl(`/guest/producto/${productId}/category-subcategory`), "GET");
            categoryData.value = categoryResponse;
        } catch (error) {
            console.error("Error fetching category and subcategory data:", error);
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

    onMounted(async () => {
        await fetchProductDetails();

        if (productId.value) {
            await fetchProductCategoryAndSubcategory(productId.value);
        }
    });
</script>
<template>
    <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center">
                <NuxtLink to="/" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600">
                    <svg class="me-2.5 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Inicio
                </NuxtLink>
            </li>
            <li v-if="categoryData.category">
                <div class="flex items-center">
                    <svg class="mx-1 h-3 w-3 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <NuxtLink :to="{name: 'catalogo-categoria-slug', params: {slug: categoryData.category.slug}}" class="ms-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ms-2"> {{ categoryData.category.name }}s </NuxtLink>
                </div>
            </li>
            <li v-if="categoryData.subcategory">
                <div class="flex items-center">
                    <svg class="mx-1 h-3 w-3 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <div class="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                        {{ categoryData.subcategory.name }}
                    </div>
                </div>
            </li>
        </ol>
    </nav>

    <div class="mx-auto max-w-screen-lg bg-white p-2 font-sans sm:p-4">
        <div v-for="product in products" :key="product.id">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div class="flex justify-center">
                    <div class="flex aspect-square h-96 items-center justify-center text-center">
                        <img :src="product.photo" alt="product image" class="aspect-square size-full rounded-md object-cover" />
                    </div>
                </div>

                <div>
                    <div class="flex flex-wrap items-start gap-4">
                        <p class="text-2xl font-semibold">{{ product.name }} - {{ product.unitOfMeasure }}</p>
                        <p class="text-sm">{{ product.description }}</p>
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
                    <li v-for="feature in product.features" :key="feature.id" class="mt-2">
                        <Disclosure as="div" class="mt-2" v-slot="{open}">
                            <DisclosureButton class="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75">
                                <span>{{ feature.name }}: {{ feature.value }}</span>
                                <ChevronUpIcon :class="{'rotate-180 transform': !open}" class="h-5 w-5 text-gray-500" />
                            </DisclosureButton>
                            <DisclosurePanel class="px-4 pb-2 pt-4 text-sm text-gray-500">
                                {{ feature.description }}
                            </DisclosurePanel>
                        </Disclosure>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
