<script setup>
    import {ref, onMounted} from "vue";
    import {useRoute} from "vue-router";
    import {agregarProductoSupplier} from "~/services/suppliercart";
    import {apiurl} from "~/services/api.js";

    const route = useRoute();
    const subcategorySlug = route.params.slug;
    const subcategoryName = ref("");
    const categoryName = ref("");
    const categorySlug = ref("");

    const searchQuery = ref("");
    const searchResults = ref([]);
    const recentProducts = ref([]);
    const isLoadingRecentProducts = ref(true);
    const isLoadingSearchResults = ref(false);

    const agregarAlCarritoSupplier = (producto) => {
        agregarProductoSupplier(producto);
    };

    const updatePrice = (product) => {
        console.log("Selected product", product.id);
    };

    const fetchSubcategoryDetails = async () => {
        try {
            const response = await fetch(apiurl(`/guest/subcategoria/getsubcategorydetailsbyslug/${subcategorySlug}`));
            if (!response.ok) throw new Error("Failed to fetch subcategory details");

            const data = await response.json();
            subcategoryName.value = data.subcategory.name;
            categoryName.value = data.category.name;
            categorySlug.value = data.category.slug;
        } catch (error) {
            console.error("Error fetching subcategory details:", error);
        }
    };

    const fetchRecentProducts = async () => {
        try {
            const response = await fetch(apiurl(`/supplier/subcategoria/getrecentproductsbysubcategory/${subcategorySlug}`));
            if (!response.ok) throw new Error("Failed to fetch recent products");

            const data = await response.json();
            recentProducts.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingRecentProducts.value = false;
        }
    };

    const searchProducts = async () => {
        if (searchQuery.value.trim() === "") {
            searchResults.value = [];
            return;
        }

        try {
            isLoadingSearchResults.value = true;
            const response = await fetch(apiurl(`/supplier/subcategoria/searchrecentproductsbysubcategory/${subcategorySlug}?query=${searchQuery.value}`));
            if (!response.ok) throw new Error("Failed to search products");

            const data = await response.json();
            searchResults.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingSearchResults.value = false;
        }
    };

    onMounted(() => {
        fetchSubcategoryDetails();
        fetchRecentProducts();
    });
</script>
<template>
    <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center">
                <NuxtLink to="/explorar" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600">
                    <svg class="me-2.5 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Inicio
                </NuxtLink>
            </li>
            <li v-if="categorySlug">
                <div class="flex items-center">
                    <svg class="mx-1 h-3 w-3 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <NuxtLink :to="{name: 'explorar-categoria-slug', params: {slug: categorySlug}}" class="ms-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ms-2">
                        {{ categoryName }}
                    </NuxtLink>
                </div>
            </li>
            <li v-if="subcategoryName">
                <div class="flex items-center">
                    <svg class="mx-1 h-3 w-3 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <div class="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                        {{ subcategoryName }}
                    </div>
                </div>
            </li>
        </ol>
    </nav>

    <div class="flex flex-col items-center justify-center space-y-4 px-3 py-8 md:py-12 xl:py-16">
        <h1 class="mb-4 text-center text-2xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
            <span class="bg-gradient-to-r from-yellow-400 to-primary-600 bg-clip-text text-transparent"> {{ subcategoryName }}</span>
        </h1>
        <div class="relative w-full max-w-md">
            <UiInput type="text" v-model="searchQuery" @input="searchProducts" placeholder="Buscar en subcategoria..." class="mb-4 w-full rounded border p-2" />
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
    <hr />

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
