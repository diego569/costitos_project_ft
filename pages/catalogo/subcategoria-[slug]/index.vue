<script setup>
    import {ref, onMounted} from "vue";
    import {useRoute} from "vue-router";
    import {showMenu} from "@/services/menuService";
    import {agregarProducto} from "~/services/carrito.js";

    const route = useRoute();
    const subcategorySlug = route.params.slug;

    const subcategories = ref([]);
    const products = ref([]);
    const mostQuotedProducts = ref([]);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const isLoadingSubcategories = ref(false); // No necesitamos cargar subcategorías en subcategoría
    const isLoadingRecentProducts = ref(true);
    const isLoadingMostQuotedProducts = ref(true);

    const agregarAlCarrito = (producto) => {
        agregarProducto(producto, {supplierProductId: producto.id, unitOfMeasure: producto.unitOfMeasure});
    };

    const updatePrice = (product) => {
        console.log("Selected product", product.id);
    };

    const fetchRecentProducts = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/guest/subcategoria/getrecentsupplierproductsbysubcategory/${subcategorySlug}`);
            if (!response.ok) throw new Error("Failed to fetch recent products");

            const data = await response.json();
            products.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingRecentProducts.value = false;
        }
    };

    const fetchMostQuotedProducts = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/guest/subcategoria/getmostquotedproductsbysubcategory/${subcategorySlug}`);
            if (!response.ok) throw new Error("Failed to fetch most quoted products");

            const data = await response.json();
            mostQuotedProducts.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingMostQuotedProducts.value = false;
        }
    };

    const searchProducts = async () => {
        if (searchQuery.value.trim() === "") {
            searchResults.value = [];
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/guest/subcategoria/searchsupplierproductsbysubcategory/${subcategorySlug}?query=${searchQuery.value}`);
            if (!response.ok) throw new Error("Failed to search products");

            const data = await response.json();
            searchResults.value = data.data;
        } catch (error) {
            console.error(error);
        }
    };

    onMounted(() => {
        fetchRecentProducts();
        fetchMostQuotedProducts();
    });
</script>

<template>
    <div>
        <h6 class="p-4 text-xl font-bold">Buscar Productos</h6>
        <input type="text" v-model="searchQuery" @input="searchProducts" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
        <Main v-if="searchQuery">
            <ProductCard v-for="product in searchResults" :key="product.id" :product="product" :updatePrice="updatePrice" @agregar="agregarAlCarrito" />
        </Main>
    </div>

    <div>
        <h6 class="p-4 text-xl font-bold">Últimos productos agregados</h6>
        <Main v-if="isLoadingRecentProducts">
            <ProductCardSkeleton v-for="n in 6" :key="n" />
        </Main>
        <Main v-else>
            <ProductCard v-for="product in products" :key="product.id" :product="product" :updatePrice="updatePrice" @agregar="agregarAlCarrito" />
        </Main>
    </div>

    <div>
        <h6 class="p-4 text-xl font-bold">Productos más cotizados</h6>
        <Main v-if="isLoadingMostQuotedProducts">
            <ProductCardSkeleton v-for="n in 6" :key="n" />
        </Main>
        <Main v-else>
            <ProductCard v-for="product in mostQuotedProducts" :key="product.id" :product="product" :updatePrice="updatePrice" @agregar="agregarAlCarrito" />
        </Main>
    </div>
</template>
