<script setup>
    import {ref, onMounted} from "vue";
    import {useRoute} from "vue-router";
    import {agregarProductoSupplier, obtenerCarritoSupplier} from "~/services/carritosupplier.js";

    const route = useRoute();
    const categorySlug = route.params.slug;

    const subcategories = ref([]);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const recentProducts = ref([]);
    const isLoadingSubcategories = ref(true);
    const isLoadingRecentProducts = ref(true);
    const isLoadingSearchResults = ref(false);

    const agregarAlCarritoSupplier = (producto) => {
        agregarProductoSupplier(producto);
    };

    const updatePrice = (product) => {
        console.log("Selected product", product.id);
    };

    const fetchSubcategories = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/supplier/categoria/getsubcategoriesbycategoryslug/${categorySlug}`);
            if (!response.ok) throw new Error("Failed to fetch subcategories");

            const data = await response.json();
            subcategories.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingSubcategories.value = false;
        }
    };

    const fetchRecentProducts = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/supplier/categoria/getrecentproductsbycategory/${categorySlug}`);
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
            const response = await fetch(`http://localhost:8000/api/supplier/categoria/searchrecentproductsbycategory/${categorySlug}?query=${searchQuery.value}`);
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
        fetchSubcategories();
        fetchRecentProducts();
    });
</script>
<template>
    <div>
        <h6 class="p-4 text-xl font-bold">Buscar Productos</h6>
        <input type="text" v-model="searchQuery" @input="searchProducts" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
        <Main v-if="searchQuery.trim()">
            <div v-if="isLoadingSearchResults">Cargando resultados...</div>
            <ProductCard2 v-if="searchResults.length" v-for="product in searchResults" :key="product.id" :product="product" :updatePrice="updatePrice" @agregar="agregarAlCarrito" />
            <p v-else>No se encontraron resultados para "{{ searchQuery }}"</p>
        </Main>
    </div>

    <div>
        <h6 class="p-4 text-xl font-bold">Subcategorías</h6>
        <Main>
            <CategoryCard3 v-for="subcategory in subcategories" :key="subcategory.id" :subcategory="subcategory" />
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
