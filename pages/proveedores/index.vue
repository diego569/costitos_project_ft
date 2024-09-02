<script setup>
    import {ref, onMounted} from "vue";
    import {showMenu} from "@/services/menuService";
    import {agregarProducto} from "~/services/usercart";
    import {apiurl} from "~/services/api.js";

    const agregarAlCarrito = (producto) => {
        agregarProducto(producto, {supplierProductId: producto.id, unitOfMeasure: producto.unitOfMeasure});
    };

    const updatePrice = (product) => {
        console.log("Selected product", product.id);
    };

    const suppliers = ref([]);
    const isLoadingSuppliers = ref(true);
    const selectedSupplier = ref(null);
    const selectedCategory = ref(null);
    const selectedSubcategory = ref(null);
    const categories = ref([]);
    const subcategories = ref([]);
    const products = ref([]);
    const searchResults = ref([]);
    const searchCategoryResults = ref([]);
    const searchSubcategoryResults = ref([]);
    const searchQuery = ref("");
    const searchCategoryQuery = ref("");
    const searchSubcategoryQuery = ref("");
    const isLoadingCategories = ref(false);
    const isLoadingSubcategories = ref(false);
    const isLoadingProducts = ref(false);
    const showSubcategories = ref(false);
    const showProducts = ref(false);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(apiurl("//guest/proveedores/getsuppliers"));
            if (!response.ok) throw new Error("Failed to fetch suppliers");

            const data = await response.json();
            suppliers.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingSuppliers.value = false;
        }
    };
    const fetchCategoriesBySupplier = async (supplierId) => {
        try {
            isLoadingCategories.value = true;
            const response = await fetch(apiurl(`/guest/proveedores/getcategoriesbysupplier/${supplierId}`));
            if (!response.ok) throw new Error("Failed to fetch categories");

            const data = await response.json();
            categories.value = data.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingCategories.value = false;
        }
    };

    const fetchSubcategoriesByCategoryAndSupplier = async (supplierId, categoryId) => {
        try {
            isLoadingSubcategories.value = true;
            const response = await fetch(apiurl(`/guest/proveedores/getsubcategoriesbysupplier/${supplierId}/${categoryId}`));
            if (!response.ok) throw new Error("Failed to fetch subcategories");

            const data = await response.json();
            subcategories.value = data.data;
            showSubcategories.value = true;
            showProducts.value = false;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingSubcategories.value = false;
        }
    };

    const fetchProductsBySubcategoryAndSupplier = async (supplierId, subcategorySlug) => {
        try {
            isLoadingProducts.value = true;
            const response = await fetch(apiurl(`/guest/proveedores/getproductsbysupplier/${supplierId}/subcategory/${subcategorySlug}`));
            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();
            products.value = data.data;
            showProducts.value = true;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProducts.value = false;
        }
    };

    const searchProducts = async () => {
        if (!selectedSupplier.value) return;
        try {
            const response = await fetch(apiurl(`/guest/proveedores/searchProductsBySupplier/${selectedSupplier.value.id}?query=${searchQuery.value}`));
            if (!response.ok) throw new Error("Failed to search products");

            const data = await response.json();
            searchResults.value = data.data;
        } catch (error) {
            console.error(error);
        }
    };

    const searchProductsByCategory = async () => {
        if (!selectedSupplier.value || !selectedCategory.value) return;
        try {
            const response = await fetch(apiurl(`/guest/proveedores/searchProductsBySupplierAndCategory/${selectedSupplier.value.id}/${selectedCategory.value.id}?query=${searchCategoryQuery.value}`));
            if (!response.ok) throw new Error("Failed to search products in category");

            const data = await response.json();
            searchCategoryResults.value = data.data;
        } catch (error) {
            console.error(error);
        }
    };

    const searchProductsBySubcategory = async () => {
        if (!selectedSupplier.value || !selectedSubcategory.value) return;
        try {
            const response = await fetch(apiurl(`/guest/proveedores/searchProductsBySubcategoryAndSupplier/${selectedSupplier.value.id}/${selectedSubcategory.value.id}?query=${searchSubcategoryQuery.value}`));
            if (!response.ok) throw new Error("Failed to search products in subcategory");

            const data = await response.json();
            searchSubcategoryResults.value = data.data;
        } catch (error) {
            console.error(error);
        }
    };

    const selectSupplier = (supplier) => {
        selectedSupplier.value = supplier;
        selectedCategory.value = null;
        selectedSubcategory.value = null;
        fetchCategoriesBySupplier(supplier.id);
        showSubcategories.value = false;
        showProducts.value = false;
        searchQuery.value = "";
        searchCategoryQuery.value = "";
        searchSubcategoryQuery.value = "";
        searchResults.value = [];
        searchCategoryResults.value = [];
        searchSubcategoryResults.value = [];
    };

    const selectCategory = (category) => {
        selectedCategory.value = category;
        selectedSubcategory.value = null;
        fetchSubcategoriesByCategoryAndSupplier(selectedSupplier.value.id, category.id);
        searchCategoryQuery.value = "";
        searchSubcategoryQuery.value = "";
        searchCategoryResults.value = [];
        searchSubcategoryResults.value = [];
    };

    const selectSubcategory = (subcategory) => {
        selectedSubcategory.value = subcategory;
        fetchProductsBySubcategoryAndSupplier(selectedSupplier.value.id, subcategory.slug);
        searchSubcategoryQuery.value = "";
        searchSubcategoryResults.value = [];
    };

    const goBackToCategories = () => {
        showSubcategories.value = false;
        showProducts.value = false;
        selectedCategory.value = null;
        selectedSubcategory.value = null;
        searchCategoryQuery.value = "";
        searchSubcategoryQuery.value = "";
        searchCategoryResults.value = [];
        searchSubcategoryResults.value = [];
    };

    const goBackToSubcategories = () => {
        showProducts.value = false;
        showSubcategories.value = true;
        selectedSubcategory.value = null;
        searchSubcategoryQuery.value = "";
        searchSubcategoryResults.value = [];
    };

    onMounted(() => {
        fetchSuppliers();
    });
