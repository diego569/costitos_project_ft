<script setup>
    import {ref, onMounted} from "vue";
    import {agregarProductoSupplier, obtenerCarritoSupplier} from "~/services/suppliercart";
    import {apiurl} from "~/services/api.js";

    const recentProducts = ref([]);
    const categories = ref([]);
    const searchResults = ref([]);
    const searchQuery = ref("");
    const isLoadingRecentProducts = ref(true);
    const isLoadingCategories = ref(true);

    const fetchRecentProducts = async () => {
        try {
            const response = await fetch(apiurl("/supplier/explorar/getrecentproductsexplorar"));
            if (!response.ok) throw new Error("Failed to fetch recent products");

            const data = await response.json();
            recentProducts.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingRecentProducts.value = false;
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(apiurl("/supplier/explorar/getcategories"));
            if (!response.ok) throw new Error("Failed to fetch categories");

            const data = await response.json();
            categories.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingCategories.value = false;
        }
    };

    const searchProducts = async () => {
        try {
            const response = await fetch(apiurl(`/supplier/explorar/searchrecentproductsexplorar?query=${searchQuery.value}`));
            if (!response.ok) throw new Error("Failed to search products");

            const data = await response.json();
            searchResults.value = data.data;
        } catch (error) {
            console.error(error);
        }
    };

    const agregarAlCarritoSupplier = (producto) => {
        agregarProductoSupplier(producto);
    };

    onMounted(() => {
        fetchCategories();
        fetchRecentProducts();
    });
</script>
<template>
    <div class="flex flex-col items-center justify-center space-y-4 px-3 py-8 md:py-12 xl:py-16">
        <h1 class="mb-4 text-center text-2xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
            <span class="bg-gradient-to-r from-yellow-400 to-primary-600 bg-clip-text text-transparent">Materiales de Construcción</span>
        </h1>
        <div class="relative w-full max-w-md">
            <UiInput type="text" v-model="searchQuery" @input="searchProducts" placeholder="Buscar General.." class="mb-4 w-full rounded border p-2" />
        </div>
    </div>
    <div v-if="searchQuery">
        <Main v-if="isSearching">
            <ProductCardSkeleton v-for="n in 6" :key="n" />
        </Main>
        <div v-else-if="noResultsFound" class="p-4 text-center text-gray-500">
            No se encontró ningún producto llamado <span class="font-semibold"> {{ searchQuery }} </span>
        </div>

        <Main v-else>
            <p class="col-span-full p-4 text-center text-gray-500">
                Productos encontrados para <span class="font-semibold"> {{ searchQuery }} </span>
            </p>
            <UserProductCard :products="searchResults" @agregar="agregarAlCarritoSupplier" :updatePrice="updatePrice" />
        </Main>
    </div>

    <div>
        <h6 class="p-4 text-xl font-bold">Categorías</h6>
        <Main>
            <SupplierCategoryCard :items="categories" category />
        </Main>
    </div>

    <div>
        <h6 class="p-4 text-xl font-bold">Últimos productos agregados</h6>
        <Main v-if="isLoadingRecentProducts">
            <ProductCardSkeleton v-for="n in 6" :key="n" />
        </Main>
        <Main v-else>
            <ProductCard2 v-for="product in recentProducts" :key="product.id" :product="product" @agregar="agregarAlCarritoSupplier" />
        </Main>
    </div>
</template>
