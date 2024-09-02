<script setup>
    import {ref, onMounted} from "vue";
    import {agregarProducto} from "~/services/usercart";

    const recentProducts = ref([]);
    const searchResults = ref([]);
    const quotedProducts = ref([]);
    const categories = ref([]);
    const searchQuery = ref("");
    const isLoadingRecentProducts = ref(true);
    const isLoadingQuotedProducts = ref(true);
    const isLoadingCategories = ref(true);
    const isSearching = ref(false);
    const noResultsFound = ref(false);
    import {apiurl} from "~/services/api.js";

    const fetchRecentProducts = async () => {
        try {
            const response = await fetch(apiurl("/guest/catalogo/getrecentsupplierproducts"));
            if (!response.ok) throw new Error("Failed to fetch recent products");

            const data = await response.json();
            recentProducts.value = data.data;
            isLoadingRecentProducts.value = false;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMostQuotedProducts = async () => {
        try {
            const response = await fetch(apiurl("/guest/catalogo/getmostquotedproducts"));
            if (!response.ok) throw new Error("Failed to fetch most quoted products");

            const data = await response.json();
            quotedProducts.value = data.data;
            isLoadingQuotedProducts.value = false;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(apiurl("/guest/catalogo/getcategories"));
            if (!response.ok) throw new Error("Failed to fetch categories");

            const data = await response.json();
            categories.value = data.data;
            isLoadingCategories.value = false;
        } catch (error) {
            console.error(error);
        }
    };

    const searchProducts = async () => {
        if (searchQuery.value.trim() === "") {
            searchResults.value = [];
            noResultsFound.value = false;
            isSearching.value = false;
            return;
        }

        isSearching.value = true;
        noResultsFound.value = false;

        try {
            const response = await fetch(apiurl(`/guest/catalogo/search?query=${searchQuery.value}`));
            if (!response.ok) throw new Error("Error fetching products");

            const data = await response.json();
            searchResults.value = data.data;

            if (searchResults.value.length === 0) {
                noResultsFound.value = true;
            }
        } catch (error) {
            console.error(error);
            noResultsFound.value = true;
        } finally {
            isSearching.value = false;
        }
    };

    const agregarAlCarrito = (producto) => {
        agregarProducto(producto, {supplierProductId: producto.id, unitOfMeasure: producto.unitOfMeasure});
    };

    const updatePrice = (product) => {
        console.log("Selected product", product.id);
    };

    onMounted(() => {
        fetchCategories();
        fetchRecentProducts();
        fetchMostQuotedProducts();
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
            <UserProductCard :products="searchResults" @agregar="agregarAlCarrito" :updatePrice="updatePrice" />
        </Main>
    </div>

    <hr />

    <div>
        <p class="py-4 text-center text-lg text-gray-500 md:py-6 md:text-xl">O <span class="font-bold text-gray-900">Buscar</span> por categorias</p>
        <UserMain>
            <UserCategoryCard :items="categories" category />
        </UserMain>
    </div>

    <div>
        <h6 class="p-4 text-xl font-bold">Últimos productos agregados</h6>
        <Main v-if="isLoadingRecentProducts">
            <ProductCardSkeleton v-for="n in 6" :key="n" />
        </Main>
        <Main v-else>
            <UserProductCard :products="recentProducts" @agregar="agregarAlCarrito" :updatePrice="updatePrice" />
        </Main>
    </div>

    <div>
        <h6 class="p-4 text-xl font-bold">Productos más cotizados</h6>
        <Main v-if="isLoadingQuotedProducts">
            <ProductCardSkeleton v-for="n in 6" :key="n" />
        </Main>
        <Main v-else>
            <UserProductCard :products="quotedProducts" @agregar="agregarAlCarrito" :updatePrice="updatePrice" />
        </Main>
    </div>
</template>