</script>
<template>
    <Main class="max-h-[calc(100vh_-_100px)]">
        <div class="col-span-3 overflow-auto border bg-white md:col-span-2">
            <h6 class="p-3 text-lg font-bold">Proveedores - {{ suppliers.length }}</h6>
            <div class="overflow-auto">
                <div v-for="supplier in suppliers" :key="supplier.id" class="cursor-pointer border-t p-3 hover:bg-primary-400" :class="{'bg-primary-400 text-white': selectedSupplier && selectedSupplier.id === supplier.id}" @click="selectSupplier(supplier)">
                    <h2 class="text-sm font-medium">{{ supplier.name }}</h2>
                </div>
            </div>
        </div>
        <div :class="['hidden h-full overflow-auto rounded-lg md:block', showMenu ? 'col-span-2 2xl:col-span-3' : 'col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-5']">
            <div v-if="selectedSupplier">
                <p class="text-base text-gray-500">
                    {{ selectedSupplier.name }}
                    <template v-if="selectedCategory"> / {{ selectedCategory.name }} </template>
                    <template v-if="selectedSubcategory"> / {{ selectedSubcategory.name }} </template>
                </p>
                <div v-if="showProducts">
                    <button @click="goBackToSubcategories" class="mb-4 text-sm text-blue-500 underline">Atrás a Subcategorías</button>
                    <div v-if="isLoadingProducts">
                        <p>Cargando productos...</p>
                    </div>
                    <div v-else>
                        <div>
                            <h6 class="p-3 text-lg font-bold">Buscar Productos en Subcategoría</h6>
                            <input type="text" v-model="searchSubcategoryQuery" @input="searchProductsBySubcategory" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
                            <div v-if="searchSubcategoryQuery">
                                <Main2 v-if="searchSubcategoryResults.length"> </Main2>
                                <p v-else>No se encontraron resultados para "{{ searchSubcategoryQuery }}"</p>
                            </div>
                        </div>
                        <div>
                            <h6 class="p-3 text-lg font-bold">Productos</h6>

                            <Main2> <UserProductCard :products="products" @agregar="agregarAlCarrito" :updatePrice="updatePrice" /> </Main2>
                        </div>
                    </div>
                </div>
                <div v-else-if="showSubcategories">
                    <button @click="goBackToCategories" class="mb-4 text-sm text-blue-500 underline">Atrás a Categorías</button>
                    <div v-if="isLoadingSubcategories">
                        <p>Cargando subcategorías...</p>
                    </div>
                    <div v-else>
                        <div>
                            <h6 class="p-3 text-lg font-bold">Buscar Productos en Categoría</h6>
                            <input type="text" v-model="searchCategoryQuery" @input="searchProductsByCategory" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
                            <div v-if="searchCategoryQuery">
                                <Main2 v-if="searchCategoryResults.length">
                                    <UserProductCard :products="searchCategoryResults" @agregar="agregarAlCarrito" :updatePrice="updatePrice" />
                                </Main2>
                                <p v-else>No se encontraron resultados para "{{ searchCategoryQuery }}"</p>
                            </div>
                        </div>
                        <div>
                            <h6 class="p-3 text-lg font-bold">Subcategorías</h6>

                            <Main2>
                                <CategoryCard2 v-for="subcategory in subcategories" :key="subcategory.id" :category="subcategory" :onSelect="selectSubcategory" />
                            </Main2>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div v-if="isLoadingCategories">
                        <p>Cargando categorías...</p>
                    </div>
                    <div v-else>
                        <div>
                            <h6 class="p-3 text-lg font-bold">Buscar Productos</h6>
                            <input type="text" v-model="searchQuery" @input="searchProducts" placeholder="Buscar productos..." class="mb-4 w-full rounded border p-2" />
                            <div v-if="searchQuery">
                                <Main2 v-if="searchResults.length">
                                    <UserProductCard :products="searchResults" @agregar="agregarAlCarrito" :updatePrice="updatePrice" />
                                </Main2>
                                <p v-else>No se encontraron resultados para "{{ searchQuery }}"</p>
                            </div>
                        </div>
                        <div>
                            <h6 class="p-3 text-lg font-bold">Categorías</h6>
                            <Main2>
                                <CategoryCard2 v-for="category in categories" :key="category.id" :category="category" :onSelect="selectCategory" />
                            </Main2>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="size-full bg-white"></div>
        </div>
    </Main>
</template>
