<script setup>
    import {ref, onMounted} from "vue";
    import {agregarProductoSupplier, obtenerCarritoSupplier} from "~/services/carritosupplier.js";

    const recentProducts = ref([]);
    const categories = ref([]);
    const searchResults = ref([]);
    const searchQuery = ref("");
    const isLoadingRecentProducts = ref(true);
    const isLoadingCategories = ref(true);

    const fetchRecentProducts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/supplier/explorar/getrecentproductsexplorar");
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
            const response = await fetch("http://localhost:8000/api/supplier/explorar/getcategories");
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
            const response = await fetch(`http://localhost:8000/api/supplier/explorar/searchrecentproductsexplorar?query=${searchQuery.value}`);
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
    <div>
        <h6 class="p-4 text-xl font-bold">Buscar Productos</h6>
        <input type="text" v-model="searchQuery" @input="searchProducts" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
        <div v-if="searchQuery">
            <Main v-if="searchResults.length">
                <ProductCard2 v-for="product in searchResults" :key="product.id" :product="product" @agregar="agregarAlCarritoSupplier" />
            </Main>
            <p v-else>No se encontraron resultados para "{{ searchQuery }}"</p>
        </div>
    </div>
    <div>
        <h6 class="p-4 text-xl font-bold">Categorías</h6>
        <Main>
            <CategoryCard3 v-for="category in categories" :key="category.id" :category="category" />
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
