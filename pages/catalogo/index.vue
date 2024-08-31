<script setup>
    import {ref, onMounted} from "vue";
    import {agregarProducto} from "~/services/carrito.js";

    const recentProducts = ref([]);
    const searchResults = ref([]);
    const quotedProducts = ref([]);
    const categories = ref([]);
    const searchQuery = ref("");
    const isLoadingRecentProducts = ref(true);
    const isLoadingQuotedProducts = ref(true);
    const isLoadingCategories = ref(true);

    const fetchRecentProducts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/guest/catalogo/getrecentsupplierproducts");
            if (!response.ok) throw new Error("Failed to fetch recent products");

            const data = await response.json();
            recentProducts.value = data.data;
            isLoadingRecentProducts.value = false;
        } catch (error) {
            console.error(error);
        } finally {
        }
    };

    const fetchMostQuotedProducts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/guest/catalogo/getmostquotedproducts");
            if (!response.ok) throw new Error("Failed to fetch most quoted products");

            const data = await response.json();
            quotedProducts.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingQuotedProducts.value = false;
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/guest/catalogo/getcategories");
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
        if (searchQuery.value.trim() === "") {
            searchResults.value = [];
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/guest/catalogo/search?query=${searchQuery.value}`);
            if (!response.ok) throw new Error("Error fetching products");

            const data = await response.json();
            searchResults.value = data.data;
        } catch (error) {
            console.error(error);
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
    <div>
        <h6 class="p-4 text-xl font-bold">Buscar Productos</h6>
        <Input type="text" v-model="searchQuery" @input="searchProducts" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
        <Main v-if="searchQuery">
            <UserProductCard :products="searchResults" @agregar="agregarAlCarrito" :updatePrice="updatePrice" />
        </Main>
    </div>
    <div>
        <p class="py-4 text-center text-xl text-gray-500"><span class="font-bold text-gray-900">Categorias</span></p>

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
        <Main v-if="isLoadingRecentProducts">
            <ProductCardSkeleton v-for="n in 6" :key="n" />
        </Main>
        <Main v-else>
            <UserProductCard :products="quotedProducts" @agregar="agregarAlCarrito" :updatePrice="updatePrice" />
        </Main>
    </div>
</template>
