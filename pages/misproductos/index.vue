<script setup>
    import {ref, onMounted} from "vue";
    import {fetchWithAuth, getUserId} from "@/services/auth";
    import {TransitionRoot, TransitionChild} from "@headlessui/vue";
    import {apiurl} from "~/services/api.js";

    const supplierId = getUserId();

    const categories = ref([]);
    const subcategories = ref([]);
    const products = ref([]);
    const searchResults = ref([]);
    const searchQuery = ref("");
    const isLoadingCategories = ref(true);
    const isLoadingProducts = ref(false);
    const isLoadingSearchResults = ref(false);
    const selectedCategory = ref(null);
    const selectedSubcategory = ref(null);

    const fetchCategoriesBySupplier = async () => {
        try {
            const response = await fetchWithAuth(apiurl(`/supplier/misproductos/getcategoriesbysupplier2/${supplierId}`), "GET");
            categories.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingCategories.value = false;
        }
    };

    const fetchSubcategoriesBySupplierAndCategory = async (categoryId) => {
        try {
            const response = await fetchWithAuth(apiurl(`/supplier/misproductos/getsubcategoriesbysupplierandcategory/${supplierId}/${categoryId}`), "GET");
            subcategories.value = response.data;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProductsBySupplier = async () => {
        isLoadingProducts.value = true;
        try {
            const response = await fetchWithAuth(apiurl(`/supplier/misproductos/getproductsbysupplier/${supplierId}`), "GET");
            products.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProducts.value = false;
        }
    };

    const fetchProductsBySupplierAndCategory = async (categoryId) => {
        isLoadingProducts.value = true;
        try {
            const response = await fetchWithAuth(apiurl(`/supplier/misproductos/getproductsbysupplierandcategory/${supplierId}/${categoryId}`), "GET");
            products.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProducts.value = false;
        }
    };

    const fetchProductsBySupplierAndSubcategory = async (subcategoryId) => {
        isLoadingProducts.value = true;
        try {
            const response = await fetchWithAuth(apiurl(`/supplier/misproductos/getproductsbysupplierandsubcategory/${supplierId}/${subcategoryId}`), "GET");
            products.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProducts.value = false;
        }
    };

    const searchProducts = async () => {
        if (!searchQuery.value.trim()) {
            searchResults.value = [];
            return;
        }

        isLoadingSearchResults.value = true;

        try {
            let response;
            if (selectedSubcategory.value) {
                response = await fetchWithAuth(apiurl(`/supplier/misproductos/searchproductsbysupplierandsubcategory/${supplierId}/${selectedSubcategory.value}?query=${searchQuery.value}`), "GET");
            } else if (selectedCategory.value) {
                response = await fetchWithAuth(apiurl(`/supplier/misproductos/searchproductsbysupplierandcategory/${supplierId}/${selectedCategory.value}?query=${searchQuery.value}`), "GET");
            } else {
                response = await fetchWithAuth(apiurl(`/supplier/misproductos/searchproductsbysupplier/${supplierId}?query=${searchQuery.value}`), "GET");
            }

            searchResults.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingSearchResults.value = false;
        }
    };

    const selectCategory = (category) => {
        if (selectedCategory.value === category.id) {
            selectedCategory.value = null;
            selectedSubcategory.value = null;
            subcategories.value = [];
            fetchProductsBySupplier();
        } else {
            selectedCategory.value = category.id;
            selectedSubcategory.value = null;
            fetchSubcategoriesBySupplierAndCategory(category.id);
            fetchProductsBySupplierAndCategory(category.id);
        }
        searchQuery.value = "";
        searchResults.value = [];
    };

    const selectSubcategory = (subcategory) => {
        if (selectedSubcategory.value === subcategory.id) {
            selectedSubcategory.value = null;
            fetchProductsBySupplierAndCategory(selectedCategory.value);
        } else {
            selectedSubcategory.value = subcategory.id;
            fetchProductsBySupplierAndSubcategory(subcategory.id);
        }
        searchQuery.value = "";
        searchResults.value = [];
    };

    onMounted(() => {
        fetchCategoriesBySupplier();
        fetchProductsBySupplier();
    });

    const showModal = ref(false);
    const openModal = () => {
        showModal.value = true;
    };
    const closeModal = () => {
        showModal.value = false;
    };

    const updateProductList = () => {
        if (selectedSubcategory.value) {
            fetchProductsBySupplierAndSubcategory(selectedSubcategory.value);
        } else if (selectedCategory.value) {
            fetchProductsBySupplierAndCategory(selectedCategory.value);
        } else {
            fetchProductsBySupplier();
        }
    };
</script>

<template>
    <SupplierMain class="max-h-[calc(100vh_-_100px)]">
        <div class="overflow-auto rounded-lg border bg-white md:col-span-2">
            <h6 class="p-3 text-lg font-bold">Categorías</h6>
            <div class="overflow-auto">
                <div v-for="category in categories" :key="category.id">
                    <div @click="selectCategory(category)" :class="{'text-black': selectedCategory === category.id, 'text-gray-600': selectedCategory !== category.id}" class="flex cursor-pointer items-center justify-start border-t p-2 hover:bg-primary-200">
                        <div class="flex items-center gap-2">
                            <div class="flex h-full w-full items-center justify-center">
                                <Icon :name="selectedCategory === category.id ? 'my-icon:caret-down' : 'my-icon:caret-right'" size="20" />
                            </div>
                            <div class="flex h-full w-full items-center justify-center">
                                <Icon :name="selectedCategory === category.id ? 'my-icon:folder-open' : 'my-icon:folder-close'" size="20" />
                            </div>
                            <p class="select-none font-sans text-xs font-normal leading-normal antialiased">{{ category.name }}</p>
                        </div>
                    </div>
                    <TransitionRoot :show="selectedCategory === category.id" as="template">
                        <TransitionChild
                            as="div"
                            enter="transition ease-out duration-300 transform"
                            enter-from="-translate-y-4 opacity-0"
                            enter-to="translate-y-0 opacity-100"
                            leave="transition ease-in duration-200 transform"
                            leave-from="translate-y-0 opacity-100"
                            leave-to="-translate-y-4 opacity-0">
                            <div v-if="selectedCategory === category.id">
                                <div
                                    v-for="subcategory in subcategories"
                                    :key="subcategory.id"
                                    @click="selectSubcategory(subcategory)"
                                    :class="{'bg-primary-500 text-white': selectedSubcategory === subcategory.id, 'text-gray-600 hover:bg-primary-200': selectedSubcategory !== subcategory.id}"
                                    class="cursor-pointer border-t p-2 text-gray-400">
                                    <div class="flex items-center gap-2">
                                        <Icon name="my-icon:circles-four" size="20" />
                                        <p class="select-none font-sans text-xs font-normal leading-normal antialiased">{{ subcategory.name }}</p>
                                    </div>
                                </div>
                            </div>
                        </TransitionChild>
                    </TransitionRoot>
                </div>
            </div>
        </div>
        <div :class="['hidden h-full overflow-auto rounded-lg md:block', showMenu ? 'col-span-2 md:col-span-4 xl:col-span-6' : 'col-span-2 md:col-span-4 lg:col-span-6 xl:col-span-8']">
            <div v-if="isLoadingProducts">
                <p>Cargando productos...</p>
            </div>
            <div v-else>
                <div class="mb-4 flex justify-between">
                    <h6 class="p-1.5 text-lg font-bold">{{ selectedSubcategory ? "Buscar Productos en Subcategoría" : selectedCategory ? "Buscar Productos en Categoría" : "Buscar Productos" }}</h6>
                    <UiButton variant="primary" @click="openModal" defaultText="Agregar nuevo producto" />
                </div>
                <UiInput id="search" type="text" v-model="searchQuery" @input="searchProducts" :placeholder="selectedSubcategory ? 'Buscar productos en subcategoría...' : selectedCategory ? 'Buscar productos en categoría...' : 'Buscar productos...'" />
                <div v-if="isLoadingSearchResults">
                    <p>Cargando resultados...</p>
                </div>
                <SupplierSubmain v-else>
                    <SupplierProduct v-for="product in searchResults" :key="product.supplier_product_id" :product="product" />
                    <p v-if="!searchResults.length && searchQuery.trim()">No se encontraron resultados para "{{ searchQuery }}"</p>
                </SupplierSubmain>
                <h6 class="mt-4 p-3 text-lg font-bold">Productos</h6>
                <SupplierSubmain>
                    <SupplierProduct v-for="product in products" :key="product.supplier_product_id" :product="product" />
                </SupplierSubmain>
            </div>
        </div>
    </SupplierMain>

    <SupplierCreateProduct :showModal="showModal" :closeModal="closeModal" :categoryId="selectedCategory" :subcategoryId="selectedSubcategory" @productAdded="updateProductList" />
</template>
